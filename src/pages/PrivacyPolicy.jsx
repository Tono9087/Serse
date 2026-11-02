import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import {
  BUSINESS_NAME,
  EMAIL_CONTACT,
  PHONE_DISPLAY,
  PHONE_HREF,
  SITE,
} from "../config/site.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { useI18n } from "../i18n/I18nContext.jsx";
import { Container } from "../components/layout/Container.jsx";

export function PrivacyPolicy() {
  const { lang, t } = useI18n();
  const isEn = lang === "en";

  usePageMeta({
    title: t("metaPrivacyTitle"),
    description: t("metaPrivacyDesc"),
  });

  const controllerName = SITE.legalEntityPlaceholder || BUSINESS_NAME;
  const controllerAddress = SITE.legalAddressPlaceholder || SITE.location;

  return (
    <Container className="py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{t("backToHome")}</span>
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-brand-900 text-white">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-900 sm:text-3xl md:text-4xl">
              {t("privacyPageTitle")}
            </h1>
            <p className="mt-0.5 text-xs text-muted">
              {t("privacyPageSubtitle")}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-8 rounded-xl border border-line bg-white p-6 sm:p-8 text-sm leading-relaxed text-ink shadow-sm">
          {/* 1. Identity and domicile */}
          <section aria-labelledby="privacy-sec-1">
            <h2
              id="privacy-sec-1"
              className="text-lg font-semibold text-brand-900"
            >
              {isEn
                ? "1. Identity and Address of the Data Controller"
                : "1. Identidad y domicilio del responsable"}
            </h2>
            <p className="mt-2">
              {isEn ? (
                <>
                  In compliance with the Mexican Federal Law on Protection of
                  Personal Data Held by Private Parties (
                  <em>
                    Ley Federal de Protección de Datos Personales en Posesión de
                    los Particulares
                  </em>{" "}
                  — LFPDPPP) and its Regulations,{" "}
                  <strong>{controllerName}</strong>, commercially known as{" "}
                  <strong>{BUSINESS_NAME}</strong>, with address in{" "}
                  <strong>{controllerAddress}</strong>, is responsible for the
                  use, processing, and protection of the personal data collected
                  through this website and its quotation channels.
                </>
              ) : (
                <>
                  En cumplimiento con lo dispuesto por la{" "}
                  <strong>
                    Ley Federal de Protección de Datos Personales en Posesión de
                    los Particulares (LFPDPPP)
                  </strong>{" "}
                  y su Reglamento, <strong>{controllerName}</strong>, conocido
                  comercialmente como <strong>{BUSINESS_NAME}</strong>, con
                  domicilio en <strong>{controllerAddress}</strong>, es el
                  responsable del uso, tratamiento y protección de los datos
                  personales que se recaban a través de este sitio web y de sus
                  canales de atención comercial.
                </>
              )}
            </p>
          </section>

          {/* 2. Personal data collected */}
          <section aria-labelledby="privacy-sec-2">
            <h2
              id="privacy-sec-2"
              className="text-lg font-semibold text-brand-900"
            >
              {isEn
                ? "2. Personal Data Collected"
                : "2. Datos personales que se recaban"}
            </h2>
            <p className="mt-2">
              {isEn
                ? "To process your quotation requests (RFQ) and provide commercial follow-up, we may collect the following identification and business contact data:"
                : "Para dar atención a sus solicitudes de cotización (RFQ) y brindarle seguimiento comercial, podemos recabar las siguientes categorías de datos de identificación y contacto laboral:"}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                {isEn
                  ? "Full name of the requester or purchasing contact."
                  : "Nombre completo de la persona solicitante o contacto de compras."}
              </li>
              <li>
                {isEn
                  ? "Company, plant, or organization name."
                  : "Nombre de la empresa, planta o razón social."}
              </li>
              <li>
                {isEn
                  ? "Business email address."
                  : "Correo electrónico de contacto."}
              </li>
              <li>
                {isEn
                  ? "Telephone or mobile number (including WhatsApp number when you initiate the conversation)."
                  : "Número telefónico fijo o móvil (incluyendo el número de WhatsApp desde el cual nos contacte)."}
              </li>
              <li>
                {isEn
                  ? "Quotation details: requested items, part numbers (P/N), quantities, brands, and technical or delivery notes."
                  : "Detalles de la solicitud de cotización: partidas seleccionadas, números de parte (N/P), cantidades, marcas y comentarios o notas técnicas."}
              </li>
            </ul>
            <p className="mt-2 text-xs text-muted">
              {isEn
                ? "We do not collect sensitive personal data through this website. Your draft quote list is stored locally in your own browser (localStorage) until you choose to send it."
                : "No recabamos datos personales sensibles a través de este sitio web. La lista preliminar de cotización se guarda únicamente de forma local en su navegador (localStorage) hasta que usted decide enviarla."}
            </p>
          </section>

          {/* 3. Purposes of processing */}
          <section aria-labelledby="privacy-sec-3">
            <h2
              id="privacy-sec-3"
              className="text-lg font-semibold text-brand-900"
            >
              {isEn
                ? "3. Purposes of Data Processing"
                : "3. Finalidades del tratamiento de los datos"}
            </h2>
            <p className="mt-2">
              {isEn
                ? "The personal data we collect will be used for the following primary purposes, which are necessary to provide the requested service:"
                : "Los datos personales recabados serán utilizados para las siguientes finalidades primarias, necesarias para el servicio solicitado:"}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                {isEn
                  ? "Prepare, send, and follow up on MRO product and spare-part quotations."
                  : "Elaborar, enviar y dar seguimiento a las cotizaciones de suministros y refacciones MRO solicitadas."}
              </li>
              <li>
                {isEn
                  ? "Confirm technical specifications, part numbers, stock availability, and delivery lead times."
                  : "Confirmar especificaciones técnicas, números de parte, disponibilidad de inventario y tiempos de entrega."}
              </li>
              <li>
                {isEn
                  ? "Establish commercial communication via WhatsApp, phone, or email regarding your request, purchase orders, and invoicing."
                  : "Establecer comunicación comercial vía WhatsApp, teléfono o correo electrónico respecto a su solicitud, órdenes de compra y facturación."}
              </li>
            </ul>
            <p className="mt-2">
              {isEn
                ? "We do not transfer your personal data to unrelated third parties without your consent, except in the cases legally provided for in Article 37 of the LFPDPPP."
                : "Sus datos personales no serán transferidos a terceros ajenos sin su consentimiento, salvo las excepciones previstas en el artículo 37 de la LFPDPPP."}
            </p>
          </section>

          {/* 4. ARCO Rights */}
          <section aria-labelledby="privacy-sec-4">
            <h2
              id="privacy-sec-4"
              className="text-lg font-semibold text-brand-900"
            >
              {isEn
                ? "4. ARCO Rights and Contact Mechanisms"
                : "4. Derechos ARCO y medios de contacto"}
            </h2>
            <p className="mt-2">
              {isEn
                ? "You have the right to know what personal data we hold about you, how we use it, and the conditions of its use (Access). Likewise, it is your right to request the correction of your personal information if it is outdated, inaccurate, or incomplete (Rectification); that we delete it from our records or databases when you consider that it is not being used in accordance with the principles, duties, and obligations provided for in the regulations (Cancellation); as well as to oppose the use of your personal data for specific purposes (Opposition). These rights are known as ARCO rights."
                : "Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada conforme a los principios, deberes y obligaciones previstas en la normativa (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO."}
            </p>
            <p className="mt-2">
              {isEn
                ? "To exercise any of your ARCO rights or revoke your consent, please submit your request through our official contact channels, indicating your full name, the right you wish to exercise, and a contact method to receive our response:"
                : "Para ejercer cualquiera de los derechos ARCO o revocar su consentimiento, puede presentar su solicitud a través de nuestros canales de contacto oficiales, indicando su nombre completo, el derecho que desea ejercer y un medio para comunicarle la respuesta:"}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {PHONE_DISPLAY && (
                <li>
                  {isEn ? "Phone: " : "Teléfono: "}
                  <a
                    href={PHONE_HREF}
                    className="font-mono font-semibold text-brand-700 hover:underline"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </li>
              )}
              {EMAIL_CONTACT && (
                <li>
                  {isEn ? "Email: " : "Correo electrónico: "}
                  <a
                    href={`mailto:${EMAIL_CONTACT}`}
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    {EMAIL_CONTACT}
                  </a>
                </li>
              )}
              <li>
                {isEn ? "Location: " : "Ubicación: "}
                <span>{SITE.location}</span>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="font-semibold text-brand-700 hover:underline"
                >
                  {isEn ? "Contact page" : "Página de contacto"}
                </Link>
              </li>
            </ul>
          </section>

          {/* 5. Updates */}
          <section aria-labelledby="privacy-sec-5">
            <h2
              id="privacy-sec-5"
              className="text-lg font-semibold text-brand-900"
            >
              {isEn
                ? "5. Changes to the Privacy Notice"
                : "5. Cambios al aviso de privacidad"}
            </h2>
            <p className="mt-2">
              {isEn
                ? "This privacy notice may be modified or updated due to new legal requirements or changes in our commercial processes. Any updates will be published directly on this page."
                : "El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales o de nuestras propias necesidades comerciales. Cualquier actualización estará disponible en esta misma página."}
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
