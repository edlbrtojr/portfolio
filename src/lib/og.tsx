import { ImageResponse } from "next/og";
import { content } from "@/content";
import type { Locale } from "@/content/types";

export const ogSize = { width: 1200, height: 630 };

// Prévia de link (LinkedIn, WhatsApp): nome grande, papel e os três números
// que mais pesam. Pontos em grade evocam as partículas da home sem WebGL.
export function ogImage(locale: Locale) {
  const c = content[locale];
  const dots = Array.from({ length: 140 }, (_, i) => i);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a0b0a", color: "#edebe6", padding: 72, position: "relative" }}>
        <div style={{ position: "absolute", right: 60, top: 60, width: 420, height: 420, display: "flex", flexWrap: "wrap", gap: 22, opacity: 0.9 }}>
          {dots.map((i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: 8, background: i % 7 === 0 ? "#e9b949" : i % 5 === 0 ? "#c8834a" : "#b8c4cc", opacity: 0.25 + ((i * 37) % 60) / 100 }} />
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a3a29b", letterSpacing: 4, textTransform: "uppercase" }}>{c.hero.eyebrow}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>Edilberto Lima Jr.</div>
          <div style={{ fontSize: 44, marginTop: 18, color: "#e9b949" }}>{c.hero.role}</div>
        </div>
        <div style={{ display: "flex", gap: 56 }}>
          {c.path.metrics.slice(0, 3).map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column", borderTop: "2px solid rgba(237,235,230,0.18)", paddingTop: 14, width: 300 }}>
              <div style={{ fontSize: 52, fontWeight: 700 }}>{m.value}</div>
              <div style={{ fontSize: 22, color: "#a3a29b" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}
