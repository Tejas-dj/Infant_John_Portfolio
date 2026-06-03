"use client";

import { useEffect, useRef } from "react";
import { getCldImageUrl } from "next-cloudinary";

interface Props {
  srcs: string[];
}

export default function LightboxPreloader({ srcs }: Props) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current || srcs.length === 0) return;
    started.current = true;

    let i = 0;
    const batch = 4;

    function loadNext() {
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(() => run());
      } else {
        setTimeout(run, 100);
      }
    }

    function run() {
      const end = Math.min(i + batch, srcs.length);
      for (; i < end; i++) {
        const img = new Image();
        img.src = getCldImageUrl({
          src: srcs[i],
          width: 1200,
          quality: "auto",
          format: "auto",
        });
      }
      if (i < srcs.length) {
        loadNext();
      }
    }

    loadNext();
  }, [srcs]);

  return null;
}
