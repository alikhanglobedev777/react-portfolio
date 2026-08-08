import { Buffer } from "node:buffer";
import { cwd, env as processEnvironment } from "node:process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const SERVER_ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "MAIL_FROM",
  "MAIL_TO",
];

const MAX_CONTACT_BODY_BYTES = 12_000;

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let tooLarge = false;

    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_CONTACT_BODY_BYTES) {
        tooLarge = true;
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      if (tooLarge) {
        const error = new Error("Payload too large");
        error.statusCode = 400;
        reject(error);
        return;
      }
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    request.on("error", reject);
  });
}

function attachVercelResponseHelpers(response) {
  response.status = (statusCode) => {
    response.statusCode = statusCode;
    return response;
  };
  response.json = (payload) => {
    if (!response.headersSent) response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify(payload));
  };
}

function localContactApi() {
  let handlerPromise;

  return {
    name: "local-contact-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = request.url?.split("?", 1)[0];
        if (pathname !== "/api/contact") {
          next();
          return;
        }

        try {
          attachVercelResponseHelpers(response);
          if (request.method === "POST") request.body = await readRequestBody(request);
          handlerPromise ||= import("./api/contact.js").then((module) => module.default);
          const handler = await handlerPromise;
          await handler(request, response);
        } catch (error) {
          if (response.headersSent || response.writableEnded) return;
          const statusCode = error?.statusCode === 400 ? 400 : 500;
          response.statusCode = statusCode;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify({
            ok: false,
            message: statusCode === 400
              ? "Invalid request payload."
              : "Unable to send your message right now. Please try again later.",
          }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const serverEnvironment = loadEnv(mode, cwd(), "");
  SERVER_ENV_KEYS.forEach((key) => {
    if (!processEnvironment[key] && serverEnvironment[key]) processEnvironment[key] = serverEnvironment[key];
  });

  return {
    plugins: [react(), localContactApi()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (/[\\/]three[\\/]src[\\/]renderers[\\/]shaders[\\/]/.test(id)) return "three-shaders";
            return undefined;
          },
        },
      },
    },
  };
});
