# Contact system setup

The React form sends `POST /api/contact` to the Vercel Node.js Function in the same repository. The function validates the request and delivers mail through Nodemailer and your SMTP provider.

## Vercel Environment Variables

Configure these seven variables in the Vercel project under **Settings → Environment Variables** for Production and any Preview environment that should send mail:

- `SMTP_HOST`: SMTP server hostname supplied by your email provider.
- `SMTP_PORT`: SMTP port. Use `587` for STARTTLS unless your provider specifies another port.
- `SMTP_SECURE`: Use `false` for port 587 or `true` for implicit TLS on port 465.
- `SMTP_USER`: SMTP account username.
- `SMTP_PASS`: SMTP password or provider-generated app password.
- `MAIL_FROM`: Verified sender email address used by the portfolio.
- `MAIL_TO`: Inbox that should receive portfolio inquiries.

Redeploy after changing environment variables. Never prefix SMTP variables with `VITE_` or `REACT_APP_`; those prefixes can expose values to client code.

For local end-to-end API testing, copy `.env.example` to an ignored `.env.local`, add development credentials, and run the project with Vercel's local development command so the React app and `/api/contact` function are served together.

## Abuse protection

The endpoint uses a honeypot, strict server validation, payload and field limits, duplicate frontend submission protection, and best-effort per-instance request throttling. The in-memory throttle is not distributed or durable across Vercel Functions. If stronger protection is needed, add a durable rate limiter such as Vercel KV/Upstash Redis, or configure Vercel Firewall rate-limiting rules for `/api/contact`.
