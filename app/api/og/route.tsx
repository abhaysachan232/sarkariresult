// /** @jsxImportSource react */
// import * as React from "react";
// import { ImageResponse } from "next/og";

// export const runtime = "edge";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   console.log(req.url);
  
//   const title = searchParams.get("title") || "Default Title";
//   const footer = searchParams.get("footerText") || "";

//   return new ImageResponse(
//     (
//       <div
//         style={{
//           width: "1200px",
//           height: "630px",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           flexDirection: "column",
//           backgroundColor: "#0f2027",
//           color: "#fff",
//           fontSize: 60,
//           fontWeight: 700,
//         }}
//       >
//         <div>{title}</div>
//         {footer && <div style={{ fontSize: 36, marginTop: 20 }}>{footer}</div>}
//       </div>
//     ),
//     {
//       width: 1200,
//       height: 630,
//     }
//   );
// }

/** @jsxImportSource react */
import * as React from "react";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") || "Latest Job Update";
  const footer = searchParams.get("footerText") || "";
  const type = searchParams.get("type") || "full"; // 👈 minimal | full

  // 🔹 MINIMAL DESIGN (fast, clean)
  if (type === "minimal") {
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
            background:
              "linear-gradient(135deg,#2563eb,#4f46e5)",
            color: "#fff",
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          <div>{title}</div>

          {footer && (
            <div
              style={{
                marginTop: 28,
                fontSize: 32,
                opacity: 0.85,
              }}
            >
              {footer}
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control":
            "public, max-age=0, s-maxage=31536000, immutable",
        },
      }
    );
  }

  // 🔹 FULL DESIGN (badge + layout)
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background:
            "linear-gradient(135deg,#2563eb,#6d28d9)",
          color: "#fff",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 120,
          }}
        >
          📋
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              background: "#facc15",
              color: "#000",
              padding: "10px 26px",
              borderRadius: 999,
              fontSize: 26,
              fontWeight: 800,
              width: "fit-content",
            }}
          >
            NEW
          </div>

          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>

          {footer && (
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#fde68a",
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=31536000, immutable",
      },
    }
  );
}
