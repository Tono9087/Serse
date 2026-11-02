// Single source of truth for business and contact data.
// Every component, page and helper must import from here instead of hard-coding values.
// Optional overrides can be provided at build time with Vite env vars (see README):
//   VITE_WHATSAPP_NUMBER, VITE_PHONE_DISPLAY, VITE_CONTACT_EMAIL
const env = import.meta.env ?? {};

/** Commercial name shown in UI, page titles and the WhatsApp quote message. */
export const BUSINESS_NAME = "Grupo SERSE";

/** Digits only, with country code. Used for https://wa.me/<number> links. Owner must confirm. */
export const WHATSAPP_NUMBER = String(
  env.VITE_WHATSAPP_NUMBER ?? "5216145341188"
).replace(/\D/g, "");

/** Human-readable phone shown in the UI. */
export const PHONE_DISPLAY = env.VITE_PHONE_DISPLAY ?? "+52 614 490 1653";

/** tel: link derived from PHONE_DISPLAY (empty when no phone is configured). */
export const PHONE_HREF = PHONE_DISPLAY
  ? `tel:${PHONE_DISPLAY.replace(/[^\d+]/g, "")}`
  : "";

/**
 * Commercial contact email. UNKNOWN for now: while empty, no email text, link or mailto is rendered.
 * Set it here (or via VITE_CONTACT_EMAIL) as soon as the owner confirms it.
 */
export const EMAIL_CONTACT = env.VITE_CONTACT_EMAIL ?? "";

export const SITE = {
  badge: "MRO",
  tagline: "Soluciones estratégicas en Mantenimiento, Reparación y Operación (MRO).",
  location: "Chihuahua, Chihuahua, México",
  privacyUrl: "/aviso-privacidad",
  legalEntityPlaceholder: "Grupo SERSE (denominación o razón social sujeta a confirmación por el titular)",
  legalAddressPlaceholder: "Chihuahua, Chihuahua, México (domicilio fiscal completo por confirmar)",
  siteUrl: "https://gruposerse.com",
  clients: [
    { name: "Harman", logo: "/images/clients/harman.png" },
    { name: "American Industries", logo: "/images/clients/american-industries.png" },
    { name: "BWI Group", logo: "/images/clients/bwi-group.png" },
  ],
};