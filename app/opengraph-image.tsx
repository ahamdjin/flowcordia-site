import { ImageResponse } from "next/og";

export const alt = "Flowcordia — Build visually. Govern as code.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f7f7f5",
        color: "#111214",
        padding: "70px 78px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 27, fontWeight: 600 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: "#111214", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>F</div>
        <span>Flowcordia</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 0.96, letterSpacing: "-5px", fontWeight: 500 }}>
          <span>Build visually.</span>
          <span>Govern as code.</span>
        </div>
        <span style={{ maxWidth: 850, color: "#66686e", fontSize: 28, lineHeight: 1.4 }}>Canvas, typed code, Git review, preview deployment, and runtime execution connected to one workflow identity.</span>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {['Canvas', 'Source', 'Review', 'Run'].map((item, index) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 9, border: "1px solid #deded9", borderRadius: 999, padding: "11px 17px", fontSize: 18, color: "#5a5c61" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: index === 0 ? '#7567e8' : '#b7b7b1' }} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>,
    size
  );
}
