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

## Gmail and deployment troubleshooting

For Gmail, use `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, and
`SMTP_SECURE=true`. Use a newly generated Google app password for
`SMTP_PASS` (with two-step verification enabled) and the authenticated Gmail
address for `SMTP_USER` and `MAIL_FROM`. Set `MAIL_TO` to the intended inbox.
Do not reuse credentials exposed in Git history. Never commit actual values.

Both main and master should deploy the current portfolio, not the old
empty package manifest. Vercel should use the Vite preset with output
directory `dist` and build command `npm run build`.

If delivery fails, open the Vercel runtime logs for `/api/contact`.
The function records only a safe error category and names of missing
environment variables. `MAIL_CONFIG_MISSING` indicates missing variables;
`MAIL_CONFIG_INVALID` indicates a port/TLS configuration problem;
`EAUTH` indicates an authentication failure; and `ETIMEDOUT` or
`ECONNECTION` indicates a connection problem. Do not paste secrets into logs.
The form also offers an explicit email-app fallback, without falsely
reporting successful delivery.
