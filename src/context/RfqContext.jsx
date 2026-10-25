import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import catalog from "../data/catalog.json";
import { clampQty, loadRfqItems, saveRfqItems } from "../lib/storage.js";
import { useI18n } from "../i18n/I18nContext.jsx";

const RfqContext = createContext(null);

const productById = new Map(catalog.map((p) => [p.id, p]));
const validIds = new Set(catalog.map((p) => p.id));

export function RfqProvider({ children }) {
  const { t } = useI18n();
  const [items, setItems] = useState(() => loadRfqItems(validIds));
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    saveRfqItems(items);
  }, [items]);

  const add = useCallback(
    (id, initialQty = 1) => {
      if (!validIds.has(id)) return;
      const qtyToAdd = clampQty(initialQty);
      setItems((prev) => {
        const existing = prev.find((item) => item.id === id);
        if (existing) {
          return prev.map((item) =>
            item.id === id
              ? { ...item, qty: clampQty(item.qty + qtyToAdd) }
              : item
          );
        }
        return [...prev, { id, qty: qtyToAdd }];
      });
      const product = productById.get(id);
      setAnnouncement(
        product
          ? `${t("addedToListAnnouncement")}: ${product.name}`
          : t("addedToListAnnouncement")
      );
    },
    [t]
  );

  const setQty = useCallback((id, qty) => {
    if (!validIds.has(id)) return;
    const clamped = clampQty(qty);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: clamped } : item))
    );
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const lines = useMemo(() => {
    return items
      .map((item) => {
        const product = productById.get(item.id);
        if (!product) return null;
        return {
          ...product,
          product,
          id: item.id,
          qty: item.qty,
        };
      })
      .filter(Boolean);
  }, [items]);

  const qtyById = useMemo(() => {
    const map = new Map();
    for (const item of items) {
      map.set(item.id, item.qty);
    }
    return map;
  }, [items]);

  const getQty = useCallback((id) => qtyById.get(id) || 0, [qtyById]);

  const count = lines.length;

  const value = useMemo(
    () => ({
      items,
      lines,
      count,
      isOpen,
      add,
      setQty,
      remove,
      clear,
      open,
      close,
      getQty,
    }),
    [items, lines, count, isOpen, add, setQty, remove, clear, open, close, getQty]
  );

  return (
    <RfqContext.Provider value={value}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </RfqContext.Provider>
  );
}

export function useRfq() {
  const context = useContext(RfqContext);
  if (!context) {
    throw new Error("useRfq must be used within an RfqProvider");
  }
  return context;
}
