import { createFileRoute } from "@tanstack/react-router";
import { WeatherView } from "@/features/wira/components/views/WeatherView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Weather — Client OS" },
      { name: "description", content: "Check the weather." },
    ],
  }),
  component: WeatherViewPage,
});

function WeatherViewPage() {
  return (
    <AppShell title="Weather" subtitle="Check the weather.">
      <div className="w-full">
        <WeatherView />
      </div>
    </AppShell>
  );
}
