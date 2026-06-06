import { useState } from "react";

type MapPoint = {
  x: number;
  y: number;
};

export function OfficeMapCoordinateTool() {
  const [point, setPoint] = useState<MapPoint | null>(null);

  const svgWidth = 920;
  const svgHeight = 1280;

  function handleMapClick(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * svgWidth;
    const y = ((event.clientY - rect.top) / rect.height) * svgHeight;

    setPoint({
      x: Math.round(x),
      y: Math.round(y),
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4">
        <h2 className="text-lg font-semibold">Office Map Coordinate Tool</h2>
        <p className="text-sm text-muted-foreground">
          Click any desk, meeting room, or call room to get its SVG coordinate.
        </p>

        {point && (
          <div className="mt-3 rounded-md bg-muted p-3 font-mono text-sm">
            x: {point.x}, y: {point.y}
          </div>
        )}
      </div>

      <div
        className="relative w-full max-w-[920px] overflow-hidden rounded-md border"
        onClick={handleMapClick}
      >
        <img
          src="/office-map.svg"
          alt="Office floor map"
          className="block w-full select-none"
          draggable={false}
        />

        {point && (
          <div
            className="pointer-events-none absolute h-4 w-4 rounded-full bg-red-500"
            style={{
              left: `${(point.x / svgWidth) * 100}%`,
              top: `${(point.y / svgHeight) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>
    </div>
  );
}