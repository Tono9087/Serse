import { describe, it, expect } from "vitest";
import catalog from "../../data/catalog.json";
import { parseQuickOrder, parseQty } from "../quickOrder.js";

describe("parseQuickOrder", () => {
  it("matches full-line N/P with a space (PUC 10) with qty 1", () => {
    const res = parseQuickOrder("PUC 10", catalog);
    expect(res.matched).toHaveLength(1);
    expect(res.matched[0].product.np).toBe("PUC 10");
    expect(res.matched[0].qty).toBe(1);
  });

  it("parses trailing integer quantity (PC08-03 10 -> qty 10)", () => {
    const res = parseQuickOrder("PC08-03 10", catalog);
    expect(res.matched).toHaveLength(1);
    expect(res.matched[0].product.np).toBe("PC08-03");
    expect(res.matched[0].qty).toBe(10);
  });

  it("parses comma-separated quantity (pc0803,5 -> qty 5)", () => {
    const res = parseQuickOrder("pc0803,5", catalog);
    expect(res.matched).toHaveLength(1);
    expect(res.matched[0].product.np).toBe("PC08-03");
    expect(res.matched[0].qty).toBe(5);
  });

  it("parses semicolon-separated quantity (CDG1KBN25-75;2 -> qty 2)", () => {
    const res = parseQuickOrder("CDG1KBN25-75;2", catalog);
    expect(res.matched).toHaveLength(1);
    expect(res.matched[0].product.np).toBe("CDG1KBN25-75");
    expect(res.matched[0].qty).toBe(2);
  });

  it("parses x-prefixed trailing quantity (PC08-03 x3 -> qty 3)", () => {
    const res = parseQuickOrder("PC08-03 x3", catalog);
    expect(res.matched).toHaveLength(1);
    expect(res.matched[0].product.np).toBe("PC08-03");
    expect(res.matched[0].qty).toBe(3);
  });

  it("places unknown part numbers into unmatched", () => {
    const res = parseQuickOrder("UNKNOWN-NP-9999 5", catalog);
    expect(res.matched).toHaveLength(0);
    expect(res.unmatched).toHaveLength(1);
    expect(res.unmatched[0].np).toBe("UNKNOWN-NP-9999");
    expect(res.unmatched[0].qty).toBe(5);
  });

  it("handles quantity 0 or non-numeric as 1, and clamps 10,000 to 9999", () => {
    expect(parseQty(0)).toBe(1);
    expect(parseQty("0")).toBe(1);
    expect(parseQty("abc")).toBe(1);
    expect(parseQty(10000)).toBe(9999);
    expect(parseQty("10000")).toBe(9999);

    const res1 = parseQuickOrder("PC08-03, 0", catalog);
    expect(res1.matched[0].qty).toBe(1);

    const res2 = parseQuickOrder("PC08-03, abc", catalog);
    expect(res2.matched[0].qty).toBe(1);

    const res3 = parseQuickOrder("PC08-03, 10000", catalog);
    expect(res3.matched[0].qty).toBe(9999);
  });

  it("ignores blank lines and lines starting with #", () => {
    const input = `
      # Comentario inicial
      PC08-03 10

      # Otro comentario
      PUC 10
    `;
    const res = parseQuickOrder(input, catalog);
    expect(res.totalLines).toBe(2);
    expect(res.matched).toHaveLength(2);
  });

  it("processes at most 200 lines and reports extra lines beyond 200", () => {
    const lines = [];
    for (let i = 1; i <= 205; i++) {
      lines.push("PC08-03 1");
    }
    const res = parseQuickOrder(lines.join("\n"), catalog);
    expect(res.totalLines).toBe(200);
    expect(res.matched).toHaveLength(200);
    expect(res.extraCount).toBe(5);
  });
});
