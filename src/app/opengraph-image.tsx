import { ImageResponse } from "next/og";

import { SITE } from "@/config/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#ffffff",
          color: "#3d3d3d",
          backgroundImage:
            "linear-gradient(to right, #ebebeb 1px, transparent 1px), linear-gradient(to bottom, #ebebeb 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1 }}>{SITE.name}</div>
        <div style={{ marginTop: 24, fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>
          {SITE.tagline}
        </div>
      </div>
    ),
    size,
  );
}
