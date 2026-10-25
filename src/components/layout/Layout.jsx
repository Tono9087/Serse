import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SkipLink } from "./SkipLink.jsx";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import { FloatingWhatsApp } from "./FloatingWhatsApp.jsx";
import { RfqDrawer } from "../rfq/RfqDrawer.jsx";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <RfqDrawer />
    </div>
  );
}
