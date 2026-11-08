import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: "0.02em",
          borderRadius: 6,
        }}
      >
        SH
      </div>
    ),
    { ...size }
  );
}
