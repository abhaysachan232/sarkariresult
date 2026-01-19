"use client";
import { useEffect } from "react";

export default function AdUnit() {
  useEffect(() => {
    try {
      // EXACT Google code
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-4860335301065142"
      data-ad-slot="3153569538"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
