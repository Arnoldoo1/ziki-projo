import { ImageResponse } from "next/og";

export const alt = "Ziki — agents ask before they act. Handshake is a consent loop for every agent action.";
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
          justifyContent: "space-between",
          background: "#0b1733",
          color: "#ffffff",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 15,
              background: "#0f766e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            Z
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>Ziki</div>
          <div
            style={{
              marginLeft: 12,
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 999,
              padding: "8px 18px",
              fontSize: 20,
              fontWeight: 600,
              color: "#c9d6ef",
            }}
          >
            Human-led · Agent-assisted
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2.5 }}>
            Agents ask before
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: -2.5,
              color: "#8fc9ff",
            }}
          >
            they act.
          </div>
          <div style={{ fontSize: 30, color: "#c9d6ef", lineHeight: 1.35, maxWidth: 880 }}>
            Handshake turns every agent escalation into a typed decision: evidence, blast radius, an
            expiry, and a receipt.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 21, color: "#8fa3c4" }}>
          <span>Typed asks</span>
          <span style={{ color: "#3d557f" }}>·</span>
          <span>Evidence attached</span>
          <span style={{ color: "#3d557f" }}>·</span>
          <span>10-second undo</span>
          <span style={{ color: "#3d557f" }}>·</span>
          <span>Decision receipts</span>
        </div>
      </div>
    ),
    { ...size },
  );
}