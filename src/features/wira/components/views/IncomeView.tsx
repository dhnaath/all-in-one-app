import { Plus, Banknote } from "lucide-react";

export function IncomeView() {
  return (
    <div className="w-full flex flex-col mb-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Invoices & Income</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-primary transition-colors shadow-sm">
          <Plus size={16} className="mr-2" /> Create Invoice
        </button>
      </div>

      <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-muted/50">
        <Banknote size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-card-foreground">No invoices yet</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center">
          Create professional invoices and get paid faster.
        </p>
      </div>
    </div>
  );
}
