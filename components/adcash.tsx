"use client";

import Script from "next/script";

export default function AdcashAutoTag() {
  return (
    <>
      {/* Adcash main script */}
      <Script
        id="adcash-lib"
        src="https://acscdn.com/script/aclib.js"
        strategy="afterInteractive"
      />

      {/* Run AutoTag AFTER script loads */}
      <Script
        id="adcash-run"
        strategy="afterInteractive"
      >
        {`
          if (typeof aclib !== "undefined") {
            aclib.runAutoTag({
              zoneId: '3k379dy1qe'
            });
          }
        `}
      </Script>
    </>
  );
}
