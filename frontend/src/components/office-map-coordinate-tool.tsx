import { useState, type MouseEvent } from "react";
import { Card } from "@/components/ui/card";

const SVG_WIDTH = 920;
const SVG_HEIGHT = 1280;

type Coordinate = {
  x: number;
  y: number;
};

export function OfficeMapCoordinateTool() {
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);

  const handleMapClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * SVG_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * SVG_HEIGHT;

    setCoordinate({
      x: Math.round(x),
      y: Math.round(y),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Office Map Coordinate Tool</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Click the map to capture temporary 920 x 1280 SVG coordinates.
        </p>
      </div>

      <Card className="p-4">
        <div className="mb-3 text-sm">
          Latest coordinate:{" "}
          {coordinate ? (
            <span className="font-mono">
              x: {coordinate.x}, y: {coordinate.y}
            </span>
          ) : (
            <span className="text-muted-foreground">none</span>
          )}
        </div>

        <div className="overflow-auto rounded-md border bg-muted/20">
          <div
            className="relative mx-auto min-w-[720px] cursor-crosshair"
            style={{ width: "100%", maxWidth: SVG_WIDTH }}
            onClick={handleMapClick}
          >
            <img
              src="/office-map.svg"
              alt="Office map coordinate reference"
              className="block h-auto w-full select-none"
              draggable={false}
            />
            {coordinate && (
              <div
                className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-red-600 shadow"
                style={{
                  left: `${(coordinate.x / SVG_WIDTH) * 100}%`,
                  top: `${(coordinate.y / SVG_HEIGHT) * 100}%`,
                }}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
