export type SocialLinks = {
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
};

export type Contact = {
  id: string;
  name: string;
  category: string;
  labels: string[];
  email: string;
  website?: string;
  phone: string;
  company: string;
  socialLinks?: SocialLinks;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  dueDate: string;
  contactId?: string; // Relation to Contact
  createdAt: string;
};

export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  mileage?: number;
  createdAt: string;
};

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type Invoice = {
  id: string;
  contactId: string; // Relation to Contact
  amount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  createdAt: string;
};

export type InvoiceItem = {
  id: string;
  invoiceId: string; // Relation to Invoice
  description: string;
  quantity: number;
  price: number;
};

// Application State
export type AppState = {
  contacts: Contact[];
  tasks: Task[];
  expenses: Expense[];
  invoices: Invoice[];
};
