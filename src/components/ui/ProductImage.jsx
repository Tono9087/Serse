import { useEffect, useState } from "react";

const PLACEHOLDER_SRC = "/images/placeholder-mro.svg";

export function ProductImage({
  src,
  alt,
  className = "",
  width = 400,
  height = 300,
}) {
  const validInitialSrc =
    typeof src === "string" && src.startsWith("/images/")
      ? src
      : PLACEHOLDER_SRC;

  const [imgSrc, setImgSrc] = useState(validInitialSrc);

  useEffect(() => {
    setImgSrc(
      typeof src === "string" && src.startsWith("/images/")
        ? src
        : PLACEHOLDER_SRC
    );
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt || "Producto industrial MRO"}
      width={width}
      height={height}
      loading="lazy"
      onError={() => {
        if (imgSrc !== PLACEHOLDER_SRC) {
          setImgSrc(PLACEHOLDER_SRC);
        }
      }}
      className={`object-contain ${className}`}
    />
  );
}
