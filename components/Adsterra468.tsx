"use client";

import { useEffect } from "react";

export default function AdsterraBanner468() {
  useEffect(() => {
    // atOptions ko window par set karna zaroori hai
    (window as any).atOptions = {
      key: "46790ee0bd09769f9085ba1bcd351147",
      format: "iframe",
      height: 60,
      width: 468,
      params: {},
    };

    const script = document.createElement("script");
    script.src =
      "https://www.highperformanceformat.com/46790ee0bd09769f9085ba1bcd351147/invoke.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      style={{
        width: "468px",
        height: "60px",
        margin: "12px auto",
        textAlign: "center",
        overflow: "hidden",
      }}
    />
  );
}
