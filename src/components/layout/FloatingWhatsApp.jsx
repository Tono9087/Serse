import { MessageSquare } from "lucide-react";
import { SITE } from "../../config/site.js";
import { buildGenericGreetingUrl } from "../../lib/whatsapp.js";
import { useI18n } from "../../i18n/I18nContext.jsx";

export function FloatingWhatsApp() {
  const { t } = useI18n();

  if (!SITE.whatsappNumber) return null;

  const waHref = buildGenericGreetingUrl(SITE.whatsappNumber);

  return (
    <aside aria-label="WhatsApp" className="fixed bottom-6 right-6 z-40">
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("quoteViaWhatsApp")}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg transition duration-150 hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
      >
        <MessageSquare className="h-7 w-7 text-brand-950" aria-hidden="true" />
      </a>
    </aside>
  );
}
