import { useState } from "react";
import { Item, QuadrantId } from "../matriks/types";
import { Quadrant } from "../matriks/components/Quadrant";

const framework = {
  id: "financial_health",
  name: "Financial Health & Resilience",
  description:
    "Memetakan kesehatan finansial berdasarkan surplus/defisit dan ketahanan (Sumbu X: Defisit vs Surplus, Sumbu Y: Resilient vs Vulnerable).",
  quadrants: {
    tl: {
      id: "tl",
      title: "Resilient & Defisit",
      subtitle: "Punya Safety Net, Arus Kas Negatif",
      theme: "amber",
    },
    tr: {
      id: "tr",
      title: "Resilient & Surplus",
      subtitle: "Punya Safety Net, Arus Kas Positif",
      theme: "emerald",
    },
    bl: {
      id: "bl",
      title: "Vulnerable & Defisit",
      subtitle: "Tanpa Safety Net, Arus Kas Negatif",
      theme: "rose",
    },
    br: {
      id: "br",
      title: "Vulnerable & Surplus",
      subtitle: "Tanpa Safety Net, Arus Kas Positif",
      theme: "blue",
    },
  },
};

export function FinancialHealthMatrix() {
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
