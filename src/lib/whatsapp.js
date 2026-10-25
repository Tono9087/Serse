import { SITE } from "../config/site.js";

/**
 * Sanitizes customer-entered text:
 * trim, collapse 3+ newlines to 2, strip * and _ so WhatsApp formatting cannot break.
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function sanitizeUserText(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/[*_]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Builds the exact Spanish WhatsApp RFQ message required by section 9.3.
 * @param {Object} params
 * @param {Object} params.customer
 * @param {Array<Object>} params.lines
 * @param {string} [params.siteName]
 * @returns {string}
 */
export function buildQuoteMessage({
  customer = {},
  lines = [],
  siteName = SITE.name,
} = {}) {
  const nombre = sanitizeUserText(customer.nombre ?? customer.name ?? "");
  const empresa = sanitizeUserText(customer.empresa ?? customer.company ?? "");
  const correo = sanitizeUserText(customer.correo ?? customer.email ?? "");
  const telefono = sanitizeUserText(customer.telefono ?? customer.phone ?? "");
  const notas = sanitizeUserText(customer.notas ?? customer.notes ?? "");

  const cleanSiteName = siteName || SITE.name;
  const headerSiteName = cleanSiteName.toUpperCase();

  const headerLines = [
    `*NUEVA SOLICITUD DE COTIZACIÓN - ${headerSiteName}*`,
    "--------------------------------------",
    `*Cliente:* ${nombre}`,
    `*Empresa:* ${empresa}`,
    `*Correo:* ${correo}`,
  ];

  if (telefono) {
    headerLines.push(`*Teléfono:* ${telefono}`);
  }
  if (notas) {
    headerLines.push(`*Notas:* ${notas}`);
  }

  const productBlocks = lines.map((line, idx) => {
    const prod = line.product || line;
    const rawName = prod?.name ?? "";
    const rawBrand = prod?.brand ?? null;
    const rawNp = prod?.np ?? null;
    const qty = Number(line.qty ?? line.quantity ?? 1);

    const brandText =
      rawBrand !== null && rawBrand !== undefined && String(rawBrand).trim() !== ""
        ? String(rawBrand).trim()
        : "no especificada";
    const npText =
      rawNp !== null && rawNp !== undefined && String(rawNp).trim() !== ""
        ? String(rawNp).trim()
        : "por confirmar";

    return [
      `${idx + 1}. *${rawName}*`,
      `   - Marca: ${brandText}`,
      `   - N/P: ${npText}`,
      `   - Cantidad: ${qty} pzas`,
    ].join("\n");
  });

  return [
    ...headerLines,
    "",
    "*LISTA DE PRODUCTOS:*",
    ...productBlocks,
    "",
    `*Total de partidas:* ${lines.length}`,
    "--------------------------------------",
    `Enviado desde el sitio web de ${cleanSiteName}`,
  ].join("\n");
}

/**
 * Builds a wa.me URL with encoded text.
 * @param {string} number
 * @param {string} text
 * @returns {string}
 */
export function buildWhatsAppUrl(number = SITE.whatsappNumber, text = "") {
  const digits = String(number || SITE.whatsappNumber).replace(/\D/g, "");
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${digits}?text=${encoded}`;
}

/**
 * Builds a wa.me URL with the generic greeting text.
 * @param {string} [number]
 * @returns {string}
 */
export function buildGenericGreetingUrl(number = SITE.whatsappNumber) {
  return buildWhatsAppUrl(
    number,
    "Hola, quisiera solicitar una cotización."
  );
}

/**
 * Builds a wa.me URL with pre-filled greeting text for a specific brand.
 * Text: "Hola, quisiera cotizar productos de la marca {brandName}."
 * @param {string} brandName
 * @param {string} [number]
 * @returns {string}
 */
export function buildBrandGreetingUrl(brandName, number = SITE.whatsappNumber) {
  return buildWhatsAppUrl(
    number,
    `Hola, quisiera cotizar productos de la marca ${brandName}.`
  );
}
