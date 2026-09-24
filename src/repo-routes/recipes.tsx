import { createFileRoute } from "@tanstack/react-router";
import { RecipesView } from "@/features/wira/components/views/RecipesView";
import { AppShell } from "@/app/app-shell";

export const Route = createFileRoute("/recipes")({
  head: () => ({
    meta: [
      { title: "Recipes & Executive Nutrition — All in One" },
      { name: "description", content: "Kurasi resep nutrisi performa tinggi, fine dining hosting klien, dan manajemen bahan makanan." },
    ],
  }),
  component: RecipesViewPage,
});

function RecipesViewPage() {
  return (
    <AppShell title="Recipes & Executive Nutrition" subtitle="Kurasi nutrisi penunjang performa kognitif, jamuan klien, dan meal-prep efisien">
      <div className="w-full">
        <RecipesView />
      </div>
    </AppShell>
  );
}
