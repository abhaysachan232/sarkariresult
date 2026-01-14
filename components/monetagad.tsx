"use client";

import Script from "next/script";

export default function MonetagAd() {
  return (
    <Script
      src="https://al5sm.com/tag.min.js"
      strategy="afterInteractive"
      data-zone="10402380"
    />
  );
}
