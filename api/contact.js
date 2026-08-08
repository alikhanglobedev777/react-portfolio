import nodemailer from "nodemailer";

const ALLOWED_FIELDS = new Set(["name", "email", "subject", "message", "website"]);
const MAX_PAYLOAD_BYTES = 12_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// This map is instance-local and intentionally treated as best-effort only.
// It is not reliable distributed rate limiting across Vercel instances.
const requestBuckets = new Map();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const headerBreakPattern = /[\r\n]/;

function respond(response, status, body) {
  response.status(status).json(body);
}

function getClientIp(request) {
  const forwarded = request.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return request.socket?.remoteAddress || null;
}

function checkRateLimit(ip) {
  if (!ip) return { limited: false };

  const now = Date.now();
  for (const [key, bucket] of requestBuckets) {
    if (bucket.resetAt <= now) requestBuckets.delete(key);
  }

  const existing = requestBuckets.get(ip);
  if (!existing || existing.resetAt <= now) {
    requestBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { limited: true, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { limited: false };
}

function parseBody(body) {
  if (typeof body === "string") return JSON.parse(body);
  return body;
}

function validatePayload(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { error: "Invalid request payload." };
  }

  const keys = Object.keys(input);
  if (keys.some((key) => !ALLOWED_FIELDS.has(key))) {
    return { error: "Invalid request payload." };
  }

  let payloadSize;
  try {
    payloadSize = Buffer.byteLength(JSON.stringify(input), "utf8");
  } catch {
    return { error: "Invalid request payload." };
  }
  if (payloadSize > MAX_PAYLOAD_BYTES) return { error: "Request payload is too large." };

  const fields = {};
  for (const field of ALLOWED_FIELDS) {
    const value = input[field] ?? "";
    if (typeof value !== "string") return { error: `Invalid ${field}.` };
    fields[field] = value.trim();
  }

  if (fields.website.length > 0) return { error: "Unable to submit this request." };
  if (fields.name.length < 2 || fields.name.length > 100 || headerBreakPattern.test(fields.name)) {
    return { error: "Name must be between 2 and 100 characters." };
  }
  if (fields.email.length < 6 || fields.email.length > 254 || !emailPattern.test(fields.email) || headerBreakPattern.test(fields.email)) {
    return { error: "Enter a valid email address." };
  }
  if (fields.subject.length < 3 || fields.subject.length > 150 || headerBreakPattern.test(fields.subject)) {
    return { error: "Subject must be between 3 and 150 characters." };
  }
  if (fields.message.length < 10 || fields.message.length > 5_000) {
    return { error: "Message must be between 10 and 5,000 characters." };
  }

  return { data: fields };
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getMailConfiguration() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASS", "MAIL_FROM", "MAIL_TO"];
  if (required.some((key) => !process.env[key])) throw new Error("Missing mail configuration");

  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) throw new Error("Invalid mail configuration");
  if (!['true', 'false'].includes(process.env.SMTP_SECURE.toLowerCase())) throw new Error("Invalid mail configuration");

  return {
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE.toLowerCase() === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
  };
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    respond(response, 405, { ok: false, message: "Method not allowed." });
    return;
  }

  const contentType = request.headers?.["content-type"] || "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType.trim())) {
    respond(response, 400, { ok: false, message: "Invalid request payload." });
    return;
  }

  const rateLimit = checkRateLimit(getClientIp(request));
  if (rateLimit.limited) {
    response.setHeader("Retry-After", String(rateLimit.retryAfter));
    respond(response, 429, { ok: false, message: "Too many requests. Please try again later." });
    return;
  }

  let input;
  try {
    if (typeof request.body === "string" && Buffer.byteLength(request.body, "utf8") > MAX_PAYLOAD_BYTES) {
      respond(response, 400, { ok: false, message: "Request payload is too large." });
      return;
    }
    input = parseBody(request.body);
  } catch {
    respond(response, 400, { ok: false, message: "Invalid request payload." });
    return;
  }

  const validation = validatePayload(input);
  if (validation.error) {
    respond(response, 400, { ok: false, message: validation.error });
    return;
  }

  try {
    const mail = getMailConfiguration();
    const { name, email, subject, message } = validation.data;
    const receivedAt = new Date().toISOString();
    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      subject: escapeHtml(subject),
      message: escapeHtml(message).replaceAll("\n", "<br>"),
      receivedAt: escapeHtml(receivedAt),
    };

    const transporter = nodemailer.createTransport({
      host: mail.host,
      port: mail.port,
      secure: mail.secure,
      auth: { user: mail.user, pass: mail.pass },
    });

    await transporter.sendMail({
      from: `"Ali Khan Portfolio" <${mail.from}>`,
      replyTo: email,
      to: mail.to,
      subject: `Portfolio Inquiry — ${subject}`,
      text: [
        "NEW PORTFOLIO INQUIRY",
        "",
        `NAME\n${name}`,
        `EMAIL\n${email}`,
        `SUBJECT\n${subject}`,
        `MESSAGE\n${message}`,
        `DATE/TIME\n${receivedAt}`,
      ].join("\n\n"),
      html: `
        <div style="font-family:Arial,sans-serif;color:#111;line-height:1.6;max-width:680px">
          <h1 style="font-size:24px;margin:0 0 28px">NEW PORTFOLIO INQUIRY</h1>
          <p><strong>NAME</strong><br>${safe.name}</p>
          <p><strong>EMAIL</strong><br>${safe.email}</p>
          <p><strong>SUBJECT</strong><br>${safe.subject}</p>
          <p><strong>MESSAGE</strong><br>${safe.message}</p>
          <p><strong>DATE/TIME</strong><br>${safe.receivedAt}</p>
        </div>
      `,
    });

    respond(response, 200, { ok: true, message: "Message received." });
  } catch {
    console.error("Contact delivery failed.");
    respond(response, 500, { ok: false, message: "Unable to send your message right now. Please try again later." });
  }
}
