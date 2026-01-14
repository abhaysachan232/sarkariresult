"use client";

import { useEffect } from "react";

export default function MonetagQuge() {
  useEffect(() => {
    // prevent duplicate load
    if (document.querySelector('script[src*="quge5.com/88/tag.min.js"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://quge5.com/88/tag.min.js";
    script.async = true;
    script.setAttribute("data-zone", "202023");
    script.setAttribute("data-cfasync", "false");

    document.body.appendChild(script);
  }, []);

  return null; // Monetag auto inject karta hai ads
}
