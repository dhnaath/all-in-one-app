import React, { useState } from "react";
import { SuretyView } from "./views/SuretyView";
import { FlowView } from "./views/FlowView";
import { BuildView } from "./views/BuildView";
import { GrowView } from "./views/GrowView";
import { LegacyView } from "./views/LegacyView";
import { LandingView } from "./views/LandingView";
import { SettingsView } from "./views/SettingsView";
import { MoreSettingsView } from "./views/MoreSettingsView";
import { NewTransaction } from "./components/NewTransaction";
import { NewAccount } from "./components/NewAccount";
import { TrackerSettingsView } from "./views/TrackerSettingsView";
import { SubscriptionSettingsView } from "./views/SubscriptionSettingsView";
import { ProfileView } from "./views/ProfileView";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, X } from "lucide-react";

export default function App_Component() {
  const [currentTab, setCurrentTab] = useState("");
  const [activeScreen, setActiveScreen] = useState("landing");
  const [accountType, setAccountType] = useState<"Reguler" | "Kredit">("Reguler");
  const [toastMessage, setToastMessage] = useState("");

  React.useEffect(() => {
    const theme = typeof window !== "undefined" ? localStorage.getItem("appTheme") : null;
    if (theme === "Light") {
      document.documentElement.classList.add("light-mode");
    }
  }, []);

  const goToLanding = () => setActiveScreen("landing");

  const handleMenuNavigation = (screen: string, tab?: string) => {
    setActiveScreen(screen);
    setCurrentTab(tab || "");
  };

  const showToast = (msg: string = "Fitur ini masih dalam tahap simulasi UI.") => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div
      className="bg-background text-foreground min-h-screen font-sans w-full relative overflow-x-hidden"
      id="app-root"
    >
      <AnimatePresence mode="wait">
        {activeScreen === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full overflow-y-auto"
          >
            <LandingView onNavigate={handleMenuNavigation} onUnavailable={() => showToast()} />
          </motion.div>
        )}

        {["surety", "flow", "build", "grow", "legacy"].includes(activeScreen) && (
          <motion.div
            key="module_screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex flex-col overflow-y-auto"
          >
            {activeScreen === "surety" && (
              <SuretyView
                currentTab={currentTab}
                onBack={goToLanding}
                onSelectTab={setCurrentTab}
                onUnavailable={() => showToast()}
              />
            )}
            {activeScreen === "flow" && (
              <FlowView
                currentTab={currentTab}
                onBack={goToLanding}
                onNavigate={setActiveScreen}
                onSelectTab={setCurrentTab}
                onUnavailable={() => showToast()}
              />
            )}
            {activeScreen === "build" && (
              <BuildView
                currentTab={currentTab}
                onBack={goToLanding}
                onSelectTab={setCurrentTab}
                onUnavailable={() => showToast()}
              />
            )}
            {activeScreen === "grow" && (
              <GrowView
                currentTab={currentTab}
                onBack={goToLanding}
                onSelectTab={setCurrentTab}
                onUnavailable={() => showToast()}
              />
            )}
            {activeScreen === "legacy" && (
              <LegacyView
                currentTab={currentTab}
                onBack={goToLanding}
                onSelectTab={setCurrentTab}
                onUnavailable={() => showToast()}
              />
            )}
          </motion.div>
        )}

        {activeScreen === "settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full min-h-screen z-50 bg-background"
          >
            <SettingsView
              onBack={goToLanding}
              onMoreSettings={() => setActiveScreen("more_settings")}
              onUnavailable={() => showToast()}
            />
          </motion.div>
        )}

        {activeScreen === "more_settings" && (
          <motion.div
            key="more_settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full min-h-screen z-50 bg-background"
          >
            <MoreSettingsView
              onBack={() => setActiveScreen("settings")}
              onUnavailable={() => showToast()}
            />
          </motion.div>
        )}

        {activeScreen === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full min-h-screen z-50 bg-background"
          >
            <ProfileView
              onBack={() => setActiveScreen("landing")}
              onUnavailable={() => showToast()}
            />
          </motion.div>
        )}

        {activeScreen === "tracker_settings" && (
          <motion.div
            key="tracker_settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full min-h-screen z-50 bg-background"
          >
            <TrackerSettingsView
              onBack={() => setActiveScreen("flow")}
              onUnavailable={() => showToast()}
            />
          </motion.div>
        )}

        {activeScreen === "sub_settings" && (
          <motion.div
            key="sub_settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full min-h-screen z-50 bg-background"
          >
            <SubscriptionSettingsView
              onBack={() => setActiveScreen("flow")}
              onUnavailable={() => showToast()}
            />
          </motion.div>
        )}

        {activeScreen === "new_transaction" && (
          <motion.div
            key="new_tx"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full min-h-screen z-50 bg-background"
          >
            <NewTransaction onBack={() => setActiveScreen("flow")} />
          </motion.div>
        )}

        {activeScreen === "new_account" && (
          <motion.div
            key="new_acc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full min-h-screen z-50 bg-background"
          >
            <NewAccount
              type={accountType}
              setType={setAccountType}
              onBack={() => setActiveScreen("flow")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-4 right-4 sm:max-w-sm sm:mx-auto z-[9999] bg-card border border-border text-foreground p-4 rounded-2xl flex items-center gap-3 shadow-2xl"
          >
            <AlertCircle size={20} className="text-[#00bcd4]" />
            <span className="flex-1 text-sm font-medium">{toastMessage}</span>
            <button onClick={() => setToastMessage("")}>
              <X size={18} className="text-gray-400 hover:text-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
