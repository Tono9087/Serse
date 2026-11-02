# Grupo SERSE — Catálogo Digital B2B y Cotizador Industrial (RFQ)

Aplicación web de catálogo industrial **MRO (Mantenimiento, Reparación y Operación)** y generador de solicitudes de cotización vía WhatsApp desarrollada para **Grupo SERSE** (Chihuahua, México).

El sistema permite a compradores industriales localizar refacciones y suministros por **número de parte (N/P)**, descripción o marca, armar una lista de cotización persistente en el navegador y enviarla en un mensaje estructurado listo para atención comercial por WhatsApp.

---

## Tabla de Contenidos

1. [Características Principales](#características-principales)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Requisitos Previos e Instalación Local](#requisitos-previos-e-instalación-local)
4. [Scripts y Comandos Disponibles](#scripts-y-comandos-disponibles)
5. [Arquitectura y Estructura del Proyecto](#arquitectura-y-estructura-del-proyecto)
6. [Configuración Centralizada de Contacto y Negocio](#configuración-centralizada-de-contacto-y-negocio)
7. [Guía de Mantenimiento del Catálogo](#guía-de-mantenimiento-del-catálogo)
8. [Despliegue en Producción](#despliegue-en-producción)

---

## Características Principales

- **Búsqueda instantánea orientada a N/P:** Autocompletado con *debounce* (150 ms) impulsado por **Fuse.js**, con clasificación determinista que prioriza coincidencias exactas de número de parte, prefijos, subcadenas y coincidencias difusas.
- **Filtrado por facetas sincronizado con URL:** Filtros en tiempo real por categoría, subcategoría y marca (con soporte de vista en cuadrícula o tabla técnica), paginación configurable y estado reflejado en query params (`?q=`, `?cat=`, `?sub=`, `?brand=`, `?sort=`, `?view=`).
- **Directorio de marcas sincronizado con inventario:** Separación automática entre marcas con stock activo en el catálogo (destacando líneas principales como **Brady**, **SMC**, **Siemens** y **Truper**) y marcas aliadas suministradas bajo pedido / cotización directa.
- **Carrito de cotización (RFQ) persistente:** Almacenado en `localStorage` (`serse_rfq_v1`), validado contra las partidas activas del catálogo al iniciar y con sanitización de entrada para evitar romper el formato de WhatsApp.
- **Cumplimiento legal base (LFPDPPP):** Ruta dedicada de Aviso de Privacidad (`/aviso-privacidad` y `/privacidad`) enlazada en el pie de página y en el formulario de envío de cotizaciones.
- **Internacionalización (ES / EN) y Accesibilidad (WCAG 2.1 AA):** Interfaz bilingüe con persistencia de idioma (`serse_lang`), trampa de foco en *drawers*, anuncios `aria-live` y soporte de `prefers-reduced-motion`.

---

## Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Librería UI** | React 18 |
| **Bundler y Servidor Dev** | Vite 7 |
| **Enrutamiento SPA** | React Router DOM 7 |
| **Estilos y Diseño** | Tailwind CSS 3.4 + tipografía local `@fontsource/inter` |
| **Motor de Búsqueda** | Fuse.js 7 |
| **Iconografía** | Lucide React |
| **Testing y Calidad** | Vitest 4 + ESLint 9 |

---

## Requisitos Previos e Instalación Local

- **Node.js:** versión **18.18+** o **20 LTS+** recomendada.
- **npm:** versión **9+** (incluido con Node.js).

### Instalación paso a paso

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd Serse

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo (http://localhost:5173)
npm run dev
```

> [!NOTE]
> **Nota técnica para Windows PowerShell (`ExecutionPolicy`):**
> En sistemas Windows donde la política de ejecución de scripts esté restringida (`Restricted`), invocar `npm` en PowerShell puede arrojar el error `File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system`.
>
> Tienes dos opciones para trabajar sin fricción:
> 1. **Usar el binario CMD directamente (recomendado sin modificar permisos del sistema):**
>    ```powershell
>    npm.cmd install
>    npm.cmd run dev
>    npm.cmd run build
>    npm.cmd test
>    ```
> 2. **Habilitar scripts firmados localmente para tu usuario actual:**
>    ```powershell
>    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
>    ```

---

## Scripts y Comandos Disponibles

| Comando | Comando en PowerShell restringido | Descripción |
| :--- | :--- | :--- |
| `npm run dev` | `npm.cmd run dev` | Inicia el servidor de desarrollo de Vite con HMR. |
| `npm run build` | `npm.cmd run build` | Genera el bundle estático optimizado para producción en `dist/`. |
| `npm run preview` | `npm.cmd run preview` | Sirve localmente el contenido compilado de `dist/` para verificación previa al despliegue. |
| `npm test` | `npm.cmd test` | Ejecuta la suite de pruebas unitarias con Vitest (búsqueda, filtros, marcas, WhatsApp, paridad i18n e integridad del catálogo). |
| `npm run lint` | `npm.cmd run lint` | Ejecuta ESLint sobre todo el código fuente. |
| `npm run report` | `npm.cmd run report` | Ejecuta `scripts/review-report.mjs` para auditar partidas del catálogo sin marca, sin N/P o con banderas de revisión (`reviewFlags`). |

---

## Arquitectura y Estructura del Proyecto

```text
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json                  # Regla de reescritura SPA para Vercel
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/
│       ├── banner_bg.webp       # Hero principal optimizado (WebP)
│       ├── about-hero.webp      # Hero de Nosotros optimizado (WebP)
│       ├── logo.png
│       ├── placeholder-mro.svg  # Imagen fallback para partidas sin foto
│       ├── brands/              # Logotipos de marcas (SVG/PNG/WebP)
│       └── clients/             # Logotipos de clientes industriales
├── scripts/
│   └── review-report.mjs        # Auditoría de calidad de datos del catálogo
└── src/
    ├── main.jsx
    ├── App.jsx                  # Definición de rutas principales
    ├── config/
    │   ├── site.js              # Fuente única de verdad: contacto, WhatsApp y razón social
    │   ├── brands.js            # Marcas curadas y mapeo de nombres en catálogo
    │   └── about.js             # Contenido institucional de "Sobre nosotros"
    ├── data/
    │   └── catalog.json         # Base de datos estática de productos MRO
    ├── i18n/
    │   ├── es.js                # Diccionario Español (debe mantener paridad de claves con en.js)
    │   ├── en.js                # Diccionario Inglés
    │   └── I18nContext.jsx
    ├── lib/
    │   ├── normalize.js         # Normalización de texto y números de parte
    │   ├── search.js            # Índice Fuse.js y ranking por coincidencia de N/P
    │   ├── filters.js           # Facetas, filtrado y ordenamiento
    │   ├── brands.js            # Conteo y directorio dinámico de marcas (stock vs. bajo pedido)
    │   ├── categories.js        # Agrupación de categorías y subcategorías
    │   ├── whatsapp.js          # Generador de mensaje de cotización y enlaces wa.me
    │   ├── pagination.js        # Cálculo de páginas y rangos
    │   ├── storage.js           # Persistencia segura en localStorage
    │   └── __tests__/           # Pruebas unitarias con Vitest
    ├── context/
    │   └── RfqContext.jsx       # Estado global de la lista de cotización
    ├── hooks/
    │   ├── usePageMeta.js       # Títulos, meta descriptions, OpenGraph y canonical URLs
    │   ├── useDebounce.js
    │   └── useFocusTrap.js
    ├── components/
    │   ├── layout/              # Header, Footer, Container, Layout, FloatingWhatsApp
    │   ├── search/              # SearchBox con autocompletado
    │   ├── catalog/             # ProductCard, ProductTable, FilterSidebar, Pagination...
    │   ├── brands/              # BrandCard
    │   ├── clients/             # ClientsSection
    │   ├── rfq/                 # RfqButton, RfqDrawer, RfqItemRow
    │   └── ui/                  # Drawer, Button, Badge, Breadcrumbs, ParallaxHero...
    └── pages/
        ├── Home.jsx             # /
        ├── About.jsx            # /nosotros
        ├── Catalog.jsx          # /catalogo
        ├── ProductPage.jsx      # /producto/:id
        ├── Brands.jsx           # /marcas
        ├── Contact.jsx          # /contacto
        ├── PrivacyPolicy.jsx    # /aviso-privacidad y /privacidad
        └── NotFound.jsx         # *
```

---

## Configuración Centralizada de Contacto y Negocio

Todos los teléfonos, números de WhatsApp, correos y datos legales se concentran exclusivamente en [`src/config/site.js`](src/config/site.js):

- `BUSINESS_NAME`: Nombre comercial mostrado en la interfaz, metadatos y encabezado del mensaje de WhatsApp (`"Grupo SERSE"`).
- `WHATSAPP_NUMBER`: Número limpio con código de país (solo dígitos, ej. `"5216145341188"`) utilizado para generar todos los enlaces `https://wa.me/...`.
- `PHONE_DISPLAY`: Teléfono formateado para lectura humana en Header, Footer y Contacto (ej. `"+52 614 490 1653"`).
- `EMAIL_CONTACT`: Correo comercial. Si se deja como cadena vacía (`""`), la interfaz oculta automáticamente cualquier tarjeta o enlace `mailto:`.
- `SITE.legalEntityPlaceholder` y `SITE.legalAddressPlaceholder`: Textos configurables para la identidad y domicilio fiscal mostrados en el Aviso de Privacidad.

También es posible sobrescribir los datos de contacto en tiempo de compilación mediante variables de entorno en un archivo `.env`:

```ini
VITE_WHATSAPP_NUMBER=5216145341188
VITE_PHONE_DISPLAY="+52 614 490 1653"
VITE_CONTACT_EMAIL="ventas@gruposerse.com"
```

---

## Guía de Mantenimiento del Catálogo

El catálogo de productos se almacena en [`src/data/catalog.json`](src/data/catalog.json) como un arreglo JSON de objetos.

### Estructura de un producto

```json
{
  "id": "p004",
  "name": "Cilindro antigiro",
  "brand": "SMC",
  "np": "CDG1KBN25-75",
  "category": "Neumática",
  "subcategory": "Actuadores y cilindros",
  "image": "/images/products/p004.webp"
}
```

| Campo | Tipo | Obligatorio | Descripción |
| :--- | :--- | :---: | :--- |
| `id` | `string` | Sí | Identificador único e inmutable (ej. `"p099"`). Se usa en la URL `/producto/:id` y en `localStorage`. |
| `name` | `string` | Sí | Nombre descriptivo de la pieza o suministro en español. |
| `brand` | `string \| null` | Sí | Nombre del fabricante (ej. `"Brady"`, `"SMC"`) o `null` si no está especificado. |
| `np` | `string \| null` | Sí | Número de parte o modelo del fabricante, o `null` si está por confirmar. |
| `category` | `string` | Sí | Categoría principal (debe coincidir con las categorías existentes para mantener los iconos y traducciones). |
| `subcategory` | `string` | Sí | Subcategoría técnica dentro de la categoría principal. |
| `image` | `string \| null` | Sí | Ruta pública de la imagen en `public/` (ej. `"/images/products/p004.webp"`) o `null` para usar el placeholder industrial. |
| `reviewFlags` | `string[]` | No | Lista opcional de banderas internas para auditoría de datos (`npm run report`). |

### Operaciones frecuentes

1. **Dar de alta un producto:**
   - Añade un nuevo objeto al final de `src/data/catalog.json` con un `id` único (ej. `"p099"`).
   - Si agregas fotografía, colócala en `public/images/` en formato **WebP** (recomendado ≤ 200 kB, relación cuadrada o 4:3) y asigna su ruta en `"image"`.
2. **Editar un producto existente:**
   - Modifica `name`, `brand`, `np`, `category`, `subcategory` o `image` conservando el mismo `id` para no invalidar enlaces compartidos ni listas de cotización guardadas por los clientes.
3. **Retirar un producto:**
   - Elimina el objeto correspondiente de `src/data/catalog.json`. El `RfqContext` descartará automáticamente cualquier `id` retirado que un usuario tuviera guardado en su navegador.
4. **Verificar la integridad tras cualquier cambio:**
   ```bash
   npm.cmd test
   npm.cmd run report
   ```
   La prueba `src/lib/__tests__/catalog.test.js` valida que no existan `id` duplicados y que todos los registros cumplan el esquema requerido.

---

## Despliegue en Producción

El proyecto genera un sitio 100 % estático en la carpeta `dist/` sin requerir servidor Node.js en tiempo de ejecución.

### Opción A: Vercel (recomendado)

El repositorio incluye [`vercel.json`](vercel.json) con la regla de reescritura hacia `/index.html` para soportar todas las rutas de React Router (`/catalogo`, `/producto/:id`, `/marcas`, `/aviso-privacidad`, etc.):

1. Importa el repositorio en Vercel.
2. Configura:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Define las variables `VITE_WHATSAPP_NUMBER`, `VITE_PHONE_DISPLAY` y `VITE_CONTACT_EMAIL` en *Project Settings → Environment Variables* si deseas gestionarlas desde el panel.
4. Despliega y vincula el dominio `gruposerse.com`.

### Opción B: Netlify / Cloudflare Pages / Servidor Nginx o Apache

1. Ejecuta `npm.cmd run build`.
2. Publica el contenido del directorio `dist/`.
3. Configura una regla de *fallback* SPA para que cualquier ruta no estática sirva `/index.html` con código HTTP `200`.