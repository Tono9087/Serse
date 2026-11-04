import { useMemo } from "react";
import { Link } from "react-router-dom";
import catalog from "../../data/catalog.json";
import { ProductImage } from "../ui/ProductImage.jsx";
import { Badge } from "../ui/Badge.jsx";

/**
 * Featured categories configuration.
 *
 * - `category` must match `catalog.json` exactly (it is the URL/filter id).
 * - `highlights[].label` is the visible text. `sub` is the exact catalog
 *   subcategory it maps to; when the label has no 1:1 subcategory we fall back
 *   to a text search (`q`) scoped to the category so links never dead-end.
 * - `image` is an optional dedicated category photo (`/images/...`); when
 *   missing, the MRO placeholder is rendered.
 */
const FEATURED_CATEGORIES = [
  {
    category: "Neumática",
    highlights: [
      { label: "Conectores y fittings", sub: "Conectores y fittings" },
      { label: "Válvulas", sub: "Válvulas" },
      { label: "Cilindros", sub: "Cilindros" },
      { label: "Reguladores y silenciadores", sub: "Reguladores y silenciadores" },
    ],
  },
  {
    category: "Eléctrico y electrónica",
    highlights: [
      { label: "Componentes eléctricos", sub: "Componentes eléctricos" },
      { label: "Sensores y detección", sub: "Sensores y detección" },
      { label: "Fuentes y baterías", sub: "Fuentes, baterías y módulos" },
      { label: "Automatización", sub: "Automatización" },
    ],
  },
  {
    category: "Etiquetado e identificación",
    highlights: [
      { label: "Ribbons térmicos", sub: "Ribbons" },
      { label: "Cartuchos de vinil", q: "vinil" },
      { label: "Etiquetas industriales", sub: "Etiquetas y cartuchos" },
    ],
  },
  {
    category: "Seguridad industrial",
    highlights: [
      { label: "Bloqueo (LOTO) y candados", sub: "Bloqueo (LOTO) y candados" },
      { label: "Demarcación de piso", sub: "Demarcación" },
      { label: "Dispositivos lockout de cable", q: "lockout" },
    ],
  },
  {
    category: "Herramienta",
    title: "Herramienta e insumos",
    highlights: [
      { label: "Herramienta manual", sub: "Herramienta manual" },
      { label: "Insertos magnéticos", q: "insertos" },
      { label: "Puntas hexagonales", q: "puntas" },
      { label: "Mandriles", q: "mandril" },
    ],
  },
  {
    category: "Mecánica y lubricación",
    highlights: [
      { label: "Rodamientos y sujeción", sub: "Rodamientos y sujeción" },
      { label: "Grasa sintética", q: "grasa" },
      { label: "Lubricación automática", q: "lubricación automática" },
    ],
  },
  {
    category: "Medición",
    highlights: [
      { label: "Instrumentos de precisión", sub: "Instrumentos" },
      { label: "Manómetros de presión", sub: "Manómetros" },
      { label: "Galgas y reglas", q: "galga" },
    ],
  },
  {
    category: "Mantenimiento y consumibles",
    title: "Mantenimiento y consumibles",
    highlights: [
      { label: "Almacenamiento", sub: "Almacenamiento" },
      { label: "Filtración industrial", sub: "Filtración" },
      { label: "Iluminación LED", sub: "Iluminación" },
      { label: "Limpieza", sub: "Limpieza" },
    ],
  },
];

const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-steel focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function categoryHref(category) {
  return `/catalogo?cat=${encodeURIComponent(category)}`;
}

function highlightHref(category, { sub, q }) {
  const params = new URLSearchParams({ cat: category });
  if (sub) params.set("sub", sub);
  else if (q) params.set("q", q);
  return `/catalogo?${params.toString()}`;
}

/**
 * Featured categories showcase (card grid).
 * Product counts are derived from catalog.json; categories that no longer
 * exist in the catalog are skipped.
 *
 * @param {{ limit?: number }} props - number of cards to show (4 or up to 8).
 */
export function CategoryShowcase({ limit = 4 }) {
  const cards = useMemo(() => {
    const counts = new Map();
    for (const item of catalog) {
      if (item.category) counts.set(item.category, (counts.get(item.category) || 0) + 1);
    }
    return FEATURED_CATEGORIES.filter((c) => counts.has(c.category))
      .map((c) => ({ ...c, count: counts.get(c.category) }))
      .slice(0, Math.max(0, limit));
  }, [limit]);

  if (cards.length === 0) return null;

  return (
    <section
      aria-labelledby="category-showcase-heading"
      className="border-y border-line bg-mist py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-800 sm:text-sm">
            LÍNEAS DE SUMINISTRO MRO
          </p>
          <h2
            id="category-showcase-heading"
            className="mt-2 text-3xl font-bold text-navy"
          >
            Principales Categorías Industriales
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const title = card.title || card.category;
            const headingId = `featured-cat-${card.category
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")}`;
            return (
              <article
                key={card.category}
                aria-labelledby={headingId}
                className="flex flex-col rounded-lg border border-line bg-white p-4 shadow-sm transition duration-200 hover:border-steel hover:shadow-md"
              >
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-line/70 bg-mist">
                  <ProductImage
                    src={card.image}
                    alt={`Categoría ${title}`}
                    className="h-full w-full p-3"
                  />
                </div>

                <h3
                  id={headingId}
                  className="mb-2 mt-4 text-center text-lg font-semibold text-navy"
                >
                  {title}
                </h3>
                <div
                  aria-hidden="true"
                  className="mx-auto mb-1 h-0.5 w-6 bg-steel"
                />
                <p className="mb-3 text-center">
                  <Badge variant="category">
                    {card.count} {card.count === 1 ? "producto" : "productos"}
                  </Badge>
                </p>

                <ul className="mx-auto w-full max-w-[16rem] space-y-2 text-sm text-slate-700">
                  {card.highlights.map((h) => (
                    <li key={h.label} className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-slate-400">•</span>
                      <Link
                        to={highlightHref(card.category, h)}
                        className={`rounded transition-colors hover:text-steel hover:underline ${FOCUS_RING}`}
                      >
                        {h.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pb-2 pt-6">
                  <Link
                    to={categoryHref(card.category)}
                    aria-label={`Ver más: ${title}`}
                    className={`block w-full rounded-lg bg-steel/10 px-6 py-2 text-center text-sm font-bold text-steel transition-colors hover:bg-steel hover:text-white ${FOCUS_RING}`}
                  >
                    Ver Más
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
