import { useState } from "react";
import { Item, QuadrantId } from "../matriks/types";
import { Quadrant } from "../matriks/components/Quadrant";

const framework = {
  id: "swot",
  name: "SWOT Analysis",
  description:
    "Strategic planning technique used to help identify strengths, weaknesses, opportunities, and threats.",
  quadrants: {
    tl: { id: "tl", title: "Strengths", subtitle: "Helpful & Internal", theme: "emerald" },
    tr: { id: "tr", title: "Weaknesses", subtitle: "Harmful & Internal", theme: "rose" },
    bl: { id: "bl", title: "Opportunities", subtitle: "Helpful & External", theme: "blue" },
    br: { id: "br", title: "Threats", subtitle: "Harmful & External", theme: "amber" },
  },
};

export function SWOTMatrix() {
  const [items, setItems] = useState<Record<QuadrantId, Item[]>>({
    tl: [],
    tr: [],
    bl: [],
    br: [],
  });

  const handleAddItem = (quadrantId: QuadrantId, text: string) => {
    const newItem: Item = { id: crypto.randomUUID(), text };
    setItems((prev) => ({
      ...prev,
      [quadrantId]: [...prev[quadrantId], newItem],
    }));
  };

  const handleRemoveItem = (quadrantId: QuadrantId, itemId: string) => {
    setItems((prev) => ({
      ...prev,
      [quadrantId]: prev[quadrantId].filter((i) => i.id !== itemId),
    }));
  };

  return (
    <div className="flex flex-col font-sans pt-6">
      <main className="flex-1 w-full flex flex-col min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
              {framework.name}
            </h2>
            <p className="text-sm font-medium text-muted-foreground">{framework.description}</p>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr min-h-[600px] mb-8">
          <Quadrant
            data={framework.quadrants.tl as any}
            items={items.tl}
            onAddItem={(text) => handleAddItem("tl", text)}
            onRemoveItem={(id) => handleRemoveItem("tl", id)}
          />
          <Quadrant
            data={framework.quadrants.tr as any}
            items={items.tr}
            onAddItem={(text) => handleAddItem("tr", text)}
            onRemoveItem={(id) => handleRemoveItem("tr", id)}
          />
          <Quadrant
            data={framework.quadrants.bl as any}
            items={items.bl}
            onAddItem={(text) => handleAddItem("bl", text)}
            onRemoveItem={(id) => handleRemoveItem("bl", id)}
          />
          <Quadrant
            data={framework.quadrants.br as any}
            items={items.br}
            onAddItem={(text) => handleAddItem("br", text)}
            onRemoveItem={(id) => handleRemoveItem("br", id)}
          />
        </div>
      </main>
    </div>
  );
}
