import { BrowserRouter, Route, Routes } from "react-router-dom";
import { I18nProvider } from "./i18n/I18nContext.jsx";
import { RfqProvider } from "./context/RfqContext.jsx";
import { Layout } from "./components/layout/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Catalog } from "./pages/Catalog.jsx";
import { Brands } from "./pages/Brands.jsx";
import { Contact } from "./pages/Contact.jsx";
import { NotFound } from "./pages/NotFound.jsx";

export default function App() {
  return (
    <I18nProvider>
      <RfqProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/marcas" element={<Brands />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </RfqProvider>
    </I18nProvider>
  );
}
