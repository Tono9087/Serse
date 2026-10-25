import { describe, it, expect } from "vitest";
import { buildQuoteMessage, buildWhatsAppUrl } from "../whatsapp.js";

describe("whatsapp message builder", () => {
  it("contains every line in the template, omits empty phone/notes, uses fallbacks for nulls, and strips *", () => {
    const msg = buildQuoteMessage({
      customer: {
        nombre: "Juan *Pérez*",
        empresa: "Planta_Norte S.A.",
        correo: "juan@empresa.mx",
        telefono: "",
        notas: "   ",
      },
      lines: [
        {
          id: "p004",
          name: "Cilindro antigiro",
          brand: "SMC",
          np: "CDG1KBN25-75",
          qty: 3,
        },
        {
          id: "p027",
          name: "Silenciador neumático (Plástico)",
          brand: null,
          np: null,
          qty: 10,
        },
      ],
      siteName: "SERSE Industrial",
    });

    expect(msg).toContain("*NUEVA SOLICITUD DE COTIZACIÓN - SERSE INDUSTRIAL*");
    expect(msg).toContain("--------------------------------------");
    expect(msg).toContain("*Cliente:* Juan Pérez");
    expect(msg).toContain("*Empresa:* PlantaNorte S.A.");
    expect(msg).toContain("*Correo:* juan@empresa.mx");
    expect(msg).not.toContain("*Teléfono:*");
    expect(msg).not.toContain("*Notas:*");
    expect(msg).toContain("*LISTA DE PRODUCTOS:*");
    expect(msg).toContain(
      "1. *Cilindro antigiro*\n   - Marca: SMC\n   - N/P: CDG1KBN25-75\n   - Cantidad: 3 pzas"
    );
    expect(msg).toContain(
      "2. *Silenciador neumático (Plástico)*\n   - Marca: no especificada\n   - N/P: por confirmar\n   - Cantidad: 10 pzas"
    );
    expect(msg).toContain("*Total de partidas:* 2");
    expect(msg).toContain("Enviado desde el sitio web de SERSE Industrial");

    const url = buildWhatsAppUrl("5216145341188", msg);
    expect(url.startsWith("https://wa.me/5216145341188?text=")).toBe(true);
    expect(decodeURIComponent(url.split("?text=")[1])).toBe(msg);
  });
});
