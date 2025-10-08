"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

// -------------------------
// TypeScript types for SWG
// -------------------------
interface SWGBasicSubscriptions {
  init: (options: {
    type: string;
    isPartOfType: string[];
    isPartOfProductId: string;
    clientOptions: { theme: string; lang: string };
  }) => void;

  getLoginPromise: () => Promise<void>;
  requestLogin: () => void;
}

declare global {
  interface Window {
    SWG_BASIC: Array<(subs: SWGBasicSubscriptions) => void>;
  }
}

// -------------------------
// SWG Follow Button Component
// -------------------------
export default function SwgFollowButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [swgReady, setSwgReady] = useState(false);

  // Check previous login state
  useEffect(() => {
    const loggedIn = localStorage.getItem("swgUser") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleFollow = () => {
    if (!swgReady) return;

    window.SWG_BASIC?.push((subs: SWGBasicSubscriptions) => {
      subs.requestLogin();
      subs.getLoginPromise().then(() => {
        setIsLoggedIn(true);
        localStorage.setItem("swgUser", "true");
      });
    });
  };

  if (isLoggedIn) return null;

  return (
    <>
      {/* SWG SDK Script */}
      <Script
        src="https://news.google.com/swg/js/v1/swg-basic.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.SWG_BASIC = window.SWG_BASIC || [];
          window.SWG_BASIC.push((subs: SWGBasicSubscriptions) => {
            subs.init({
              type: "NewsArticle",
              isPartOfType: ["Product"],
              isPartOfProductId: "CAowhNjBDA:openaccess", // replace with your product ID
              clientOptions: { theme: "light", lang: "en-GB" },
            });
          });
          setSwgReady(true);
        }}
      />

      {/* Follow Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px 0" }}>
        <button
          onClick={handleFollow}
          disabled={!swgReady}
          style={{
            backgroundColor: swgReady ? "#1a73e8" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "10px 20px",
            cursor: swgReady ? "pointer" : "not-allowed",
            fontSize: "16px",
          }}
        >
          Follow
        </button>
      </div>

      {/* ⚠ Localhost warning */}
      {typeof window !== "undefined" &&
        window.location.hostname === "localhost" && (
          <p style={{ color: "red", fontSize: "12px" }}>
            ⚠ SWG login may not work on localhost. Use your verified domain for testing.
          </p>
        )}
    </>
  );
}
