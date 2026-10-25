import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import catalog from "../../data/catalog.json";
import { buildSearchIndex, search } from "../../lib/search.js";
import { normalizeNp } from "../../lib/normalize.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { ProductImage } from "../ui/ProductImage.jsx";

const searchIndex = buildSearchIndex(catalog);

/**
 * Highlights the matched portion of a part number.
 */
function HighlightedNp({ np, query }) {
  if (!np) return null;
  const qNorm = normalizeNp(query);
  if (!qNorm || qNorm.length < 2) {
    return <span>{np}</span>;
  }

  const normChars = [];
  const origIndices = [];
  for (let i = 0; i < np.length; i++) {
    const ch = np[i]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (/^[a-z0-9]$/.test(ch)) {
      normChars.push(ch);
      origIndices.push(i);
    }
  }

  const npNorm = normChars.join("");
  const matchPos = npNorm.indexOf(qNorm);
  if (matchPos === -1) {
    return <span>{np}</span>;
  }

  const startOrig = origIndices[matchPos];
  const endOrig = origIndices[matchPos + qNorm.length - 1] + 1;

  return (
    <span>
      {np.slice(0, startOrig)}
      <mark className="rounded-sm bg-brand-500/25 px-0.5 font-semibold text-brand-900">
        {np.slice(startOrig, endOrig)}
      </mark>
      {np.slice(endOrig)}
    </span>
  );
}

export function SearchBox({ size = "md", initialValue = "", className = "" }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;

  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const debouncedQuery = useDebounce(query, 150);
  const trimmedDebounced = debouncedQuery.trim();
  const canSearch = trimmedDebounced.length >= 2;

  const suggestions = useMemo(() => {
    if (!canSearch) return [];
    return search(trimmedDebounced, catalog, searchIndex).slice(0, 6);
  }, [canSearch, trimmedDebounced]);

  const showDropdown = isOpen && canSearch;

  useEffect(() => {
    setActiveIndex(-1);
  }, [trimmedDebounced]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function submitFullSearch(searchText) {
    const trimmed = searchText.trim();
    setIsOpen(false);
    setActiveIndex(-1);
    if (trimmed) {
      navigate(`/catalogo?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/catalogo");
    }
  }

  function selectSuggestion(product) {
    setIsOpen(false);
    setActiveIndex(-1);
    const fromPath = `${location.pathname}${location.search}`;
    navigate(`/producto/${product.id}`, { state: { from: fromPath } });
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      if (!canSearch) return;
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      if (suggestions.length > 0) {
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      }
      return;
    }

    if (e.key === "ArrowUp") {
      if (!canSearch) return;
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      if (suggestions.length > 0) {
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (
        showDropdown &&
        activeIndex >= 0 &&
        activeIndex < suggestions.length
      ) {
        selectSuggestion(suggestions[activeIndex]);
      } else {
        submitFullSearch(query);
      }
    }
  }

  const activeDescendantId =
    showDropdown && activeIndex >= 0 && suggestions[activeIndex]
      ? `${baseId}-option-${suggestions[activeIndex].id}`
      : undefined;

  const isLarge = size === "lg";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submitFullSearch(query);
        }}
        className="relative flex items-center"
      >
        <Search
          className={`pointer-events-none absolute left-3.5 text-muted ${
            isLarge ? "h-5 w-5" : "h-4 w-4"
          }`}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={activeDescendantId}
          aria-autocomplete="list"
          aria-label={t("searchAriaLabel")}
          placeholder={t("searchPlaceholder")}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-lg border border-line bg-white pl-10 pr-20 text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
            isLarge ? "min-h-[50px] py-3 text-base" : "min-h-[44px] py-2 text-sm"
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            aria-label={t("clearSearch")}
            className="absolute right-11 inline-flex h-8 w-8 items-center justify-center rounded text-muted hover:bg-lavender hover:text-brand-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <button
          type="submit"
          aria-label={t("searchSubmit")}
          className="absolute right-1.5 inline-flex h-8 w-8 items-center justify-center rounded bg-brand-500 text-white hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t("searchPlaceholder")}
          className="absolute left-0 right-0 top-full z-40 mt-1 max-h-96 overflow-y-auto rounded-lg border border-line bg-white py-1 shadow-sm"
        >
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((product, index) => {
                const isSelected = index === activeIndex;
                return (
                  <li
                    key={product.id}
                    id={`${baseId}-option-${product.id}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectSuggestion(product);
                    }}
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 transition duration-150 ${
                      isSelected ? "bg-lavender" : "bg-white hover:bg-lavender"
                    }`}
                  >
                    <div className="h-11 w-14 flex-shrink-0 overflow-hidden rounded border border-line bg-lavender">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        width={56}
                        height={44}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-brand-900">
                          {product.name}
                        </span>
                        {product.brand && (
                          <span className="flex-shrink-0 rounded bg-brand-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            {product.brand}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-xs text-muted font-mono">
                        {product.np ? (
                          <>
                            <span>{t("npLabel")} </span>
                            <HighlightedNp
                              np={product.np}
                              query={trimmedDebounced}
                            />
                          </>
                        ) : (
                          <span>{t("npPending")}</span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
              <li className="border-t border-line px-3 py-2">
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    submitFullSearch(query);
                  }}
                  className="w-full text-left text-xs font-semibold text-brand-700 hover:underline focus:outline-none"
                >
                  {t("viewAllResults", { q: trimmedDebounced })}
                </button>
              </li>
            </>
          ) : (
            <li
              role="option"
              aria-selected={false}
              aria-disabled="true"
              className="px-4 py-3 text-sm text-ink"
            >
              <p className="font-semibold text-brand-900">
                {t("noResultsFor", { q: trimmedDebounced })}
              </p>
              <p className="mt-1 text-xs text-muted">{t("noResultsHint")}</p>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
