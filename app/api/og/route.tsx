/** @jsxImportSource react */
import { ImageResponse } from "next/og";
import * as React from "react";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Default Title";
  const footerText = searchParams.get("footerText") || "";
  const type = searchParams.get("type") || "default";
  const logo = "https://sarkariresult.rest/jobs-images/logo.png";

  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    background:
      type === "minimal"
        ? "#ffffff"
        : "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
    color: type === "minimal" ? "#000" : "#fff",
    fontSize: 60,
    fontWeight: 700,
    position: "relative",
    padding: "100px 60px",
  };

  const element: React.ReactElement = (
    <div style={style}>
      {/* ✅ Edge-safe image via backgroundImage */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: 140,
          height: 140,
          borderRadius: 20,
          backgroundImage: `url(${logo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div style={{ maxWidth: "90%", marginTop: 80 }}>{title}</div>

      {footerText && (
        <p
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 36,
            fontWeight: 500,
            color:
              type === "minimal"
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,0.9)",
          }}
        >
          {footerText}
        </p>
      )}
    </div>
  );

  return new ImageResponse(element, {
    width: 1200,
    height: 630,
  });
}
