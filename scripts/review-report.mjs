import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(__dirname, "../src/data/catalog.json");

const raw = fs.readFileSync(catalogPath, "utf8");
const catalog = JSON.parse(raw);

const flagged = catalog.filter(
  (item) => Array.isArray(item.reviewFlags) && item.reviewFlags.length > 0
);
const missingBrandCount = catalog.filter((item) => item.brand === null).length;
const missingNpCount = catalog.filter((item) => item.np === null).length;

console.log("=== SERSE Industrial — Catalog Review Report ===\n");
console.log(`Total products: ${catalog.length}`);
console.log(`Products with brand: null : ${missingBrandCount}`);
console.log(`Products with np: null    : ${missingNpCount}`);
console.log(`Products with reviewFlags : ${flagged.length}\n`);

if (flagged.length > 0) {
  const rows = flagged.map((item) => ({
    id: item.id,
    name: item.name.length > 38 ? `${item.name.slice(0, 35)}...` : item.name,
    brand: item.brand ?? "(null)",
    np: item.np ?? "(null)",
    flags: item.reviewFlags.join(", "),
  }));
  console.table(rows);
} else {
  console.log("No records with reviewFlags found.");
}
