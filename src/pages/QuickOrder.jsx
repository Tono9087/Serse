import { useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  MessageSquare,
  PlusCircle,
  Upload,
  XCircle,
} from "lucide-react";
import catalog from "../data/catalog.json";
import { SITE } from "../config/site.js";
import { buildWhatsAppUrl } from "../lib/whatsapp.js";
import { parseQuickOrder } from "../lib/quickOrder.js";
import { useRfq } from "../context/RfqContext.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { Button } from "../components/ui/Button.jsx";

const EXAMPLE_PLACEHOLDER = `PC08-03 10\nCDG1KBN25-75, 2\nPUC 10`;

export function QuickOrder() {
  const { t } = useI18n();
  const { add, open } = useRfq();

  usePageMeta({
    title: t("metaQuickOrderTitle"),
    description: t("metaQuickOrderDesc"),
  });

  const [text, setText] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [copiedUnmatched, setCopiedUnmatched] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const fileInputRef = useRef(null);

  function handleReviewList() {
    if (!text.trim()) return;
    const result = parseQuickOrder(text, catalog);

    // Initialize editable rows
    const matchedRows = result.matched.map((m) => ({ ...m }));
    const ambiguousRows = result.ambiguous.map((a) => ({
      ...a,
      selectedId: a.selectedId || a.candidates[0].id,
    }));
    const unmatchedRows = result.unmatched.map((u) => ({ ...u }));

    const updated = {
      ...result,
      matched: matchedRows,
      ambiguous: ambiguousRows,
      unmatched: unmatchedRows,
    };
    setParsedResult(updated);

    const foundCount = matchedRows.length + ambiguousRows.length;
    const notFoundCount = unmatchedRows.length;
    setAnnouncement(
      t("quickOrderAnnouncement", {
        n: foundCount,
        m: notFoundCount,
      })
    );
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setText(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleAddFoundToRfq() {
    if (!parsedResult) return;
    for (const item of parsedResult.matched) {
      if (item.product?.id) {
        add(item.product.id, item.qty);
      }
    }
    for (const item of parsedResult.ambiguous) {
      if (item.selectedId) {
        add(item.selectedId, item.qty);
      }
    }
    open();
  }

  async function handleCopyUnmatched() {
    if (!parsedResult || parsedResult.unmatched.length === 0) return;
    const lines = parsedResult.unmatched.map((u) => u.line).join("\n");
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(lines);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = lines;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(textarea);
      }
    }
    setCopiedUnmatched(true);
    setTimeout(() => setCopiedUnmatched(false), 2000);
  }

  // WhatsApp link for unmatched items per Section C.4
  const unmatchedWhatsAppUrl = (() => {
    if (!parsedResult || parsedResult.unmatched.length === 0) return "#";
    const header = "Busco estos productos que no encontré en el catálogo:\n";
    const bodyLines = parsedResult.unmatched.map((u) => u.line);
    let fullMsg = header;
    for (const line of bodyLines) {
      const candidate = `${fullMsg}${line}\n`;
      if (encodeURIComponent(candidate).length > 1800) break;
      fullMsg = candidate;
    }
    return buildWhatsAppUrl(SITE.whatsappNumber, fullMsg.trim());
  })();

  const foundCount =
    (parsedResult?.matched?.length || 0) +
    (parsedResult?.ambiguous?.length || 0);
  const unmatchedCount = parsedResult?.unmatched?.length || 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-brand-900 md:text-4xl">
          {t("quickOrderHeading")}
        </h1>
        <p className="mt-2 text-base text-muted">{t("quickOrderHelp")}</p>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <label
          htmlFor="quick-order-textarea"
          className="block text-sm font-semibold text-brand-900"
        >
          {t("quickOrderInputLabel")}
        </label>
        <textarea
          id="quick-order-textarea"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={EXAMPLE_PLACEHOLDER}
          className="mt-2 w-full rounded-xl border border-line bg-white p-4 font-mono text-sm text-ink placeholder:text-muted/60 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700"
        />

        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,text/plain,text/csv"
              onChange={handleFileUpload}
              className="sr-only"
              id="quick-order-file"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-xs font-semibold text-brand-900 hover:border-brand-700 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 transition duration-150"
            >
              <Upload className="h-4 w-4 text-muted" aria-hidden="true" />
              <span>{t("uploadFileLabel")}</span>
            </button>
            <span className="text-xs text-muted">{t("excelNote")}</span>
          </div>

          <Button
            variant="primary"
            onClick={handleReviewList}
            disabled={!text.trim()}
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            <span>{t("reviewListButton")}</span>
          </Button>
        </div>

        {parsedResult?.extraCount > 0 && (
          <div className="mt-4 rounded-lg border border-line bg-lavender p-3 text-xs text-brand-900">
            {t("maxLinesNotice", { extra: parsedResult.extraCount })}
          </div>
        )}
      </div>

      {/* Screen reader polite announcement per Section C.5 */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Results Section */}
      {parsedResult && (
        <section className="mt-10 space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-line pb-4">
            <div>
              <h2 className="text-2xl font-bold text-brand-900">
                {t("parsedResultsTitle")}
              </h2>
              <p className="text-sm text-muted">
                {t("quickOrderAnnouncement", {
                  n: foundCount,
                  m: unmatchedCount,
                })}
              </p>
            </div>

            {foundCount > 0 && (
              <Button variant="primary" onClick={handleAddFoundToRfq}>
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                <span>{t("addFoundToQuote")}</span>
              </Button>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
            <table className="w-full text-left text-sm border-collapse min-w-[650px]">
              <thead className="border-b border-line bg-lavender text-xs uppercase tracking-wider text-brand-900">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    {t("statusLabel")}
                  </th>
                  <th scope="col" className="px-4 py-3">
                    {t("npLabel")}
                  </th>
                  <th scope="col" className="px-4 py-3">
                    {t("fieldFullName") || "Producto"}
                  </th>
                  <th scope="col" className="px-4 py-3">
                    {t("brandLabel")}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right w-28">
                    {t("unitPzas")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {/* 1. Matched items */}
                {parsedResult.matched.map((item, idx) => (
                  <tr key={`matched-${idx}`} className="hover:bg-lavender/50">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        <span>{t("statusFound")}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-900">
                      {item.product.np || item.np}
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-900">
                      {item.product.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {item.product.brand || t("brandUnspecified")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        min={1}
                        max={9999}
                        value={item.qty}
                        onChange={(e) => {
                          const val = Number.parseInt(e.target.value, 10) || 1;
                          setParsedResult((prev) => {
                            const next = { ...prev };
                            next.matched[idx].qty = Math.max(1, Math.min(9999, val));
                            return next;
                          });
                        }}
                        className="h-8 w-20 rounded border border-line text-center text-sm font-semibold font-mono text-brand-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
                      />
                    </td>
                  </tr>
                ))}

                {/* 2. Ambiguous items */}
                {parsedResult.ambiguous.map((item, idx) => (
                  <tr key={`ambig-${idx}`} className="bg-lavender/30 hover:bg-lavender/60">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                        <span>{t("statusAmbiguous")}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-900">
                      {item.np}
                    </td>
                    <td className="px-4 py-3" colSpan={2}>
                      <select
                        value={item.selectedId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setParsedResult((prev) => {
                            const next = { ...prev };
                            next.ambiguous[idx].selectedId = selectedId;
                            return next;
                          });
                        }}
                        className="w-full rounded border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-brand-900 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
                      >
                        {item.candidates.map((cand) => (
                          <option key={cand.id} value={cand.id}>
                            {cand.name} ({cand.brand || t("brandUnspecified")})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        type="number"
                        min={1}
                        max={9999}
                        value={item.qty}
                        onChange={(e) => {
                          const val = Number.parseInt(e.target.value, 10) || 1;
                          setParsedResult((prev) => {
                            const next = { ...prev };
                            next.ambiguous[idx].qty = Math.max(1, Math.min(9999, val));
                            return next;
                          });
                        }}
                        className="h-8 w-20 rounded border border-line text-center text-sm font-semibold font-mono text-brand-900 focus:outline-none focus:ring-1 focus:ring-brand-700"
                      />
                    </td>
                  </tr>
                ))}

                {/* 3. Unmatched items */}
                {parsedResult.unmatched.map((item, idx) => (
                  <tr key={`unmatched-${idx}`} className="hover:bg-lavender/30">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger">
                        <XCircle className="h-4 w-4" aria-hidden="true" />
                        <span>{t("statusNotFound")}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-danger" colSpan={3}>
                      {item.line}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-mono text-muted">
                      {item.qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action buttons for unmatched items */}
          {unmatchedCount > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyUnmatched}
              >
                {copiedUnmatched ? (
                  <>
                    <Check className="h-4 w-4 text-success" aria-hidden="true" />
                    <span className="text-success">{t("copiedMessage")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>{t("copyUnmatchedButton")}</span>
                  </>
                )}
              </Button>

              {SITE.whatsappNumber && (
                <a
                  href={unmatchedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-xs font-semibold text-white transition duration-150 hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  <span>{t("askUnmatchedWhatsApp")}</span>
                </a>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
