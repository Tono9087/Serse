import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { es } from "./es.js";
import { en } from "./en.js";
import { loadLanguage, saveLanguage } from "../lib/storage.js";

const dictionaries = { es, en };

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => loadLanguage("es"));

  const setLang = useCallback((nextLang) => {
    const valid = nextLang === "en" ? "en" : "es";
    setLangState(valid);
    saveLanguage(valid);
    if (typeof document !== "undefined") {
      document.documentElement.lang = valid;
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = useCallback(
    (key, vars = {}) => {
      const dict = dictionaries[lang] || dictionaries.es;
      let template = dict[key] ?? dictionaries.es[key] ?? key;
      if (vars && typeof template === "string") {
        for (const [k, v] of Object.entries(vars)) {
          template = template.replaceAll(`{${k}}`, String(v));
        }
      }
      return template;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
