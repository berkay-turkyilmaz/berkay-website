/**
 * n8n webhook targets. Server-only: these URLs are read inside API routes and
 * never shipped to the browser. Override with CONTACT_WEBHOOK_URL / BOOKING_WEBHOOK_URL.
 */
const DEFAULT_CONTACT_WEBHOOK =
  "https://n8n.138.197.186.170.sslip.io/webhook/contact-form";
const DEFAULT_BOOKING_WEBHOOK =
  "https://n8n.138.197.186.170.sslip.io/webhook/berber-randevu";

export const WEBHOOKS = {
  contact: process.env.CONTACT_WEBHOOK_URL ?? DEFAULT_CONTACT_WEBHOOK,
  booking: process.env.BOOKING_WEBHOOK_URL ?? DEFAULT_BOOKING_WEBHOOK,
} as const;
