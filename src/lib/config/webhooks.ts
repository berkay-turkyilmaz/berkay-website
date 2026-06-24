const DEFAULT_CONTACT_WEBHOOK =
  "https://n8n.138.197.186.170.sslip.io/webhook/contact-form";
const DEFAULT_BOOKING_WEBHOOK =
  "https://n8n.138.197.186.170.sslip.io/webhook/berber-randevu";
const DEFAULT_PROJECTS_WEBHOOK =
  "https://n8n.ipadresim.sslip.io/webhook/projects-bring";

export const WEBHOOKS = {
  contact: process.env.NEXT_PUBLIC_N8N_CONTACT_WEBHOOK ?? DEFAULT_CONTACT_WEBHOOK,
  booking: process.env.NEXT_PUBLIC_N8N_BOOKING_WEBHOOK ?? DEFAULT_BOOKING_WEBHOOK,
  projects: process.env.NEXT_PUBLIC_N8N_PROJECTS_WEBHOOK ?? DEFAULT_PROJECTS_WEBHOOK,
} as const;
