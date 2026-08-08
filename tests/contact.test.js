import assert from "node:assert/strict";
import test from "node:test";
import nodemailer from "nodemailer";
import handler from "../api/contact.js";

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    payload: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

function createRequest(overrides = {}) {
  return {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.10" },
    body: {
      name: "Test Visitor",
      email: "visitor@example.com",
      subject: "New website",
      message: "I would like to discuss a new full-stack project.",
      website: "",
    },
    ...overrides,
  };
}

test("rejects unsupported methods", async () => {
  const response = createResponse();
  await handler(createRequest({ method: "GET" }), response);
  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, "POST");
});

test("rejects honeypot submissions", async () => {
  const response = createResponse();
  const request = createRequest({
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.11" },
    body: { ...createRequest().body, website: "https://spam.example" },
  });
  await handler(request, response);
  assert.equal(response.statusCode, 400);
});

test("rejects non-JSON and oversized payloads", async () => {
  const wrongTypeResponse = createResponse();
  await handler(createRequest({
    headers: { "content-type": "text/plain", "x-forwarded-for": "203.0.113.14" },
  }), wrongTypeResponse);
  assert.equal(wrongTypeResponse.statusCode, 400);

  const oversizedResponse = createResponse();
  await handler(createRequest({
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.15" },
    body: { ...createRequest().body, message: "x".repeat(12_001) },
  }), oversizedResponse);
  assert.equal(oversizedResponse.statusCode, 400);
  assert.equal(oversizedResponse.payload.message, "Request payload is too large.");
});

test("rejects header injection attempts", async () => {
  const response = createResponse();
  await handler(createRequest({
    headers: { "content-type": "application/json; charset=utf-8", "x-forwarded-for": "203.0.113.16" },
    body: { ...createRequest().body, subject: "Inquiry\r\nBcc: attacker@example.com" },
  }), response);
  assert.equal(response.statusCode, 400);
});

test("returns 429 after the per-instance request threshold", async () => {
  let response;
  for (let index = 0; index < 6; index += 1) {
    response = createResponse();
    await handler(createRequest({
      headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.12" },
      body: { ...createRequest().body, name: "" },
    }), response);
  }
  assert.equal(response.statusCode, 429);
  assert.ok(response.headers["Retry-After"]);
});

test("sends validated mail with fixed from, visitor replyTo, and escaped HTML", async () => {
  const previousCreateTransport = nodemailer.createTransport;
  const sentMessages = [];
  nodemailer.createTransport = () => ({
    sendMail: async (message) => { sentMessages.push(message); },
  });

  const environment = {
    SMTP_HOST: "smtp.example.com",
    SMTP_PORT: "587",
    SMTP_SECURE: "false",
    SMTP_USER: "smtp-user",
    SMTP_PASS: "smtp-pass",
    MAIL_FROM: "portfolio@example.com",
    MAIL_TO: "inbox@example.com",
  };
  const previousEnvironment = Object.fromEntries(Object.keys(environment).map((key) => [key, process.env[key]]));
  Object.assign(process.env, environment);

  try {
    const response = createResponse();
    await handler(createRequest({
      headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.13" },
      body: { ...createRequest().body, message: "Build <script>alert('x')</script> safely." },
    }), response);

    assert.equal(response.statusCode, 200);
    assert.equal(sentMessages.length, 1);
    assert.equal(sentMessages[0].from, '"Ali Khan Portfolio" <portfolio@example.com>');
    assert.equal(sentMessages[0].replyTo, "visitor@example.com");
    assert.equal(sentMessages[0].to, "inbox@example.com");
    assert.match(sentMessages[0].subject, /^Portfolio Inquiry — /);
    assert.doesNotMatch(sentMessages[0].html, /<script>/);
    assert.match(sentMessages[0].html, /&lt;script&gt;/);
  } finally {
    nodemailer.createTransport = previousCreateTransport;
    for (const [key, value] of Object.entries(previousEnvironment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
