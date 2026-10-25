/**
 * Shared responsive layout container.
 * Constrains max width to 1680px and provides unified responsive side padding.
 */
export function Container({ as: Component = "div", className = "", children, ...props }) {
  return (
    <Component
      className={`mx-auto w-full max-w-[1680px] px-4 sm:px-6 lg:px-10 2xl:px-16 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
