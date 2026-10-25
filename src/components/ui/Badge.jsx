const BADGE_VARIANTS = {
  brand: "bg-brand-900 text-white",
  category: "bg-lavender text-brand-900 border border-line",
  accent: "bg-brand-500 text-white font-bold",
};

export function Badge({ variant = "category", className = "", children }) {
  const variantCls = BADGE_VARIANTS[variant] || BADGE_VARIANTS.category;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${variantCls} ${className}`}
    >
      {children}
    </span>
  );
}
