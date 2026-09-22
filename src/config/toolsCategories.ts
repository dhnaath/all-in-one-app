import {
  Milestone,
  Compass,
  TrendingUp,
  Settings,
  Landmark,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface Level1Category {
  id: string;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  description: string;
  subCategories: string[];
}

export const TOOLS_100_LEVEL1: Level1Category[] = [
  {
    id: "pilar-tahapan",
    title: "Pilar & Tahapan Konsultasi",
    shortTitle: "Pilar & Tahapan",
    icon: Milestone,
    description: "Framework 5 pilar & tahapan konsultasi bisnis (Surety, Flow, Build, Grow, Legacy)",
    subCategories: ["Tahapan"],
  },
  {
    id: "strategi-bisnis",
    title: "Strategi & Model Bisnis",
    shortTitle: "Strategi & Model",
    icon: Compass,
    description: "Analisis strategis korporat, model kanvas, inovasi, dan future tech",
    subCategories: [
      "Strategic Management",
      "Business Model & Value Proposition",
      "Innovation, Entrepreneurship & Design",
      "Deep Tech, Innovation & Future Studies",
    ],
  },
  {
    id: "pemasaran-komersial",
    title: "Pemasaran & Penjualan",
    shortTitle: "Pemasaran & Sales",
    icon: TrendingUp,
    description: "Customer journey, strategi penetapan harga, revenue ops, dan krisis PR",
    subCategories: [
      "Marketing & Customer Management",
      "Sales, Pricing & Revenue Operations",
      "Public Relations, Crisis & Stakeholder Management",
    ],
  },
  {
    id: "operasi-kualitas",
    title: "Operasional & Kinerja",
    shortTitle: "Operasi & Produk",
    icon: Settings,
    description: "Efisiensi proses bisnis, Six Sigma, OKR, dan agile product management",
    subCategories: [
      "Operations & Performance Management",
      "Quality Management & Continuous Improvement",
      "Product Management & Agile/Scrum",
    ],
  },
  {
    id: "keuangan-ekonomi",
    title: "Keuangan & Kuantitatif",
    shortTitle: "Keuangan & Feasibility",
    icon: Landmark,
    description: "Kelayakan investasi bisnis, capital budgeting, rasio finansial, dan ekonomi",
    subCategories: [
      "Financial Management & Business Feasibility",
      "Economics & Quantitative Analysis",
    ],
  },
  {
    id: "organisasi-kebijakan",
    title: "Organisasi, SDM & Tata Kelola",
    shortTitle: "SDM & Tata Kelola",
    icon: Users,
    description: "Kepemimpinan, manajemen perubahan, analisis keputusan, ESG, dan kebijakan",
    subCategories: [
      "Leadership, Talent & Culture Management",
      "Change Management & Organizational Development",
      "Decision Making & Analytical Thinking",
      "Sustainability, ESG & Risk Management",
      "Public Policy & Program Management",
    ],
  },
];
