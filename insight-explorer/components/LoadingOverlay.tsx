// components/LoadingOverlay.tsx
import dynamic from "next/dynamic";

// Dynamically import the LoadingAnimation component
const LoadingAnimation = dynamic(() => import("@/components/LoadingAnimation"), {
  ssr: false,
});

export default function LoadingOverlay() {
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
      <LoadingAnimation />
    </div>
  );
}
