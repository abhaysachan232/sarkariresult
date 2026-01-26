"use client";

import { useEffect } from "react";

export default function AppScale({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const baseWidth = 1280; // 👈 tumhari design width

    const resize = () => {
      const scale = window.innerWidth / baseWidth;
      const el = document.getElementById("app-scale");
      if (el) {
        el.style.transform = `scale(${scale})`;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      id="app-scale"
      className="origin-top-left w-[1280px] min-h-screen"
    >
      {children}
    </div>
  );
}
