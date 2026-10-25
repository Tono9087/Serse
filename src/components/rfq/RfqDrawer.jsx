import { useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ClipboardList,
  Copy,
  Info,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { useRfq } from "../../context/RfqContext.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { SITE } from "../../config/site.js";
import { buildQuoteMessage, buildWhatsAppUrl } from "../../lib/whatsapp.js";
import { Drawer } from "../ui/Drawer.jsx";
import { Button } from "../ui/Button.jsx";
import { RfqItemRow } from "./RfqItemRow.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RfqDrawer() {
  const { lines, count, isOpen, close, setQty, remove, clear } = useRfq();
  const { t } = useI18n();
  const navigate = useNavigate();
  const formId = useId();

  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");

  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const message = useMemo(() => {
    return buildQuoteMessage({
      customer: { nombre, empresa, correo, telefono, notas },
      lines,
      siteName: SITE.name,
    });
  }, [nombre, empresa, correo, telefono, notas, lines]);

  const whatsappUrl = useMemo(() => {
    return buildWhatsAppUrl(SITE.whatsappNumber, message);
  }, [message]);

  const isUrlLong = whatsappUrl.length > 1800;

  function validateForm() {
    const nextErrors = {};
    if (!nombre.trim()) {
      nextErrors.nombre = t("errorRequiredName");
    }
    if (!empresa.trim()) {
      nextErrors.empresa = t("errorRequiredCompany");
    }
    if (!correo.trim()) {
      nextErrors.correo = t("errorRequiredEmail");
    } else if (!EMAIL_REGEX.test(correo.trim())) {
      nextErrors.correo = t("errorInvalidEmail");
    }
    if (notas.length > 500) {
      nextErrors.notas = t("errorNotesTooLong");
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSendWhatsApp(e) {
    e.preventDefault();
    if (count === 0) return;
    if (!validateForm()) return;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function handleCopyMessage() {
    if (count === 0) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(message);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = message;
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
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const nameErrorId = `${formId}-nombre-err`;
  const companyErrorId = `${formId}-empresa-err`;
  const emailErrorId = `${formId}-correo-err`;
  const notesErrorId = `${formId}-notas-err`;

  return (
    <Drawer isOpen={isOpen} onClose={close} title={t("rfqDrawerTitle")}>
      {count === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-lavender text-brand-700">
            <ClipboardList className="h-7 w-7" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold text-brand-900">
            {t("rfqEmptyTitle")}
          </h3>
          <p className="mt-1.5 text-sm text-muted">{t("rfqEmptyDesc")}</p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => {
              close();
              navigate("/catalogo");
            }}
          >
            {t("viewCatalog")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-line">
          <div className="px-4 py-4 sm:px-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {count === 1
                  ? t("rfqItemsCountOne")
                  : t("rfqItemsCountLabel", { count })}
              </span>
              {!confirmingClear ? (
                <button
                  type="button"
                  onClick={() => setConfirmingClear(true)}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted hover:bg-lavender hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("clearList")}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-danger">
                    {t("confirmClearList")}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setConfirmingClear(false);
                    }}
                    className="rounded bg-danger px-2 py-1 text-xs font-semibold text-white hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                  >
                    {t("confirmYes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingClear(false)}
                    className="rounded border border-line px-2 py-1 text-xs font-medium text-brand-900 hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
                  >
                    {t("confirmCancel")}
                  </button>
                </div>
              )}
            </div>

            <ul className="divide-y divide-line">
              {lines.map((line) => (
                <RfqItemRow
                  key={line.id}
                  line={line}
                  onUpdateQty={setQty}
                  onRemove={remove}
                />
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleSendWhatsApp}
            noValidate
            className="space-y-4 px-4 py-5 sm:px-6"
          >
            <h3 className="text-base font-semibold text-brand-900">
              {t("rfqFormHeading")}
            </h3>

            <div>
              <label
                htmlFor={`${formId}-nombre`}
                className="block text-sm font-medium text-brand-900"
              >
                {t("fieldFullName")} <span className="text-danger">*</span>
              </label>
              <input
                id={`${formId}-nombre`}
                type="text"
                required
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (errors.nombre) {
                    setErrors((prev) => ({ ...prev, nombre: undefined }));
                  }
                }}
                aria-invalid={Boolean(errors.nombre)}
                aria-describedby={errors.nombre ? nameErrorId : undefined}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                  errors.nombre ? "border-danger" : "border-line"
                }`}
              />
              {errors.nombre && (
                <p
                  id={nameErrorId}
                  role="alert"
                  className="mt-1 text-xs font-medium text-danger"
                >
                  {errors.nombre}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${formId}-empresa`}
                className="block text-sm font-medium text-brand-900"
              >
                {t("fieldCompany")} <span className="text-danger">*</span>
              </label>
              <input
                id={`${formId}-empresa`}
                type="text"
                required
                value={empresa}
                onChange={(e) => {
                  setEmpresa(e.target.value);
                  if (errors.empresa) {
                    setErrors((prev) => ({ ...prev, empresa: undefined }));
                  }
                }}
                aria-invalid={Boolean(errors.empresa)}
                aria-describedby={errors.empresa ? companyErrorId : undefined}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                  errors.empresa ? "border-danger" : "border-line"
                }`}
              />
              {errors.empresa && (
                <p
                  id={companyErrorId}
                  role="alert"
                  className="mt-1 text-xs font-medium text-danger"
                >
                  {errors.empresa}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${formId}-correo`}
                className="block text-sm font-medium text-brand-900"
              >
                {t("fieldEmail")} <span className="text-danger">*</span>
              </label>
              <input
                id={`${formId}-correo`}
                type="email"
                required
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (errors.correo) {
                    setErrors((prev) => ({ ...prev, correo: undefined }));
                  }
                }}
                aria-invalid={Boolean(errors.correo)}
                aria-describedby={errors.correo ? emailErrorId : undefined}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                  errors.correo ? "border-danger" : "border-line"
                }`}
              />
              {errors.correo && (
                <p
                  id={emailErrorId}
                  role="alert"
                  className="mt-1 text-xs font-medium text-danger"
                >
                  {errors.correo}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${formId}-telefono`}
                className="block text-sm font-medium text-brand-900"
              >
                {t("fieldPhone")}{" "}
                <span className="text-xs font-normal text-muted">
                  ({t("fieldPhoneOptional")})
                </span>
              </label>
              <input
                id={`${formId}-telefono`}
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`${formId}-notas`}
                  className="block text-sm font-medium text-brand-900"
                >
                  {t("fieldNotes")}{" "}
                  <span className="text-xs font-normal text-muted">
                    ({t("fieldPhoneOptional")})
                  </span>
                </label>
                <span className="text-xs text-muted font-mono">
                  {notas.length}/500
                </span>
              </div>
              <textarea
                id={`${formId}-notas`}
                rows={3}
                maxLength={500}
                value={notas}
                onChange={(e) => {
                  setNotas(e.target.value);
                  if (errors.notas) {
                    setErrors((prev) => ({ ...prev, notas: undefined }));
                  }
                }}
                aria-invalid={Boolean(errors.notas)}
                aria-describedby={errors.notas ? notesErrorId : undefined}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                  errors.notas ? "border-danger" : "border-line"
                }`}
              />
              {errors.notas && (
                <p
                  id={notesErrorId}
                  role="alert"
                  className="mt-1 text-xs font-medium text-danger"
                >
                  {errors.notas}
                </p>
              )}
            </div>

            {isUrlLong && (
              <div
                role="status"
                className="flex items-start gap-2.5 rounded-lg border border-brand-700/40 bg-lavender p-3 text-xs text-brand-900"
              >
                <Info
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-700"
                  aria-hidden="true"
                />
                <span>{t("longMessageWarning")}</span>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={count === 0}
                className="w-full"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                {t("sendQuoteWhatsApp")}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCopyMessage}
                  className="flex-1"
                >
                  {copied ? (
                    <>
                      <Check
                        className="h-4 w-4 text-success"
                        aria-hidden="true"
                      />
                      <span className="text-success">{t("copiedMessage")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      {t("copyMessage")}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirmingClear(true)}
                >
                  {t("clearList")}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </Drawer>
  );
}
