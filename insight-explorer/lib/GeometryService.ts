// geometryUtils.ts

// A simple point with x and y coordinates
export interface Point {
  x: number;
  y: number;
}

// Makes sure the polygon's shape is "closed" by checking if the last point is the same as the first.
// If not, it adds the first point at the end.
export function closePolygon(points: Point[]): Point[] {
  if (points.length === 0) return points;
  const first = points[0];
  const last = points[points.length - 1];
  if (first.x !== last.x || first.y !== last.y) {
    return [...points, first];
  }
  return points;
}

// Uses the ray-casting method to see if a point sits inside the given polygon.
// Basically, we count how many times a line extending from the point crosses the polygon.
export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      (yi > point.y) !== (yj > point.y) &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + 0.000001) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

// Checks if point q sits on the line segment defined by points p and r.
export function isOnSegment(p: Point, q: Point, r: Point): boolean {
  return (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  );
}

// Figure out the "turn" direction of the triplet (p, q, r). This helps us determine orientation.
// Returns 0 if they're basically in a line, 1 if it's a clockwise turn, or 2 for counterclockwise.
export function orientation(p: Point, q: Point, r: Point): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (Math.abs(val) < 0.000001) return 0; // pretty much collinear
  return val > 0 ? 1 : 2;
}

// Checks if two line segments (p1q1 and p2q2) cross each other.
// It handles both the regular and special cases (like collinear points).
export function doLineSegmentsIntersect(
  p1: Point,
  q1: Point,
  p2: Point,
  q2: Point
): boolean {
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  // Simple case: If orientations are different, they intersect.
  if (o1 !== o2 && o3 !== o4) return true;

  // Check special cases where points are collinear.
  if (o1 === 0 && isOnSegment(p1, p2, q1)) return true;
  if (o2 === 0 && isOnSegment(p1, q2, q1)) return true;
  if (o3 === 0 && isOnSegment(p2, p1, q2)) return true;
  if (o4 === 0 && isOnSegment(p2, q1, q2)) return true;

  return false;
}

// Checks if a line segment from point a to b crosses any edge of our polygon.
// Loops through each consecutive pair of points in the polygon and uses the above function.
export function segmentIntersectsPolygon(a: Point, b: Point, polygon: Point[]): boolean {
  for (let i = 0; i < polygon.length - 1; i++) {
    const p = polygon[i];
    const q = polygon[i + 1];
    if (doLineSegmentsIntersect(a, b, p, q)) {
      return true;
    }
  }
  return false;
}
