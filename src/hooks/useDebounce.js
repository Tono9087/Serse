import { useEffect, useState } from "react";

/**
 * Debounces a value by the specified delay in milliseconds.
 * @template T
 * @param {T} value
 * @param {number} [delay=150]
 * @returns {T}
 */
export function useDebounce(value, delay = 150) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
