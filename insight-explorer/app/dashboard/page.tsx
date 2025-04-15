"use client";

import { useState, useEffect } from "react";
import { generatePrompt, CallData } from "@/lib/GeneratePromptService";
import AnimatedInvestigateButton from "@/components/AnimatedInvestigateButton";
import ReportPopup from "@/components/ReportPopup";
import {
  isPointInPolygon,
  segmentIntersectsPolygon,
  closePolygon,
} from "@/lib/GeometryService";
import useFreehandDraw from "@/components/FreehandDrawHook";
import LoadingOverlay from "@/components/LoadingOverlay";
import ChartWithOverlay from "@/components/ChartWithOverlay";

interface Campaign {
  id: number;
  name: string;
  description?: string;
  calls: CallData[];
}

// Turns a list of points into SVG-friendly path strings
function getBrushPaths(points: { x: number; y: number }[]) {
  if (!points.length) return { brushPath: "", closedBrushPath: "" };
  const brushPath = "M " + points.map((pt) => `${pt.x} ${pt.y}`).join(" L ");
  return { brushPath, closedBrushPath: brushPath + " Z" };
}

export default function Dashboard() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Drawing state and handlers come from this custom hook
  const {
    isDrawing,
    pathPoints,
    overlayRef,
    setPathPoints,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useFreehandDraw();

  // Load campaign data when the page first mounts
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

  // What happens when the "Investigate" button is clicked
  const handleInvestigate = async () => {
    console.log("Investigate clicked with freehand path:", pathPoints);

    if (!campaign || pathPoints.length < 3 || !overlayRef.current) {
      console.warn("Not enough points or no campaign data.");
      return;
    }

    setIsLoading(true);

    const { width: chartWidth, height: chartHeight } =
      overlayRef.current.getBoundingClientRect();

    const polygon = closePolygon([...pathPoints]);

    const ids = campaign.calls.map((call) => call.id);
    const minId = Math.min(...ids);
    const maxId = Math.max(...ids);

    const selectedCallsMap: { [id: number]: CallData } = {};


    // Convert each call to a pixel coordinate
    const mappedCalls = campaign.calls.map((call) => {
      const x = ((call.id - minId) / (maxId - minId)) * chartWidth;
      const y = (1 - (call.sentiment + 1) / 2) * chartHeight;
      return { call, point: { x, y } };
    });


    // Check which calls are inside the drawn polygon
    for (const { call, point } of mappedCalls) {
      if (isPointInPolygon(point, polygon)) {
        selectedCallsMap[call.id] = call;
      }
    }


    // Also include any call segments that intersect the polygon
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

    // Send selected data to the DeepSeek API for analysis
    const prompt = generatePrompt(selectedCalls);

    console.log("Generated prompt:", prompt);
    try {
      const response = await fetch("/api/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  
  // If the user is drawing, we need to update the brush path
  const { brushPath, closedBrushPath } = getBrushPaths(pathPoints);


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
      {/* Content gets blurred when loading */}
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
            {/* The chart and the brush layer go here */}
            <ChartWithOverlay
              campaignCalls={campaign.calls}
              overlayRef={overlayRef}
              brushPath={brushPath}
              closedBrushPath={closedBrushPath}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
            />

            {/* Button shows up only after drawing is done */}
            <div style={{ padding: "24px" }}>
              {!isLoading && brushPath && !isDrawing && (
                <AnimatedInvestigateButton onClick={handleInvestigate} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen loading overlay */}
      {isLoading && <LoadingOverlay />}

      {/* Popup for showing the generated report */}
      {report && <ReportPopup report={report} onClose={() => setReport(null)} />}

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
