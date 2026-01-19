"use client";

import { useEffect } from "react";

export default function FluidAd() {
  useEffect(() => {
    try {
      // AdSense ka original push
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("Adsense error", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-format="fluid"
      data-ad-layout-key="-ef+6k-30-ac+ty"
      data-ad-client="ca-pub-4860335301065142"
      data-ad-slot="4371160621"
    />
  );
}
