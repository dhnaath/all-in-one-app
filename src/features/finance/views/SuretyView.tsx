import React from "react";
import {
  ArrowLeft,
  LifeBuoy,
  Umbrella,
  Calculator,
  FileText,
  FileCheck,
  Key,
  Shield,
  AlertCircle,
  Phone,
  Lock,
  HeartPulse,
  HeartCrack,
  Car,
  Repeat,
  GraduationCap,
  Clock,
  Users,
  Scale,
  Globe,
  Vault,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { MenuListItem } from "../components/MenuListItem";
import { GoalsView } from "./GoalsView";
import { InsuranceView } from "./InsuranceView";
import { LegalView } from "./LegalView";
import { ProtectionView } from "./ProtectionView";
import { AccountSecurityView } from "./AccountSecurityView";
import { HealthRecordView } from "./HealthRecordView";
import { RetirementPlannerView } from "./RetirementPlannerView";
import { InsuranceGapAnalysisView } from "./Phase2Views";
import { DocumentVaultView, VehiclePropertyInsuranceTrackerView, SinkingFundView } from "./Phase3Views";
import {
  InsuranceCalculatorView,
  ClaimsHistoryView,
  BeneficiaryManagerView,
  HealthRiskView,
  CriticalIllnessView,
  GeneralInsuranceView,
  UnitLinkComparisonView,
  EndowmentView,
  TermLifeView,
} from "./SuretyExtraViews";
import { useLanguage } from "../hooks/useLanguage";
import { translations } from "../translations";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function SuretyView({
  currentTab,
  onBack,
  onSelectTab,
  onUnavailable,
}: {
  currentTab: string;
  onBack: () => void;
  onSelectTab?: (tab: string) => void;
  onUnavailable?: () => void;
}) {
  const { ref, onScroll } = useScrollRestore("SuretyView_scroll");
  const lang = useLanguage();

  if (!currentTab) {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={onBack}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <ShieldCheck size={20} className="text-muted-foreground" />{" "}
            {translations.surety.viewTitle[lang]}
          </h1>
        </div>
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <div className="col-span-full mb-8 max-w-3xl">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              {translations.landing.categories.surety.desc[lang]}
            </h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
              {translations.landing.categories.surety.long[lang]}
            </p>
          </div>
          <MenuListItem
            onClick={() => onSelectTab?.("cat_kepatuhan")}
            icon={Scale}
            title={translations.surety.tabs[0][lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_publik")}
            icon={Globe}
            title={translations.surety.tabs[1][lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_asuransi")}
            icon={Umbrella}
            title={translations.surety.tabs[2][lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_dana")}
            icon={Vault}
            title={translations.surety.tabs[3][lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cat_proteksi")}
            icon={Lock}
            title={translations.surety.tabs[4][lang]}
          />
        </div>
      </div>
    );
  }

  if (currentTab === "cat_kepatuhan") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={() => onBack()}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Scale size={20} className="text-indigo-400" /> {translations.surety.tabs[0][lang]}
          </h1>
        </div>
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <MenuListItem
            onClick={() => onSelectTab?.("legal")}
            icon={FileCheck}
            title="Legalitas & Kepatuhan"
            desc={translations.surety.tabs[0].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("doc_vault")}
            icon={Lock}
            title="Document Vault & Kepatuhan"
            desc="Arsip berkas identitas, akta, dan reminder masa berlaku polis."
          />
        </div>
      </div>
    );
  }

  if (currentTab === "cat_publik") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={() => onBack()}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Globe size={20} className="text-sky-400" /> {translations.surety.tabs[1][lang]}
          </h1>
        </div>
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <MenuListItem
            onClick={() => onSelectTab?.("general_ins")}
            icon={Car}
            title="Social Security atau Jaminan Sosial"
            desc={translations.surety.tabs[1].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("claims")}
            icon={FileText}
            title="Riwayat Klaim"
            desc="Log status pengajuan klaim asuransi."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("vehicle_property")}
            icon={Car}
            title="Asuransi Kendaraan & Properti"
            desc="Pelacak polis perlindungan kendaraan dan properti."
          />
        </div>
      </div>
    );
  }

  if (currentTab === "cat_asuransi") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={() => onBack()}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Umbrella size={20} className="text-purple-400" /> {translations.surety.tabs[2][lang]}
          </h1>
        </div>
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <MenuListItem
            onClick={() => onSelectTab?.("insurance")}
            icon={Umbrella}
            title="Asuransi Kesehatan"
            desc={translations.surety.tabs[2].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("ci")}
            icon={HeartCrack}
            title="Penyakit Kritis"
            desc="Proteksi risiko penyakit kritis & kronis."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("calc_insurance")}
            icon={Calculator}
            title="Kalkulator Kebutuhan Asuransi (HLV)"
            desc="Hitung uang pertanggungan berbasis Human Life Value."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("insurance_gap")}
            icon={Shield}
            title="Insurance Gap Analysis"
            desc="Dashboard analisis kesenjangan proteksi jiwa & kesehatan."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("unit_link")}
            icon={Repeat}
            title="Perbandingan Unit Link vs Murni"
            desc="Simulasi biaya dan efisiensi premi unit link vs term."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("term_life")}
            icon={Clock}
            title="Term Life (Asuransi Jiwa Berjangka)"
            desc="Proteksi jiwa murni efisien biaya."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("endowment")}
            icon={GraduationCap}
            title="Asuransi Dwiguna (Endowment)"
            desc="Perlindungan dengan nilai tunai terjadwal."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("health_risk")}
            icon={HeartPulse}
            title="Health Risk Assessment"
            desc="Evaluasi profil gaya hidup dan risiko kesehatan."
          />
        </div>
      </div>
    );
  }

  if (currentTab === "cat_dana") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={() => onBack()}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Vault size={20} className="text-teal-500" /> {translations.surety.tabs[3][lang]}
          </h1>
        </div>
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <MenuListItem
            onClick={() => onSelectTab?.("emergency_fund")}
            icon={LifeBuoy}
            title="Dana Darurat"
            desc={translations.surety.tabs[3].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("retirement")}
            icon={Clock}
            title="Perencanaan & Simulasi Pensiun"
            desc="Kalkulator kecukupan dana pensiun dan target tabungan."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("sinking_fund")}
            icon={Vault}
            title="Sinking Fund (Dana Terjadwal)"
            desc="Pengalokasian pos dana pengeluaran besar berkala."
          />
        </div>
      </div>
    );
  }

  if (currentTab === "cat_proteksi") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={() => onBack()}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Lock size={20} className="text-green-500" /> {translations.surety.tabs[4][lang]}
          </h1>
        </div>
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <MenuListItem
            onClick={() => onSelectTab?.("protection")}
            icon={Shield}
            title="Proteksi Aset"
            desc={translations.surety.tabs[4].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("security")}
            icon={Lock}
            title="Keamanan Akun"
            desc="Keamanan akun"
          />
          <MenuListItem
            onClick={() => onSelectTab?.("beneficiary")}
            icon={Users}
            title="Beneficiary Manager (Ahli Waris Polis)"
            desc="Pengelolaan penerima manfaat polis asuransi."
          />
        </div>
      </div>
    );
  }

  if (currentTab === "emergency_fund")
    return <GoalsView onBack={() => onSelectTab?.("cat_dana")} />;
  if (currentTab === "insurance")
    return <InsuranceView onBack={() => onSelectTab?.("cat_asuransi")} />;
  if (currentTab === "legal") return <LegalView onBack={() => onSelectTab?.("cat_kepatuhan")} />;
  if (currentTab === "protection")
    return <ProtectionView onBack={() => onSelectTab?.("cat_proteksi")} />;
  if (currentTab === "security")
    return <AccountSecurityView onBack={() => onSelectTab?.("cat_proteksi")} />;
  if (currentTab === "health")
    return <HealthRecordView onBack={() => onSelectTab?.("cat_asuransi")} />;

  if (currentTab === "calc_insurance")
    return <InsuranceCalculatorView onBack={() => onSelectTab?.("cat_asuransi")} />;
  if (currentTab === "claims")
    return <ClaimsHistoryView onBack={() => onSelectTab?.("cat_publik")} />;
  if (currentTab === "beneficiary")
    return <BeneficiaryManagerView onBack={() => onSelectTab?.("cat_proteksi")} />;
  if (currentTab === "health_risk")
    return <HealthRiskView onBack={() => onSelectTab?.("cat_asuransi")} />;
  if (currentTab === "ci")
    return <CriticalIllnessView onBack={() => onSelectTab?.("cat_asuransi")} />;
  if (currentTab === "general_ins")
    return <GeneralInsuranceView onBack={() => onSelectTab?.("cat_publik")} />;
  if (currentTab === "unit_link")
    return <UnitLinkComparisonView onBack={() => onSelectTab?.("cat_asuransi")} />;
  if (currentTab === "endowment")
    return <EndowmentView onBack={() => onSelectTab?.("cat_asuransi")} />;
  if (currentTab === "term_life")
    return <TermLifeView onBack={() => onSelectTab?.("cat_asuransi")} />;
  if (currentTab === "retirement")
    return <RetirementPlannerView onBack={() => onSelectTab?.("cat_dana")} />;
  if (currentTab === "insurance_gap")
    return <InsuranceGapAnalysisView onBack={() => onSelectTab?.("cat_asuransi")} />;
  if (currentTab === "doc_vault")
    return <DocumentVaultView onBack={() => onSelectTab?.("cat_kepatuhan")} />;
  if (currentTab === "vehicle_property")
    return <VehiclePropertyInsuranceTrackerView onBack={() => onSelectTab?.("cat_publik")} />;
  if (currentTab === "sinking_fund")
    return <SinkingFundView onBack={() => onSelectTab?.("cat_dana")} />;

  return null;
}
