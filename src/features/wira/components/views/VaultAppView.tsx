import React, { useState, useEffect } from "react";
import {
  Vault,
  Shield,
  Award,
  Key,
  Lock,
  Unlock,
  FileCheck,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  FileText,
  User,
  MapPin,
  Building,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useRouterState } from "@tanstack/react-router";

export type VaultTab = "vault" | "ktp" | "certificates";

interface IdentityItem {
  id: string;
  type: "KTP" | "Paspor" | "SIM A" | "SIM C" | "Kartu Keluarga" | "NPWP" | "Lainnya";
  fullName: string;
  docNumber: string;
  expiryDate: string; // or "Seumur Hidup"
  issuer: string;
  notes?: string;
  photoAttached?: boolean;
}

interface CertificateItem {
  id: string;
  title: string;
  field: string;
  credentialId: string;
  institution: string;
  issueYear: string;
  expiryYear?: string;
  degreeType: "Ijazah Formal" | "Sertifikasi Profesional" | "Lisensi Keahlian" | "Pelatihan";
  verified: boolean;
}

interface KeySecretItem {
  id: string;
  title: string;
  category: "Kunci Fisik" | "PIN Brankas" | "Passphrase Crypto" | "Kode Recovery Akun";
  secretValue: string;
  holder: string;
  notes?: string;
}

const INITIAL_IDENTITIES: IdentityItem[] = [
  {
    id: "id-1",
    type: "KTP",
    fullName: "Bambang Wira Pratama, S.T., M.M.",
    docNumber: "3174092004880005",
    expiryDate: "Seumur Hidup",
    issuer: "Disdukcapil DKI Jakarta",
    notes: "Alamat KTP sesuai domisili utama",
    photoAttached: true,
  },
  {
    id: "id-2",
    type: "Paspor",
    fullName: "BAMBANG WIRA PRATAMA",
    docNumber: "X8921029",
    expiryDate: "2031-04-10",
    issuer: "Ditjen Imigrasi Jakarta Selatan",
    notes: "E-Passport 48 Halaman untuk visa kerja & dinas luar negeri",
    photoAttached: true,
  },
  {
    id: "id-3",
    type: "SIM A",
    fullName: "Bambang Wira Pratama",
    docNumber: "9201-1920-0012",
    expiryDate: "2028-04-20",
    issuer: "Satpas SIM Polda Metro Jaya",
    notes: "Kendaraan roda empat pribadi",
    photoAttached: true,
  },
  {
    id: "id-4",
    type: "Kartu Keluarga",
    fullName: "Kepala Keluarga: Bambang Wira Pratama",
    docNumber: "3174091508160002",
    expiryDate: "Seumur Hidup",
    issuer: "Disdukcapil Jakarta Selatan",
    notes: "4 Anggota Keluarga Terdaftar",
    photoAttached: true,
  },
];

const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: "cert-1",
    title: "Magister Manajemen Bisnis & Keuangan Strategis",
    field: "Business Administration & Strategy",
    credentialId: "MM-UI-2021-00921",
    institution: "Universitas Indonesia",
    issueYear: "2021",
    degreeType: "Ijazah Formal",
    verified: true,
  },
  {
    id: "cert-2",
    title: "Certified Management Consultant (CMC)",
    field: "Corporate Advisory & Transformation",
    credentialId: "ICMCI-CMC-IDN-88219",
    institution: "ICMCI (International Council of Management Consulting Institutes)",
    issueYear: "2023",
    expiryYear: "2027",
    degreeType: "Sertifikasi Profesional",
    verified: true,
  },
  {
    id: "cert-3",
    title: "PMP (Project Management Professional)",
    field: "Project & Portfolio Governance",
    credentialId: "PMI-PMP-3910291",
    institution: "Project Management Institute (PMI USA)",
    issueYear: "2022",
    expiryYear: "2028",
    degreeType: "Sertifikasi Profesional",
    verified: true,
  },
  {
    id: "cert-4",
    title: "Sarjana Teknik Industri (S.T.)",
    field: "Industrial Engineering & Operations",
    credentialId: "TI-ITB-2015-410",
    institution: "Institut Teknologi Bandung",
    issueYear: "2015",
    degreeType: "Ijazah Formal",
    verified: true,
  },
];

const INITIAL_KEYS: KeySecretItem[] = [
  {
    id: "key-1",
    title: "Kunci Brankas Logam Utama Kamar",
    category: "PIN Brankas",
    secretValue: "88-19-20-44",
    holder: "Pribadi & Pasangan",
    notes: "Diputar searah jarum jam 3 kali, lalu masukkan PIN",
  },
  {
    id: "key-2",
    title: "Passphrase Cold Storage Hardware Wallet",
    category: "Passphrase Crypto",
    secretValue: "12-word seed phrase tersimpan di safe deposit box fisik",
    holder: "Pribadi",
    notes: "Jangan simpan secara digital online",
  },
  {
    id: "key-3",
    title: "Kunci Duplikat Pintu Rumah & Gerbang Utama",
    category: "Kunci Fisik",
    secretValue: "Lokasi: Loker Tersembunyi Garasi Box 3",
    holder: "Keluarga Inti",
    notes: "Untuk situasi darurat bila kunci utama tertinggal",
  },
];

export function VaultAppView() {
  const routerState = useRouterState();
  const searchStr = routerState.location.searchStr;

  const [activeTab, setActiveTab] = useState<VaultTab>(() => {
    const param = new URLSearchParams(searchStr || "").get("tab");
    if (param && ["vault", "ktp", "certificates"].includes(param)) {
      return param as VaultTab;
    }
    return "vault";
  });

  useEffect(() => {
    const param = new URLSearchParams(searchStr || "").get("tab");
    if (param && ["vault", "ktp", "certificates"].includes(param) && param !== activeTab) {
      setActiveTab(param as VaultTab);
    }
  }, [searchStr]);

  const handleTabChange = (tab: VaultTab) => {
    setActiveTab(tab);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(window.history.state, "", url.toString());
    } catch {}
  };

  // State
  const [identities, setIdentities] = useState<IdentityItem[]>(() => {
    try {
      const s = localStorage.getItem("aio_vault_identities");
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_IDENTITIES;
  });

  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    try {
      const s = localStorage.getItem("aio_vault_certificates");
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_CERTIFICATES;
  });

  const [keys, setKeys] = useState<KeySecretItem[]>(() => {
    try {
      const s = localStorage.getItem("aio_vault_keys");
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_KEYS;
  });

  const [isUnlocked, setIsUnlocked] = useState(true);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem("aio_vault_identities", JSON.stringify(identities));
    } catch {}
  }, [identities]);

  useEffect(() => {
    try {
      localStorage.setItem("aio_vault_certificates", JSON.stringify(certificates));
    } catch {}
  }, [certificates]);

  useEffect(() => {
    try {
      localStorage.setItem("aio_vault_keys", JSON.stringify(keys));
    } catch {}
  }, [keys]);

  // Modals & forms
  const [isAddIdOpen, setIsAddIdOpen] = useState(false);
  const [idType, setIdType] = useState<IdentityItem["type"]>("KTP");
  const [idName, setIdName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idExpiry, setIdExpiry] = useState("Seumur Hidup");
  const [idIssuer, setIdIssuer] = useState("");

  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const [certTitle, setCertTitle] = useState("");
  const [certField, setCertField] = useState("");
  const [certId, setCertId] = useState("");
  const [certInst, setCertInst] = useState("");
  const [certYear, setCertYear] = useState("");
  const [certType, setCertType] = useState<CertificateItem["degreeType"]>("Sertifikasi Profesional");

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idName.trim() || !idNumber.trim()) return;
    const newItem: IdentityItem = {
      id: `id-${Date.now()}`,
      type: idType,
      fullName: idName.trim(),
      docNumber: idNumber.trim(),
      expiryDate: idExpiry.trim() || "Seumur Hidup",
      issuer: idIssuer.trim() || "Instansi Resmi Pemerintah",
      photoAttached: true,
    };
    setIdentities([...identities, newItem]);
    setIsAddIdOpen(false);
    setIdName("");
    setIdNumber("");
    setIdIssuer("");
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certInst.trim()) return;
    const newItem: CertificateItem = {
      id: `cert-${Date.now()}`,
      title: certTitle.trim(),
      field: certField.trim() || "Keahlian",
      credentialId: certId.trim() || `ID-${Date.now()}`,
      institution: certInst.trim(),
      issueYear: certYear.trim() || "2026",
      degreeType: certType,
      verified: true,
    };
    setCertificates([...certificates, newItem]);
    setIsAddCertOpen(false);
    setCertTitle("");
    setCertField("");
    setCertId("");
    setCertInst("");
    setCertYear("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-blue-500/5 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
            <Vault className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
                Standalone App
              </span>
              <span className="text-xs text-muted-foreground">Secure Identity & Credentials Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
              Vault & Brankas Kredensial
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Penyimpanan aman terenkripsi untuk identitas resmi sipil, ijazah pendidikan, dan sertifikasi kredensial.
            </p>
          </div>
        </div>

        {/* Status Security Badge */}
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur border border-border rounded-xl p-3 px-4">
          <Shield className="h-5 w-5 text-emerald-500" />
          <div>
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Tingkat Enkripsi</span>
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5 mt-0.5">
              <span>AES-256 Client-Side Enkripsi</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        <button
          onClick={() => handleTabChange("vault")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0",
            activeTab === "vault"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Key size={15} />
          <span>Brankas Kunci & PIN Rahasia</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {keys.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange("ktp")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0",
            activeTab === "ktp"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Shield size={15} />
          <span>KTP & Identitas Resmi</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {identities.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange("certificates")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0",
            activeTab === "certificates"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Award size={15} />
          <span>Ijazah & Sertifikat</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 font-mono">
            {certificates.length}
          </span>
        </button>
      </div>

      {/* TAB 1: BRANKAS KUNCI */}
      {activeTab === "vault" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-border bg-gradient-to-r from-card via-card to-blue-500/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Akses Loker & Kunci Rahasia</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Catatan lokasi kunci fisik cadangan, sandi brankas, dan kode darurat rumah tangga.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {keys.map((k) => {
              const isRevealed = !!revealedSecrets[k.id];
              return (
                <div key={k.id} className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3 shadow-xs">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {k.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground">👤 {k.holder}</span>
                    </div>

                    <h4 className="font-bold text-sm text-foreground mt-2">{k.title}</h4>

                    <div className="mt-3 p-2.5 rounded-lg bg-background border border-border/80 flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-foreground truncate">
                        {isRevealed ? k.secretValue : "••••••••••••••••"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleReveal(k.id)}
                        className="text-muted-foreground hover:text-foreground shrink-0 p-1"
                        title={isRevealed ? "Sembunyikan" : "Tampilkan"}
                      >
                        {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    {k.notes && <p className="text-xs text-muted-foreground mt-2">{k.notes}</p>}
                  </div>

                  <div className="border-t border-border pt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <button
                      onClick={() => handleCopy(k.id, k.secretValue)}
                      className="flex items-center gap-1 text-xs hover:text-foreground font-medium cursor-pointer"
                    >
                      {copiedId === k.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copiedId === k.id ? "Tersalin!" : "Salin Kunci"}</span>
                    </button>
                    <button
                      onClick={() => setKeys(keys.filter((x) => x.id !== k.id))}
                      className="hover:text-rose-500 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: KTP & IDENTITAS RESMI */}
      {activeTab === "ktp" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Shield size={16} className="text-blue-500" />
                <span>Dokumen Sipil & Identitas Resmi</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                KTP, Kartu Keluarga, Paspor, SIM, dan NPWP tersimpan rapi untuk kebutuhan administrasi cepat.
              </p>
            </div>

            <button
              onClick={() => setIsAddIdOpen(!isAddIdOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer hover:opacity-90 shadow-xs"
            >
              <Plus size={14} />
              <span>Tambah Identitas</span>
            </button>
          </div>

          {/* Add Identity Form */}
          {isAddIdOpen && (
            <form onSubmit={handleAddIdentity} className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as any)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="KTP">KTP (Kartu Tanda Penduduk)</option>
                  <option value="Paspor">Paspor Republik Indonesia</option>
                  <option value="SIM A">SIM A (Mobil)</option>
                  <option value="SIM C">SIM C (Motor)</option>
                  <option value="Kartu Keluarga">Kartu Keluarga (KK)</option>
                  <option value="NPWP">NPWP Pajak</option>
                  <option value="Lainnya">Dokumen Lainnya</option>
                </select>
                <input
                  type="text"
                  placeholder="Nama Lengkap Pemilik Sesuai Dokumen..."
                  value={idName}
                  onChange={(e) => setIdName(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Nomor NIK / Paspor / SIM..."
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Masa Berlaku (contoh: Seumur Hidup / 2030-05-12)..."
                  value={idExpiry}
                  onChange={(e) => setIdExpiry(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Instansi Penerbit (contoh: Disdukcapil / Ditjen Imigrasi)..."
                  value={idIssuer}
                  onChange={(e) => setIdIssuer(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddIdOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs"
                >
                  Simpan Identitas
                </button>
              </div>
            </form>
          )}

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {identities.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      {item.type}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{item.issuer}</span>
                  </div>

                  <h4 className="font-bold text-base text-foreground mt-2.5">{item.fullName}</h4>

                  <div className="mt-3 p-3 rounded-xl bg-background border border-border/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground font-bold">Nomor Identitas</span>
                      <p className="font-mono text-sm sm:text-base font-bold text-foreground tracking-wider select-all">
                        {item.docNumber}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(item.id, item.docNumber)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      title="Salin Nomor"
                    >
                      {copiedId === item.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>

                  {item.notes && <p className="text-xs text-muted-foreground mt-2.5">{item.notes}</p>}
                </div>

                <div className="border-t border-border pt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Masa Berlaku: <strong className="text-foreground">{item.expiryDate}</strong></span>
                  <button
                    onClick={() => setIdentities(identities.filter((x) => x.id !== item.id))}
                    className="hover:text-rose-500 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: IJAZAH & SERTIFIKAT */}
      {activeTab === "certificates" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Award size={16} className="text-amber-500" />
                <span>Portofolio Ijazah & Sertifikasi Profesional</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dokumentasi kualifikasi formal, lisensi keahlian, dan akreditasi profesional terverifikasi.
              </p>
            </div>

            <button
              onClick={() => setIsAddCertOpen(!isAddCertOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer hover:opacity-90 shadow-xs"
            >
              <Plus size={14} />
              <span>Tambah Sertifikat</span>
            </button>
          </div>

          {/* Add Cert Form */}
          {isAddCertOpen && (
            <form onSubmit={handleAddCert} className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Gelar / Nama Sertifikat..."
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Institusi Penerbit (contoh: Universitas / PMI)..."
                  value={certInst}
                  onChange={(e) => setCertInst(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                  required
                />
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as any)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="Ijazah Formal">Ijazah Formal</option>
                  <option value="Sertifikasi Profesional">Sertifikasi Profesional</option>
                  <option value="Lisensi Keahlian">Lisensi Keahlian</option>
                  <option value="Pelatihan">Pelatihan Eksekutif</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nomor Kredensial / SK Kelulusan..."
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Tahun Penerbitan (contoh: 2024)..."
                  value={certYear}
                  onChange={(e) => setCertYear(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCertOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs"
                >
                  Simpan Sertifikat
                </button>
              </div>
            </form>
          )}

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2.5 py-0.5 rounded-full",
                        cert.degreeType === "Ijazah Formal"
                          ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      )}
                    >
                      {cert.degreeType}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      Terverifikasi
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-foreground mt-2">{cert.title}</h4>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">🏛️ {cert.institution}</p>

                  <div className="mt-3 p-3 rounded-xl bg-background border border-border/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground font-bold">No. Registrasi / Ijazah</span>
                      <p className="font-mono font-bold text-foreground select-all mt-0.5">{cert.credentialId}</p>
                    </div>

                    <button
                      onClick={() => handleCopy(cert.id, cert.credentialId)}
                      className="p-1.5 text-muted-foreground hover:text-foreground"
                    >
                      {copiedId === cert.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="border-t border-border pt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tahun Perolehan: <strong className="text-foreground">{cert.issueYear}</strong></span>
                  <button
                    onClick={() => setCertificates(certificates.filter((x) => x.id !== cert.id))}
                    className="hover:text-rose-500 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
