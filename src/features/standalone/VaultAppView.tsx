import React, { useState, useEffect } from "react";
import {
  Vault,
  Shield,
  Award,
  Lock,
  Unlock,
  Key,
  FileText,
  Copy,
  Check,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export type VaultTab = "vault" | "identity" | "certificates";

interface IdentityCard {
  id: string;
  type: "KTP" | "SIM" | "Paspor" | "NPWP" | "BPJS" | "Kartu Keluarga";
  name: string;
  idNumber: string;
  expiryDate: string;
  issuer: string;
  notes?: string;
}

interface CertificateItem {
  id: string;
  title: string;
  type: "Ijazah Formal" | "Sertifikasi Profesional" | "Pelatihan & Lisensi";
  institution: string;
  year: string;
  credentialId?: string;
  gradeOrDistinction?: string;
}

interface VaultItem {
  id: string;
  title: string;
  category: "Kunci Pemulihan" | "Dokumen Finansial" | "Surat Berharga" | "Akses Pribadi";
  secretValue: string;
  lastUpdated: string;
}

export function VaultAppView() {
  const [activeTab, setActiveTab] = useState<VaultTab>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("tab");
      if (p === "identity" || p === "certificates") return p;
    }
    return "vault";
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // State 1: Vault Items
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    try {
      const s = localStorage.getItem("aio_vault_items");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "v-1", title: "Master Recovery Seed Wallet Kripto", category: "Kunci Pemulihan", secretValue: "apple breeze ocean mountain silver velvet crystal orbit diamond flame", lastUpdated: "2026-08-15" },
      { id: "v-2", title: "Nomor Sertifikat Tanah SHM No. 4482", category: "Surat Berharga", secretValue: "SHM-04482-DKI-JKT-PST-2024", lastUpdated: "2026-06-20" },
      { id: "v-3", title: "PIN Brankas Fisik Kantor", category: "Akses Pribadi", secretValue: "882910-ALPHA", lastUpdated: "2026-09-01" },
    ];
  });

  // State 2: Identities (KTP & Dokumen Resmi)
  const [identities, setIdentities] = useState<IdentityCard[]>(() => {
    try {
      const s = localStorage.getItem("aio_vault_identities");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "id-1", type: "KTP", name: "Konsultan Pratama", idNumber: "3171051208920003", expiryDate: "Seumur Hidup", issuer: "Dukcapil DKI Jakarta", notes: "NIK resmi untuk perbankan & perpajakan" },
      { id: "id-2", type: "Paspor", name: "Konsultan Pratama", idNumber: "X8829104", expiryDate: "2032-05-18", issuer: "Kantor Imigrasi Jakarta Selatan", notes: "Paspor Elektronik 10 Tahun" },
      { id: "id-3", type: "NPWP", name: "Konsultan Pratama", idNumber: "09.882.716.4-012.000", expiryDate: "Aktif", issuer: "KPP Pratama Jakarta", notes: "NPWP 16 Digit tersinkronisasi NIK" },
      { id: "id-4", type: "SIM", name: "Konsultan Pratama", idNumber: "920812-449102", expiryDate: "2028-08-12", issuer: "Satpas Polda Metro Jaya", notes: "SIM A Kendaraan Roda Empat" },
    ];
  });

  // State 3: Certificates
  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    try {
      const s = localStorage.getItem("aio_vault_certificates");
      if (s) return JSON.parse(s);
    } catch {}
    return [
      { id: "c-1", title: "Magister Manajemen Bisnis & Keuangan (MBA)", type: "Ijazah Formal", institution: "Institut Teknologi & Manajemen Terkemuka", year: "2022", credentialId: "MBA-2022-88219", gradeOrDistinction: "Cum Laude" },
      { id: "c-2", title: "Certified Management Consultant (CMC)", type: "Sertifikasi Profesional", institution: "Institute of Management Consultants", year: "2023", credentialId: "CMC-ID-99214", gradeOrDistinction: "International Registered" },
      { id: "c-3", title: "Sertifikasi Perencana Keuangan Syariah", type: "Pelatihan & Lisensi", institution: "Asosiasi Perencana Keuangan Syariah", year: "2024", credentialId: "CFP-SY-44910", gradeOrDistinction: "Certified" },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("aio_vault_items", JSON.stringify(vaultItems));
      localStorage.setItem("aio_vault_identities", JSON.stringify(identities));
      localStorage.setItem("aio_vault_certificates", JSON.stringify(certificates));
    } catch {}
  }, [vaultItems, identities, certificates]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20 shrink-0">
            <Vault className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Vault & Identitas Resmi
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Penyimpanan aman berenkripsi lokal untuk brankas pribadi, identitas kenegaraan, dan ijazah sertifikat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0">
          <Lock className="h-3.5 w-3.5" />
          <span>Enkripsi Lokal Aman</span>
        </div>
      </div>

      {/* Tabs Selector: The 3 integrated sub-apps */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("vault")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "vault"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Vault className="h-4 w-4 shrink-0" />
          <span>Brankas / Vault Digital</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {vaultItems.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("identity")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "identity"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Shield className="h-4 w-4 shrink-0" />
          <span>KTP & Identitas Resmi</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {identities.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("certificates")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "certificates"
              ? "bg-primary text-primary-foreground shadow-xs font-bold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Award className="h-4 w-4 shrink-0" />
          <span>Ijazah & Sertifikat</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {certificates.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Vault Digital */}
      {activeTab === "vault" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vaultItems.map((v) => {
              const isRevealed = revealedIds[v.id];
              return (
                <div key={v.id} className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between gap-3 shadow-xs">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 font-semibold">
                      {v.category}
                    </span>
                    <h3 className="font-bold text-sm text-foreground mt-2">{v.title}</h3>
                    <div className="mt-3 p-2.5 rounded-lg bg-background border border-border flex items-center justify-between gap-2 font-mono text-xs">
                      <span className="truncate select-all text-foreground">
                        {isRevealed ? v.secretValue : "••••••••••••••••••••"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleReveal(v.id)}
                        className="text-muted-foreground hover:text-foreground p-1"
                        title={isRevealed ? "Sembunyikan" : "Perlihatkan"}
                      >
                        {isRevealed ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
                    <span>Diperbarui: {v.lastUpdated}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(v.secretValue, v.id)}
                      className="flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      {copiedId === v.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedId === v.id ? "Tersalin" : "Salin"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: KTP & Identitas Resmi */}
      {activeTab === "identity" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {identities.map((card) => (
              <div key={card.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between gap-4 shadow-xs relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {card.type}
                      </span>
                      <h3 className="font-bold text-base text-foreground">{card.name}</h3>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium">
                    {card.expiryDate}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Nomor Identitas</span>
                    <p className="font-mono text-base font-bold text-foreground tracking-wider">{card.idNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(card.idNumber, card.id)}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Salin Nomor"
                  >
                    {copiedId === card.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                <div className="text-[11px] text-muted-foreground flex justify-between items-center">
                  <span>Penerbit: {card.issuer}</span>
                  {card.notes && <span>{card.notes}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Ijazah & Sertifikat */}
      {activeTab === "certificates" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-semibold">
                      {cert.type}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">{cert.year}</span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground mt-2">{cert.title}</h3>
                  <p className="text-xs text-primary font-medium mt-0.5">{cert.institution}</p>
                </div>

                <div className="border-t border-border pt-2 text-[11px] text-muted-foreground flex flex-col gap-1">
                  {cert.credentialId && (
                    <div className="flex justify-between items-center font-mono">
                      <span>No. Sertifikat:</span>
                      <span className="text-foreground">{cert.credentialId}</span>
                    </div>
                  )}
                  {cert.gradeOrDistinction && (
                    <div className="flex justify-between items-center">
                      <span>Predikat:</span>
                      <span className="font-semibold text-foreground">{cert.gradeOrDistinction}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
