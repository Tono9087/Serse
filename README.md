# SERSE Industrial — Catálogo B2B y Solicitud de Cotización (RFQ)

Sitio web de catálogo industrial MRO (Mantenimiento, Reparación y Operación) y generador de solicitudes de cotización vía WhatsApp para **SERSE Industrial** (Chihuahua, México).

---

## Características

- **Búsqueda instantánea y difusa:** Autocompletado con debounce (150 ms) indexado por Fuse.js con prioridad a números de parte (N/P) exactos, prefijos y subcadenas.
- **Filtros por facetas en tiempo real:** Navegación por categorías, subcategorías y marcas con conteos actualizados dinámicamente y sincronizados con la URL (`useSearchParams`).
- **Lista de cotización (RFQ) persistente:** Almacenada en `localStorage` (`serse_rfq_v1`), validada contra el catálogo al cargar.
- **Generador de mensaje para WhatsApp:** Formato estructurado con datos del cliente y lista de partidas listo para enviar a través de `wa.me` o copiar al portapapeles.
- **Internacionalización (i18n):** Soporte bilingüe Español (predeterminado) e Inglés con persistencia en `localStorage`. Mensaje de cotización siempre en español.
- **Accesibilidad y diseño:** WCAG 2.1 AA, navegación por teclado, focus trap en modales/drawers, soporte de `prefers-reduced-motion` y tipografía Inter empaquetada localmente.

---

## Tecnologías

- **React 18** + **Vite 5**
- **React Router 6**
- **Tailwind CSS 3.4**
- **Fuse.js 7**
- **Lucide React**
- **Vitest**

---

## Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Linter
npm run lint

# Pruebas unitarias
npm test

# Reporte de calidad de datos del catálogo
npm run report
```

---

## Estructura del Proyecto

```text
├── .gitignore
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/
│       └── placeholder-mro.svg
├── scripts/
│   └── review-report.mjs
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── config/
    │   └── site.js
    ├── data/
    │   └── catalog.json
    ├── i18n/
    │   ├── es.js
    │   ├── en.js
    │   └── I18nContext.jsx
    ├── lib/
    │   ├── normalize.js
    │   ├── search.js
    │   ├── filters.js
    │   ├── whatsapp.js
    │   ├── pagination.js
    │   └── storage.js
    ├── context/
    │   └── RfqContext.jsx
    ├── hooks/
    │   ├── usePageMeta.js
    │   ├── useDebounce.js
    │   └── useFocusTrap.js
    ├── components/
    │   ├── layout/
    │   ├── search/
    │   ├── catalog/
    │   ├── rfq/
    │   └── ui/
    └── pages/
        ├── Home.jsx
        ├── Catalog.jsx
        ├── Brands.jsx
        ├── Contact.jsx
        └── NotFound.jsx
```
