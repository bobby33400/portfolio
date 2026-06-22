import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// "QA" monogram favicon on the amber brand color.
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
          background: "#D97706",
          color: "#ffffff",
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: -1.5,
          borderRadius: 14,
        }}
      >
        QA
      </div>
    ),
    size,
  );
}
