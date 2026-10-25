import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Cog,
  Cpu,
  Gauge,
  Package,
  PackageCheck,
  ShieldAlert,
  Tag,
  Wind,
  Wrench,
} from "lucide-react";
import catalog from "../../data/catalog.json";
import { useI18n } from "../../i18n/I18nContext.jsx";

const CATEGORY_ICON_MAP = {
  Herramienta: Wrench,
  Neumática: Wind,
  "Mantenimiento y consumibles": PackageCheck,
  "Eléctrico y electrónica": Cpu,
  "Etiquetado e identificación": Tag,
  Medición: Gauge,
  "Mecánica y lubricación": Cog,
  "Seguridad industrial": ShieldAlert,
};

/**
 * Category tiles grid
 * Reusable across Home and About pages. Computes counts from catalog data.
 */
export function CategoryGrid() {
  const { t } = useI18n();

  const categories = useMemo(() => {
    const counts = new Map();
    for (const item of catalog) {
      if (!item.category) continue;
      counts.set(item.category, (counts.get(item.category) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, []);

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {categories.map((cat) => {
        const IconComponent = CATEGORY_ICON_MAP[cat.name] || Package;
        return (
          <Link
            key={cat.name}
            to={`/catalogo?cat=${encodeURIComponent(cat.name)}`}
            className="group flex items-start gap-4 rounded-xl border border-line bg-white p-4 transition duration-150 hover:border-brand-700 hover:bg-lavender hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 sm:p-5"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-lavender text-brand-900 transition duration-150 group-hover:bg-gradient-to-r group-hover:from-brand-700 group-hover:to-brand-500 group-hover:text-white">
              <IconComponent className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-sm font-semibold text-brand-900 transition group-hover:text-brand-700 sm:text-base">
                {cat.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-muted">
                {cat.count === 1
                  ? t("categoryProductCountOne")
                  : t("categoryProductCount", { count: cat.count })}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
