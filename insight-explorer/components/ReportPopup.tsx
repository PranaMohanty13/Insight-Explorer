import React, { useEffect, useState } from "react";

interface ReportPopupProps {
  report: string;
  onClose: () => void;
}

const ReportPopup: React.FC<ReportPopupProps> = ({ report, onClose }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + report[index]);
      index++;
      if (index === report.length) clearInterval(interval);
    }, 50); // Adjust typing speed here (50ms per character)
    return () => clearInterval(interval);
  }, [report]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#222",
          padding: "2rem",
          borderRadius: "8px",
          width: "80%",
          maxWidth: "600px",
          color: "#fff",
          textAlign: "center",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          X
        </button>
        <h3>DeepSeek Report</h3>
        <p>{displayedText}</p>
      </div>
    </div>
  );
};

export default ReportPopup;
