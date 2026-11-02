/**
 * Display labels for catalog categories.
 * Catalog data (and URLs such as /catalogo?cat=...) keep the original Spanish
 * category name as the identifier; only the visible label is translated.
 */
const CATEGORY_LABELS_EN = {
  Herramienta: "Tools",
  Neumática: "Pneumatics",
  "Mantenimiento y consumibles": "Maintenance and consumables",
  "Eléctrico y electrónica": "Electrical and electronics",
  "Etiquetado e identificación": "Labeling and identification",
  Medición: "Measurement",
  "Mecánica y lubricación": "Mechanics and lubrication",
  "Seguridad industrial": "Industrial safety",
};

/**
 * Returns the visible label of a category for the given language.
 * Falls back to the original name when no translation exists.
 */
export function getCategoryLabel(name, lang) {
  if (lang === "en") return CATEGORY_LABELS_EN[name] || name;
  return name;
}
