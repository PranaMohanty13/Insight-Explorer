"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
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
import ReportPopup from "@/components/ReportPopup";

// Dynamically import LoadingAnimation with SSR disabled.
const LoadingAnimation = dynamic(
  () => import("@/components/loading-animation"),
  { ssr: false }
);

interface CallData {
  id: number;
  transcript: string;
  sentiment: number;
  timeOfDay: string;
  outcome: string;
  callerLocation: string;
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
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fetch campaign data on mount.
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

  // Freehand drawing event handlers.
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

  // Ray-casting algorithm for point-in-polygon.
  const isPointInPolygon = (
    point: { x: number; y: number },
    polygon: { x: number; y: number }[]
  ): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;
      const intersect =
        (yi > point.y) !== (yj > point.y) &&
        point.x <
          ((xj - xi) * (point.y - yi)) / (yj - yi + 0.000001) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Helpers for line segment intersection.
  const isOnSegment = (
    p: { x: number; y: number },
    q: { x: number; y: number },
    r: { x: number; y: number }
  ): boolean => {
    return (
      q.x <= Math.max(p.x, r.x) &&
      q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) &&
      q.y >= Math.min(p.y, r.y)
    );
  };

  const orientation = (
    p: { x: number; y: number },
    q: { x: number; y: number },
    r: { x: number; y: number }
  ): number => {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (Math.abs(val) < 0.000001) return 0;
    return val > 0 ? 1 : 2;
  };

  const doLineSegmentsIntersect = (
    p1: { x: number; y: number },
    q1: { x: number; y: number },
    p2: { x: number; y: number },
    q2: { x: number; y: number }
  ): boolean => {
    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);
    if (o1 !== o2 && o3 !== o4) return true;
    if (o1 === 0 && isOnSegment(p1, p2, q1)) return true;
    if (o2 === 0 && isOnSegment(p1, q2, q1)) return true;
    if (o3 === 0 && isOnSegment(p2, p1, q2)) return true;
    if (o4 === 0 && isOnSegment(p2, q1, q2)) return true;
    return false;
  };

  const segmentIntersectsPolygon = (
    a: { x: number; y: number },
    b: { x: number; y: number },
    polygon: { x: number; y: number }[]
  ): boolean => {
    for (let i = 0; i < polygon.length - 1; i++) {
      const p = polygon[i];
      const q = polygon[i + 1];
      if (doLineSegmentsIntersect(a, b, p, q)) {
        return true;
      }
    }
    return false;
  };

  // Construct a prompt from the selected call data.
  const generatePrompt = (calls: CallData[]): string => {
    return `Please analyze the following call data and provide a comprehensive, conversational report with clear paragraphs and actionable insights. In your analysis, explain in plain language what might be contributing to the observed outcomes.
  
  Call Details:
  ${calls
    .map(
      (c) =>
        `• Call ID ${c.id}:
    Transcript: ${c.transcript}
    Sentiment: ${c.sentiment}
    Time of Day: ${c.timeOfDay}
    Outcome: ${c.outcome}
    Location: ${c.callerLocation}
    Date: ${c.createdAt}
  `
    )
    .join("\n")}
  `;
  };
  
  

  // Combined selection logic and DeepSeek API call.
  const handleInvestigate = async () => {
    console.log("Investigate clicked with freehand path:", pathPoints);
    if (!campaign || pathPoints.length < 3 || !overlayRef.current) {
      console.warn("Not enough points or no campaign data.");
      return;
    }
    setIsLoading(true);
    const { width: chartWidth, height: chartHeight } =
      overlayRef.current.getBoundingClientRect();

    const polygon = [...pathPoints];
    const first = polygon[0];
    const last = polygon[polygon.length - 1];
    if (first.x !== last.x || first.y !== last.y) {
      polygon.push(first);
    }

    const ids = campaign.calls.map((call) => call.id);
    const minId = Math.min(...ids);
    const maxId = Math.max(...ids);

    const selectedCallsMap: { [id: number]: CallData } = {};
    const mappedCalls = campaign.calls.map((call) => {
      const x = ((call.id - minId) / (maxId - minId)) * chartWidth;
      const y = (1 - ((call.sentiment + 1) / 2)) * chartHeight;
      return { call, point: { x, y } };
    });

    // Include calls whose point is inside the polygon.
    for (const { call, point } of mappedCalls) {
      if (isPointInPolygon(point, polygon)) {
        selectedCallsMap[call.id] = call;
      }
    }

    // Include calls if the line segment between adjacent calls intersects the polygon.
    for (let i = 0; i < mappedCalls.length - 1; i++) {
      const a = mappedCalls[i].point;
      const b = mappedCalls[i + 1].point;
      if (segmentIntersectsPolygon(a, b, polygon)) {
        selectedCallsMap[mappedCalls[i].call.id] = mappedCalls[i].call;
        selectedCallsMap[mappedCalls[i + 1].call.id] = mappedCalls[i + 1].call;
      }
    }

    const selectedCalls = Object.values(selectedCallsMap);
    console.log("Selected calls:", selectedCalls);
    console.log("Selected calls count:", selectedCalls.length);

    const prompt = generatePrompt(selectedCalls);
    try {
      const response = await fetch("/api/deepseek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setReport(data.report);
    } catch (error) {
      console.error("Error fetching DeepSeek Insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const brushPath =
    pathPoints.length > 0
      ? "M " + pathPoints.map((pt) => `${pt.x} ${pt.y}`).join(" L ")
      : "";
  const closedBrushPath = brushPath ? brushPath + " Z" : "";

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
      {/* Blurred Dashboard Content */}

      <div className={isLoading ? "blur-container" : ""}>
        <div className="header">
          <h1>Campaign Dashboard</h1>
          <button
            onClick={() => {
              setPathPoints([]);
              setReport(null);
            }}
            className="clear-button"
          >
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
                <LineChart
                  data={campaign.calls}
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                >
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
              {/* Freehand Brush Overlay */}
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
                      <mask id="spotlightMask">
                        <rect width="100%" height="100%" fill="white" />
                        <path d={closedBrushPath} fill="black" />
                      </mask>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill="rgba(0, 0, 0, 0.5)"
                      mask="url(#spotlightMask)"
                    />
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
            {/* Button or nothing if loading */}
            <div style={{ padding: "24px" }}>
              {!isLoading && brushPath && !isDrawing && (
                <AnimatedInvestigateButton onClick={handleInvestigate} />
              )}
            </div>
          </div>
        )}
      </div>
      {/* Loading Overlay (unblurred) */}
      {isLoading && (
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
      )}
      {/* Report Popup Modal */}
      {report && (
        <ReportPopup report={report} onClose={() => setReport(null)} />
      )}
      <style jsx>{`
        .blur-container {
          filter: blur(8px);
          pointer-events: none;
          transition: filter 0.3s ease;
        }
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
