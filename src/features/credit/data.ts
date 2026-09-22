import { CreditData } from "./types";

export const dummyCreditData: CreditData[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `empty-${Date.now()}-${i}`,
  issuer: "",
  name: "",
  creditLimit: null,
  minimum: null,
  outstanding: null,
  installment: null,
  usageGap: null,
  margin: null,
  usageRatio: 0,
  dueDateConfig: {
    mode: "monthly_fixed",
    startDate: new Date().toISOString().split("T")[0],
    dayOfMonth: 25,
  },
  penaltyConfig: { enabled: false, rate: 0, period: "monthly" },
}));
