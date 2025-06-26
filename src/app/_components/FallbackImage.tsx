"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

type FallbackImageProps = ImageProps & {
  fallbackSrc: string;
};

export default function FallbackImage({
  fallbackSrc,
  src,
  ...rest
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(
    typeof src === "string" && src ? src : null
  );

  useEffect(() => {
    if (typeof src === "string" && src) {
      setImgSrc(src);
    }
  }, [src]);

  if (!imgSrc) return null;

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => setImgSrc(fallbackSrc)}
      alt={rest.alt}
    />
  );
}
