import { useState } from "react";
import { SITE } from "../../config/site.js";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { Container } from "../layout/Container.jsx";

/**
 * Clients section ("Empresas que confían en nosotros")
 * Displays official client logos on white cards against a brand purple gradient band.
 * Omitted entirely if no client logos load successfully.
 */
export function ClientsSection() {
  const { t } = useI18n();
  const [loadedMap, setLoadedMap] = useState({});

  if (!SITE.clients || SITE.clients.length === 0) return null;

  const anyLoaded = Object.values(loadedMap).some(Boolean);

  return (
    <>
      {/* Invisible test images to detect if local files exist */}
      <div className="sr-only" aria-hidden="true">
        {SITE.clients.map((client) => (
          <img
            key={`preload-${client.name}`}
            src={client.logo}
            alt=""
            onLoad={() =>
              setLoadedMap((prev) => ({ ...prev, [client.name]: true }))
            }
            onError={() =>
              setLoadedMap((prev) => ({ ...prev, [client.name]: false }))
            }
          />
        ))}
      </div>

      {anyLoaded && (
        <section className="bg-gradient-to-b from-brand-800 to-brand-700 py-16 text-white">
          <Container>
            <h2 className="text-center text-2xl font-bold tracking-tight text-white md:text-3xl">
              {t("clientsHeading")}
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {SITE.clients.map((client) => {
                if (!loadedMap[client.name]) return null;
                return (
                  <div
                    key={client.name}
                    className="flex h-40 w-full sm:w-64 items-center justify-center rounded-2xl bg-white p-6 shadow-lg"
                  >
                    <img
                      src={client.logo}
                      alt={client.name}
                      loading="lazy"
                      className="max-h-20 max-w-[80%] object-contain"
                      onError={() =>
                        setLoadedMap((prev) => ({ ...prev, [client.name]: false }))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
