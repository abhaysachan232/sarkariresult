"use client";

import { useEffect } from "react";

export default function AdsterraNative() {
  useEffect(() => {
    // script ko dynamically load karna (safe way)
    const script = document.createElement("script");
    script.src =
      "https://pl28377656.effectivegatecpm.com/6f91ab1530ac613b3fb97c452a7df0d3/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="container-6f91ab1530ac613b3fb97c452a7df0d3"
      style={{
        width: "100%",
        margin: "16px auto",
        textAlign: "center",
        minHeight: "250px", // CLS prevent
      }}
    />
  );
}
