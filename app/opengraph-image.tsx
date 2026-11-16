import { ImageResponse } from "next/og";

export const alt = "Car Loan Calculator: flat-rate estimate for Singapore";
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
          background: "#000",
          color: "#fff",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8 }}>CAR LOAN CALCULATOR</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, letterSpacing: 6, color: "#bdbdbd" }}>LOAN PAYABLE PER MONTH</div>
          <div style={{ fontSize: 120, fontWeight: 300, marginTop: 12 }}>S$1,890.00</div>
          <div style={{ width: "100%", height: 1, background: "#444", marginTop: 40 }} />
          <div style={{ fontSize: 28, color: "#bdbdbd", marginTop: 28 }}>
            Flat-rate estimate · Singapore · Free and private, runs in your browser
          </div>
        </div>
      </div>
    ),
    size,
  );
}
