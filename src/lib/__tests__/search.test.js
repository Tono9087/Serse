import { describe, it, expect } from "vitest";
import catalog from "../../data/catalog.json";
import { buildSearchIndex, search } from "../search.js";

describe("search", () => {
  const index = buildSearchIndex(catalog);

  it("returns all products for empty or whitespace query", () => {
    expect(search("", catalog, index)).toHaveLength(catalog.length);
    expect(search("   ", catalog, index)).toHaveLength(catalog.length);
  });

  it('finds CDG1KBN25-75 first for query "cdg1kbn2575"', () => {
    const results = search("cdg1kbn2575", catalog, index);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].np).toBe("CDG1KBN25-75");
    expect(results[0].id).toBe("p004");
  });

  it('finds the YPC connector for query "PC08-03"', () => {
    const results = search("PC08-03", catalog, index);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].np).toBe("PC08-03");
    expect(results[0].brand).toBe("YPC");
  });

  it('finds the chuck for query "mandril"', () => {
    const results = search("mandril", catalog, index);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe("p001");
    expect(results[0].name.toLowerCase()).toContain("mandril");
  });

  it('ignores accents ("valvula" finds "Válvula…")', () => {
    const results = search("valvula", catalog, index);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((p) => p.name.includes("Válvula"))).toBe(true);
  });

  it("handles acceptance queries PC3/8-01, pc3801, SMC, cilindro", () => {
    const res1 = search("PC3/8-01", catalog, index);
    expect(res1[0]?.id).toBe("p024");

    const res2 = search("pc3801", catalog, index);
    expect(res2[0]?.id).toBe("p024");

    const res3 = search("SMC", catalog, index);
    expect(res3.length).toBeGreaterThanOrEqual(7);
    expect(res3.every((p) => p.brand === "SMC")).toBe(true);

    const res4 = search("cilindro", catalog, index);
    expect(res4.length).toBeGreaterThanOrEqual(4);
    expect(res4.every((p) => p.name.toLowerCase().includes("cilindro"))).toBe(
      true
    );
  });
});
