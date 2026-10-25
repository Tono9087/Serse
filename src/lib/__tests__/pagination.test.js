import { describe, it, expect } from "vitest";
import { paginate, getPageRange } from "../pagination.js";

describe("paginate and getPageRange", () => {
  it("paginates items accurately and clamps out-of-range pages", () => {
    const items = Array.from({ length: 30 }, (_, i) => i + 1);
    const page1 = paginate(items, 1, 12);
    expect(page1.items).toHaveLength(12);
    expect(page1.totalPages).toBe(3);
    expect(page1.currentPage).toBe(1);

    const page3 = paginate(items, 99, 12);
    expect(page3.currentPage).toBe(3);
    expect(page3.items).toHaveLength(6);
  });

  it("handles getPageRange edge cases (1 page, 9 pages at page 1, 5 and 9)", () => {
    expect(getPageRange(1, 1)).toEqual([1]);
    expect(getPageRange(1, 9)).toEqual([1, 2, 3, 4, 5, "…", 9]);
    expect(getPageRange(5, 9)).toEqual([1, "…", 4, 5, 6, "…", 9]);
    expect(getPageRange(9, 9)).toEqual([1, "…", 5, 6, 7, 8, 9]);
  });
});
