import { useEffect, useRef, useState } from "react";

/**
 * ParallaxHero component
 * Renders an isolated hero section with an absolutely positioned,
 * parallax-scrolling background image layer.
 *
 * Behavior:
 * 1. Image layer: `top: -(extra * 100)%`, `height: (1 + extra) * 100%`, `object-cover`.
 *    `objectPosition` is set to `focus` (default "50% 0%").
 * 2. On scroll: translated down by `Math.min(window.scrollY * speed, extra * sectionHeight)`
 *    via `translate3d`, updated through `requestAnimationFrame` with a passive scroll listener.
 *    Section height is tracked with a `ResizeObserver`.
 * 3. Purple gradient overlay and optional bottom fade into lavender (`h-1/3`, `from-lavender to-transparent`).
 * 4. Parallax is disabled (static image, no listener, `top: 0`, `height: 100%`) when
 *    `prefers-reduced-motion: reduce` or viewport is under 768px.
 * 5. Decorative image (`alt=""`, `aria-hidden="true"`). Falls back to plain gradient band if missing.
 */
export function ParallaxHero({
  imageSrc = "/images/about-hero.jpg",
  speed = 0.2,
  extra = 0.12,
  focus = "50% 0%",
  bottomFade = true,
  overlayClassName = "bg-gradient-to-b from-brand-950/90 via-brand-800/80 to-brand-700/65",
  className = "",
  children,
}) {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const sectionHeightRef = useRef(0);
  const [imgFailed, setImgFailed] = useState(false);
  const [isParallaxActive, setIsParallaxActive] = useState(false);

  // Check viewport width (>=768px) and reduced-motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthQuery = window.matchMedia("(min-width: 768px)");

    const updateActive = () => {
      setIsParallaxActive(widthQuery.matches && !motionQuery.matches);
    };

    updateActive();

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", updateActive);
      widthQuery.addEventListener("change", updateActive);
    } else {
      motionQuery.addListener(updateActive);
      widthQuery.addListener(updateActive);
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", updateActive);
        widthQuery.removeEventListener("change", updateActive);
      } else {
        motionQuery.removeListener(updateActive);
        widthQuery.removeListener(updateActive);
      }
    };
  }, []);

  // Measure section height and track resize
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    sectionHeightRef.current = el.offsetHeight;

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        if (sectionRef.current) {
          sectionHeightRef.current = sectionRef.current.offsetHeight;
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  // Update parallax scroll offset via RAF and passive listener
  useEffect(() => {
    if (!isParallaxActive || imgFailed) {
      if (imgRef.current) {
        imgRef.current.style.transform = "none";
      }
      return;
    }

    let rafId = null;
    let ticking = false;

    const updateTransform = () => {
      if (imgRef.current) {
        const secH =
          sectionHeightRef.current ||
          (sectionRef.current ? sectionRef.current.offsetHeight : 0);
        const maxShift = extra * secH;
        const shift = Math.min(window.scrollY * speed, maxShift);
        imgRef.current.style.transform = `translate3d(0, ${shift}px, 0)`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(updateTransform);
      }
    };

    updateTransform();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isParallaxActive, imgFailed, speed, extra]);

  const hasImage = Boolean(imageSrc && !imgFailed);

  return (
    <section
      ref={sectionRef}
      className={`relative isolate overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-brand-800 text-white ${className}`}
    >
      {/* 1. Background image layer */}
      {hasImage && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt=""
          aria-hidden="true"
          loading="eager"
          onError={() => setImgFailed(true)}
          className="pointer-events-none absolute inset-x-0 w-full object-cover select-none"
          style={
            isParallaxActive
              ? {
                  top: `-${extra * 100}%`,
                  height: `${(1 + extra) * 100}%`,
                  objectPosition: focus,
                  willChange: "transform",
                }
              : {
                  top: 0,
                  height: "100%",
                  objectPosition: focus,
                }
          }
        />
      )}

      {/* 2. Gradient overlay */}
      <div
        className={`pointer-events-none absolute inset-0 ${overlayClassName}`}
        aria-hidden="true"
      />

      {/* 3. Bottom fade into lavender */}
      {bottomFade && (
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-lavender to-transparent"
          aria-hidden="true"
        />
      )}

      {/* 4. Foreground content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
