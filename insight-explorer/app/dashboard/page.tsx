"use client";

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AnimatedInvestigateButton from "@/components/AnimatedInvestigateButton";

interface CallData {
  id: number;
  sentiment: number;
  createdAt: string;
}

interface Campaign {
  id: number;
  name: string;
  description?: string;
  calls: CallData[];
}

export default function Dashboard() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pathPoints, setPathPoints] = useState<{ x: number; y: number }[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fetch campaign data on mount
  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCampaign(data[0]);
        }
      })
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  // Mouse event handlers for freehand drawing (brush selection)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDrawing(true);
    setPathPoints([]);
    addPoint(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    addPoint(e);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const addPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = overlayRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPathPoints((prev) => [...prev, { x, y }]);
    }
  };

  const handleInvestigate = () => {
    console.log("Investigate clicked with brush path:", pathPoints);
    // Process the selected data based on the freehand brush stroke
  };

  // Generate an SVG path string from the freehand brush points.
  const brushPath =
    pathPoints.length > 0
      ? "M " + pathPoints.map((pt) => `${pt.x} ${pt.y}`).join(" L ")
      : "";

  return (
    <div
      style={{
        padding: "2rem",
        position: "relative",
        background: "#050801",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* Header Section */}
      <div className="header">
        <h1>Campaign Dashboard</h1>
        <button onClick={() => setPathPoints([])} className="clear-button">
          Clear Selection
        </button>
        {campaign ? (
          <>
            <h2>{campaign.name}</h2>
            <p>{campaign.description}</p>
          </>
        ) : (
          <p>Loading campaign data...</p>
        )}
      </div>

      {/* Main Content */}
      {campaign && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            marginTop: "2rem",
          }}
        >
          {/* Graph Container */}
          <div
            style={{
              position: "relative",
              width: "2000px",
              height: "800px",
              border: "1px solid #333",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={campaign.calls}>
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
            {/* Freehand Brush Selection Overlay */}
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
              {brushPath && (
                <svg
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
                  <defs>
                    <mask id="focusMask" maskUnits="userSpaceOnUse">
                      {/* Full white rect */}
                      <rect width="100%" height="100%" fill="white" />
                      {/* Brush stroke area as a black stroke with increased thickness */}
                      <path
                        d={brushPath}
                        stroke="black"
                        strokeWidth="50"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </mask>
                  </defs>
                  {/* Dark overlay that excludes the brushed area */}
                  <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.5)"
                    mask="url(#focusMask)"
                  />
                  {/* Optionally, show the brush stroke outline */}
                  <path
                    d={brushPath}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.49)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Button Container */}
          {brushPath && !isDrawing && (
            <div style={{ padding: "24px" }}>
              <AnimatedInvestigateButton onClick={handleInvestigate} />
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .header {
          text-align: center;
          margin-bottom: 2rem;
          padding: 1rem;
        }
        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        .header h2 {
          font-size: 1.75rem;
          margin: 1rem 0 0.5rem;
          color: #fff;
        }
        .header p {
          font-size: 1.125rem;
          color: #ccc;
          margin: 0.5rem 0;
        }
        .clear-button {
          background: transparent;
          border: 2px solid #888;
          border-radius: 5px;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          color: #fff;
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease;
          margin-bottom: 1rem;
        }
        .clear-button:hover {
          background: #888;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
