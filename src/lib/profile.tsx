import React, { createContext, useContext, useState, type ReactNode } from "react";

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  team: string;
  avatar?: string;
  email?: string;
}

const defaultProfile: UserProfile = {
  id: "user-1",
  name: "Dhia Najmi",
  role: "Konsultan",
  team: "Tim Praktik",
  email: "dhia.najmi@example.com",
};

interface ProfileContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clientId: string;
  setClientId?: (id: string) => void;
  siap?: boolean;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  setProfile: () => {},
  updateProfile: () => {},
  clientId: "11111111-1111-1111-1111-111111111111",
  siap: true,
});

export function PenyediaProfil({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("aio_user_profile");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage error
    }
    return defaultProfile;
  });

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    try {
      localStorage.setItem("aio_user_profile", JSON.stringify(newProfile));
    } catch {
      // ignore storage error
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem("aio_user_profile", JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, updateProfile, clientId: "11111111-1111-1111-1111-111111111111", siap: true }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfil() {
  return useContext(ProfileContext);
}
