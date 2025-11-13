/** @jsxImportSource react */
import * as React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  console.log(req.url);
  
  const title = searchParams.get("title") || "Default Title";
  const footer = searchParams.get("footerText") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#0f2027",
          color: "#fff",
          fontSize: 60,
          fontWeight: 700,
        }}
      >
        <div>{title}</div>
        {footer && <div style={{ fontSize: 36, marginTop: 20 }}>{footer}</div>}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
