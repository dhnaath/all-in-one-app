import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Users,
  DollarSign,
  Settings,
  Bell,
  Search,
  Plus,
  LogOut,
  User,
  CreditCard,
  Moon,
  Globe,
  Calendar,
  Clock,
  Activity,
  Target,
  BookOpen,
  Bookmark,
  Lightbulb,
  Key,
  Dumbbell,
  Utensils,
  Briefcase,
  Music,
  CloudSun,
  Wallet,
  Book,
  Plane,
  ShoppingCart,
  Heart,
  Archive,
  GraduationCap,
  Layers,
  FileCheck,
  Film,
  Gamepad2,
  Podcast,
  Ticket,
  PenTool,
  Camera,
  Type,
  Code,
} from "lucide-react";
import { cn } from "../lib/utils";
import { ReactNode, useState } from "react";

interface ZohoSoloLayoutProps {
  children: ReactNode;
  activeApp: string;
  onNavigate: (app: string) => void;
  onQuickAdd?: () => void;
}

export function ZohoSoloLayout({
  children,
  activeApp,
  onNavigate,
  onQuickAdd,
}: ZohoSoloLayoutProps) {
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("general");

  const handleOpenSettings = (tab = "general") => {
    setActiveSettingsTab(tab);
    setIsSettingsOpen(true);
    setIsMobileProfileOpen(false);
    setIsDesktopProfileOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-card text-foreground overflow-hidden font-sans">
      {/* Floating ME Circle for Mobile */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        {/* <div
          onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
          className="w-10 h-10 rounded-full bg-primary text-white border-2 border-border flex items-center justify-center font-bold text-[10px] shadow-lg cursor-pointer relative"
        >
          ME
          <ProfileMenu
            isOpen={isMobileProfileOpen}
            onClose={() => setIsMobileProfileOpen(false)}
            isMobile
            onOpenSettings={handleOpenSettings}
          />
        </div> */}
      </div>

      {/* Far Left Rail (Zoho Style) - Hidden on Mobile */}
      <div className="hidden md:flex w-[68px] flex-shrink-0 bg-[#1E293B] border-r border-border flex-col items-center py-5 z-50 shadow-xl relative">
        {/* User Profile / Logo */}
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white flex items-center justify-center font-bold text-lg mb-8 shadow-md">
          Z
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col gap-4 w-full px-3 relative">
          <RailItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeApp === "dashboard"}
            onClick={() => onNavigate("dashboard")}
          />
        </div>

        {/* Global Quick Add */}
        <div className="my-6">
          <button
            onClick={onQuickAdd}
            className="w-11 h-11 mx-auto rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col gap-4 w-full px-3 relative">
          <RailItem icon={Search} label="Search" />
          <RailItem icon={Bell} label="Notifications" />
          {/* <RailItem
            icon={Settings}
            label="Settings"
            onClick={() => handleOpenSettings("general")}
          />
          <div
            onClick={() => setIsDesktopProfileOpen(!isDesktopProfileOpen)}
            className="w-10 h-10 rounded-full bg-primary text-white border-2 border-border flex items-center justify-center font-bold text-xs mt-2 mx-auto cursor-pointer hover:border-border transition-colors relative"
          >
            ME
            <ProfileMenu
              isOpen={isDesktopProfileOpen}
              onClose={() => setIsDesktopProfileOpen(false)}
              onOpenSettings={handleOpenSettings}
            />
          </div> */}
        </div>
      </div>

      {/* App Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-card pb-[60px] md:pb-0">
        {children}
      </div>

      {/* <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={activeSettingsTab}
      /> */}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-[#1E293B] border-t border-border flex items-center justify-around px-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <MobileRailItem
          icon={LayoutDashboard}
          label="Home"
          active={activeApp === "dashboard"}
          onClick={() => onNavigate("dashboard")}
        />
        {/* Floating Quick Add for Mobile */}
        <div className="relative -top-5">
          <button
            onClick={onQuickAdd}
            className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-lg shadow-blue-900/40 border-4 border-[#1E293B] transition-transform active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileRailItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-14 h-14 rounded-xl cursor-pointer transition-all",
        active ? "text-blue-400" : "text-muted-foreground/70 hover:text-primary-foreground/80",
      )}
    >
      <Icon
        size={20}
        strokeWidth={active ? 2.5 : 2}
        className={cn("mb-1", active && "scale-110 transition-transform")}
      />
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </div>
  );
}

function RailItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-11 h-11 mx-auto rounded-xl flex items-center justify-center cursor-pointer transition-all group relative",
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
          : "text-muted-foreground/70 hover:bg-primary hover:text-primary-foreground/80",
      )}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />

      {/* Tooltip */}
      <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-primary text-white text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-border transform translate-x-2 group-hover:translate-x-0 transition-all">
        {label}
        {/* Tooltip Triangle */}
        <div className="absolute top-1/2 -left-1 -mt-1 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-border"></div>
      </div>
    </div>
  );
}

function ProfileMenu({
  isOpen,
  onClose,
  isMobile,
  onOpenSettings,
}: {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  onOpenSettings: (tab: string) => void;
}) {
  if (!isOpen) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        className={cn(
          "absolute z-50 w-64 bg-card rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 cursor-default text-left",
          isMobile ? "top-14 right-0" : "bottom-0 left-16 mb-2",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Info */}
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
              ME
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">My Account</span>
              <span className="text-xs text-muted-foreground">Free Plan</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2 space-y-1">
          <ProfileMenuItem
            icon={User}
            label="Profile Settings"
            onClick={() => onOpenSettings("profile")}
          />

          <ProfileMenuItem
            icon={CreditCard}
            label="Billing & Subscription"
            onClick={() => onOpenSettings("billing")}
          />

        </div>

        <div className="p-2 border-t border-border">
          <ProfileMenuItem
            icon={LogOut}
            label="Sign Out"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {}}
          />
        </div>
      </div>
    </>
  );
}

function ProfileMenuItem({ icon: Icon, label, rightText, className, onClick }: any) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Icon size={16} />
        {label}
      </div>
      {rightText && <span className="text-xs text-muted-foreground/70">{rightText}</span>}
    </button>
  );
}

function SettingsModal({
  isOpen,
  onClose,
  initialTab,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTab: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab || "general");

  // Update tab if initialTab changes while open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-xl w-full max-w-4xl h-[80vh] max-h-[800px] flex overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Settings Sidebar */}
        <div className="w-64 bg-muted/30 border-r border-border flex flex-col hidden md:flex shrink-0">
          <div className="p-6 pb-4">
            <h2 className="text-xl font-bold text-foreground">Settings</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-1">
            <SettingsTab
              id="profile"
              icon={User}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <SettingsTab
              id="general"
              icon={Settings}
              label="Preferences"
              active={activeTab === "general"}
              onClick={() => setActiveTab("general")}
            />

            <SettingsTab
              id="billing"
              icon={CreditCard}
              label="Billing"
              active={activeTab === "billing"}
              onClick={() => setActiveTab("billing")}
            />
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 flex flex-col bg-card">
          <div className="p-4 border-b border-border flex items-center justify-between md:justify-end">
            <div className="md:hidden flex items-center gap-2">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-muted/30 border border-border rounded-lg px-3 py-1.5 text-sm font-medium text-card-foreground outline-none"
              >
                <option value="profile">Profile</option>
                <option value="general">Preferences</option>

                <option value="billing">Billing</option>
              </select>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <LogOut size={18} className="rotate-180" />{" "}
              {/* Reusing LogOut icon for close or just use text if no X */}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "general" && <GeneralSettings />}

            {activeTab === "billing" && <BillingSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
        active
          ? "bg-card text-blue-600 shadow-sm border border-border/50"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      <Icon size={18} className={active ? "text-blue-500" : "text-muted-foreground/70"} />
      {label}
    </button>
  );
}

function ProfileSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Profile Information</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Update your personal details and public profile.
        </p>
      </div>
      <div className="flex items-center gap-6 pb-6 border-b border-border">
        <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl shrink-0">
          ME
        </div>
        <div>
          <button className="px-4 py-2 bg-muted hover:bg-accent text-card-foreground text-sm font-medium rounded-lg transition-colors">
            Change Avatar
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-card-foreground">First Name</label>
            <input
              type="text"
              defaultValue="John"
              className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-card transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-card-foreground">Last Name</label>
            <input
              type="text"
              defaultValue="Doe"
              className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-card transition-all"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-card-foreground">Email Address</label>
          <input
            type="email"
            defaultValue="john.doe@example.com"
            className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-card transition-all"
          />
        </div>
      </div>
      <div className="pt-4">
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-md shadow-blue-600/20 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">General Preferences</h3>
        <p className="text-sm text-muted-foreground mb-6">Manage how the application behaves.</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
          <div>
            <h4 className="font-medium text-foreground">Desktop Notifications</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Receive alerts for tasks and events.
            </p>
          </div>
          <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-card rounded-full absolute top-1 right-1"></div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
          <div>
            <h4 className="font-medium text-foreground">Email Summaries</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Receive daily agenda emails.</p>
          </div>
          <div className="w-10 h-6 bg-muted rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-card rounded-full absolute top-1 left-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground mb-6">Manage your plan and payment methods.</p>
      </div>
      <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-xl">Free Plan</h4>
          <span className="px-3 py-1 bg-card/20 rounded-full text-xs font-semibold backdrop-blur-sm">
            Current
          </span>
        </div>
        <p className="text-blue-100 text-sm mb-6">
          You are currently on the free tier. Upgrade to unlock premium features and higher limits.
        </p>
        <button className="bg-card text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-muted/30 transition-colors">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
