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

  it("renders 'no especificada' for null brand and 'por confirmar' for null N/P", () => {
    const msg = buildQuoteMessage({
      customer: {
        nombre: "Test User",
        empresa: "Test Corp",
        correo: "test@example.com",
      },
      lines: [
        {
          name: "Producto de prueba",
          brand: null,
          np: null,
          qty: 1,
        },
      ],
    });

    expect(msg).toContain("- Marca: no especificada");
    expect(msg).toContain("- N/P: por confirmar");
  });

  it("strips * and _ from customer fields", () => {
    const msg = buildQuoteMessage({
      customer: {
        nombre: "*Juan* _Pérez_*",
        empresa: "Empresa_*_Test",
        correo: "correo_*_@test.com",
        telefono: "123*456_789",
        notas: "*Nota* _importante_*",
      },
      lines: [
        {
          name: "Producto 1",
          brand: "Marca",
          np: "NP-01",
          qty: 1,
        },
      ],
    });

    expect(msg).toContain("*Cliente:* Juan Pérez");
    expect(msg).toContain("*Empresa:* EmpresaTest");
    expect(msg).toContain("*Correo:* correo@test.com");
    expect(msg).toContain("*Teléfono:* 123456789");
    expect(msg).toContain("*Notas:* Nota importante");
  });

  it("round-trips the encoded URL with decodeURIComponent", () => {
    const rawMessage = "Línea 1: *Negritas*\nLínea 2: &?=% café 100% / #123";
    const url = buildWhatsAppUrl("5216145341188", rawMessage);
    const encodedText = url.split("?text=")[1];
    expect(decodeURIComponent(encodedText)).toBe(rawMessage);
  });
});
