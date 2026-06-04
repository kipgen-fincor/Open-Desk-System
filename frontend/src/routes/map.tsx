import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { OfficeMapCoordinateTool } from "@/components/office-map-coordinate-tool";

export const Route = createFileRoute("/map")({
  component: MapRoute,
});

function MapRoute() {
  return (
    <AppShell>
      <OfficeMapCoordinateTool />
    </AppShell>
  );
}
