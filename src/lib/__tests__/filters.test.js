import { describe, it, expect } from "vitest";
import catalog from "../../data/catalog.json";
import { applyFilters, facetCounts } from "../filters.js";

describe("applyFilters and facetCounts", () => {
  it("returns the expected subset for category + brand combination", () => {
    const results = applyFilters(catalog, {
      cat: "Neumática",
      brands: ["SMC"],
      sort: "name",
    });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((p) => p.category === "Neumática" && p.brand === "SMC")
    ).toBe(true);
  });

  it("sorts by brand with null brands last", () => {
    const results = applyFilters(catalog, {
      cat: "Herramienta",
      sort: "brand",
    });
    expect(results.length).toBe(3);
    expect(results[0].brand).toBe("LANG TOOLS");
    expect(results[1].brand).toBe("TRUPER EXPERT");
    expect(results[2].brand).toBeNull();
  });

  it("sorts by np with null part numbers last", () => {
    const sample = [
      { id: "1", name: "Alpha", np: null },
      { id: "2", name: "Beta", np: "PUC 10" },
      { id: "3", name: "Gamma", np: "07150-03005" },
      { id: "4", name: "Delta", np: "AC20A-N02CG-Z" },
    ];
    const sorted = applyFilters(sample, { sort: "np" });
    expect(sorted.map((p) => p.id)).toEqual(["3", "4", "2", "1"]);
    expect(sorted[3].np).toBeNull();
  });

  it("computes facet counts reflecting other active filters and excludes null brands", () => {
    const facets = facetCounts(catalog, {
      cat: "Neumática",
      brands: ["SMC"],
    });

    // brand: null must never appear in brand facets
    expect("null" in facets.brands).toBe(false);
    expect("" in facets.brands).toBe(false);

    // Category count for Neumática when filtering by brand=SMC should match SMC items in Neumática
    const smcPneumatics = catalog.filter(
      (p) => p.category === "Neumática" && p.brand === "SMC"
    );
    expect(facets.categories["Neumática"]).toBe(smcPneumatics.length);

    // Brand count for YPC when filtering by cat=Neumática should reflect YPC items in Neumática
    const ypcPneumatics = catalog.filter(
      (p) => p.category === "Neumática" && p.brand === "YPC"
    );
    expect(facets.brands["YPC"]).toBe(ypcPneumatics.length);
  });
});
