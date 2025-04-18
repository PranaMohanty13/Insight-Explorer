"use client";

import { MutableRefObject } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ChartWithOverlayProps {
  campaignCalls: any[]; // Array of data to be used in the chart
  overlayRef: MutableRefObject<HTMLDivElement | null>; // Ref to the overlay div for freehand drawing
  brushPath: string; // SVG path string representing the freehand drawing
  closedBrushPath: string; // SVG path string where the brush path is "closed" (first point linked to last)
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
  handleMouseUp: () => void;
}

// The ChartWithOverlay component renders the chart with an interactive freehand overlay.
// It displays the campaign call data along with the freehand selection drawn over it.
export default function ChartWithOverlay({
  campaignCalls,
  overlayRef,
  brushPath,
  closedBrushPath,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
}: ChartWithOverlayProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "1600px",
        height: "800px",
        border: "1px solid #333",
      }}
    >
      {/* Render the responsive chart using Recharts */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={campaignCalls}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis domain={[-1, 1]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sentiment"
            stroke="rgb(214, 58, 149)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Overlay container for freehand drawing */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          cursor: "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Render the SVG brush if a path exists  */}
        {brushPath && (
          <svg
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <defs>
              {/* Use a mask to create a spotlight effect */}
              <mask id="spotlightMask">
                <rect width="100%" height="100%" fill="white" />
                <path d={closedBrushPath} fill="black" />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.67)"
              mask="url(#spotlightMask)"
            />
            <path
              d={brushPath}
              fill="none"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
