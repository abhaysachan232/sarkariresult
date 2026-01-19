"use client";

import { useEffect } from "react";

export default function InArticleAd() {
  useEffect(() => {
    try {
      // Google ka original push
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("Adsense error", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center" }}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client="ca-pub-4860335301065142"
      data-ad-slot="8118833945"
    />
  );
}
