import { forwardRef } from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-brand-700 text-white font-semibold hover:bg-brand-800 border border-transparent",
  secondary:
    "bg-white border border-brand-700 text-brand-700 font-semibold hover:bg-lavender",
  ghost:
    "bg-transparent text-brand-900 font-medium hover:bg-lavender border border-transparent",
  dark:
    "bg-brand-900 text-white font-semibold hover:bg-brand-800 border border-transparent",
};

const SIZE_CLASSES = {
  sm: "min-h-[44px] sm:min-h-[38px] px-3 py-1.5 text-sm",
  md: "min-h-[44px] px-4 py-2.5 text-sm",
  lg: "min-h-[48px] px-6 py-3 text-base",
};

export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    className = "",
    type = "button",
    disabled = false,
    children,
    ...props
  },
  ref
) {
  const variantCls = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeCls = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variantCls} ${sizeCls} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
