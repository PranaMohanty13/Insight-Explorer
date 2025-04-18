import { useState, useRef } from "react";

// Define what a point looks like – just an object with x and y coordinates.
interface Point {
  x: number;
  y: number;
}

// This hook handles freehand drawing logic.
export default function useFreehandDraw() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  // When mouse is pressed, start drawing and reset the path.
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    setIsDrawing(true);
    setPathPoints([]);
    addPoint(e);
  }

  // Only add points if we're in the middle of a draw.
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isDrawing) return;
    addPoint(e);
  }

  // When the mouse is released, stop the drawing action.
  function handleMouseUp() {
    setIsDrawing(false);
  }

  // Helper that figures out the mouse position relative to the overlay
  // and adds it to our points array.
  function addPoint(e: React.MouseEvent<HTMLDivElement>) {
    const rect = overlayRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPathPoints((prev) => [...prev, { x, y }]);
    }
  }

  // Return all the state and handlers so other components can use them.
  return {
    isDrawing,
    pathPoints,
    overlayRef,
    setPathPoints,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
