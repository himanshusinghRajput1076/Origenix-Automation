# Origenix Outreach Platform

A full-stack starter for **consent-based** WhatsApp template messaging and automated voice notifications.

## Included

- Next.js full-stack dashboard
- PostgreSQL + Prisma
- CSV contact import
- E.164 phone validation
- Consent evidence and opt-out suppression
- WhatsApp Cloud API template sending
- Twilio outbound voice calls
- Delivery-status webhooks
- Campaign logs, rate limits and batch caps

## Important

This platform must not be used for unsolicited bulk messaging or robocalling. Use only contacts who gave specific, recorded permission. Follow Meta WhatsApp Business rules, telecom-provider rules, calling-hour restrictions, DND preferences, local privacy law, and India's TRAI/DLT requirements where applicable.

## Setup

1. Install Node.js 20+ and PostgreSQL.
2. Copy `.env.example` to `.env`.
3. Add database, Meta and Twilio credentials.
4. Run:

```bash
npm install
npm run db:push
npm run dev
```

5. Open `http://localhost:3000`.

## WhatsApp setup

- Create a Meta business app.
- Add WhatsApp Cloud API.
- Add and verify a business phone number.
- Create and obtain approval for message templates.
- Configure webhook URL:
  - `https://YOUR_DOMAIN/api/webhooks/whatsapp`
- Use the verification token from `.env`.

Campaigns use approved template names. Do not automate WhatsApp Web, QR sessions, browser clicks, or unofficial libraries.

## Twilio Voice setup

- Create a Twilio account.
- Obtain a voice-capable number.
- Add Account SID, Auth Token and From number.
- Set `APP_BASE_URL` to a publicly reachable HTTPS domain.
- Twilio will request:
  - `/api/voice/twiml`
  - `/api/webhooks/twilio/status`

## Production improvements required

Before real production use, add:

- Authentication and role-based access
- Background job queue such as BullMQ/SQS
- Encrypted secrets and field-level data encryption
- CSRF protection and strict webhook signature verification
- Consent evidence uploads
- Calling-time and geography rules
- DLT/header/template integration for Indian SMS if added
- Per-tenant billing and usage limits
- Campaign approval workflow
- Data-retention and deletion controls
- Monitoring and alerting
- Provider-specific retry policies

## Deployment

Suitable options:

- Frontend/API: Render, Railway, Fly.io, AWS, Azure or Google Cloud
- PostgreSQL: Render Postgres, Neon, Supabase or managed cloud PostgreSQL
- Use a public HTTPS domain for provider webhooks.

## CSV format

```csv
phone,name,consent,consentSource
+919876543210,Example,true,Website enquiry form on 2026-07-10
```

Only rows with `consent=true` and a non-empty `consentSource` are imported.

## Client and tender finder

The project now includes a discovery CRM at `/leads` with:

- Google Programmable Search integration for public web results
- EU TED procurement search
- SAM.gov opportunities search
- Saved searches by country and service
- Lead type classification: client, tender or partnership
- Automatic service-tag detection
- Startup-suitability and relevance scoring
- Deadline, contact and budget signals
- Deduplication using URL/title fingerprints
- Lead review statuses and audit logs
- A protected cron/API endpoint at `/api/discovery/run`

This does **not** literally crawl the whole internet. No responsible system can guarantee that. It searches configured public APIs and permitted public sources. It must not bypass authentication, CAPTCHAs, paywalls, robots exclusions, access controls, or collect private personal data.

### Recommended saved searches

- Germany: `(Softwareentwicklungspartner OR IT-Dienstleister gesucht OR Ausschreibung) (KI OR App OR Cybersecurity OR Cloud)`
- India: `(RFP OR Tender OR EOI OR quotation) (software development OR mobile app OR AI OR cybersecurity)`
- Gulf: `(vendor registration OR RFP OR technology partner) (UAE OR Saudi OR Qatar) (software OR AI OR cloud)`
- Global agencies: `("white label development partner" OR "offshore development partner") (web OR mobile OR AI)`

### Scheduling discovery

Call the endpoint from Render Cron, GitHub Actions or another scheduler:

```bash
curl -H "Authorization: Bearer $DISCOVERY_CRON_SECRET" https://YOUR_DOMAIN/api/discovery/run
```

Use a daily or twice-daily schedule. Review leads manually before contacting them and only message contacts through channels where you have a lawful basis and the platform permits outreach.
