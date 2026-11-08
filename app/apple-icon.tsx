import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #cca45b 0%, #b38a44 100%)",
          color: "#07160f",
          fontSize: 96,
          fontWeight: 900,
          letterSpacing: "0.02em",
          borderRadius: 36,
        }}
      >
        SH
      </div>
    ),
    { ...size }
  );
}
