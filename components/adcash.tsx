"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    aclib: any;
  }
}

export default function AdcashAutoTag() {
  useEffect(() => {
    // agar script pehle se loaded ho to dobara mat load karo
    if (window.aclib) {
      window.aclib.runAutoTag({
        zoneId: "3k379dy1qe",
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.adcash.com/aclib.js";
    script.async = true;

    script.onload = () => {
      window.aclib.runAutoTag({
        zoneId: "3k379dy1qe",
      });
    };

    document.body.appendChild(script);
  }, []);

  return null; // AutoTag ko UI element ki zaroorat nahi hoti
}
