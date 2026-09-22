import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const KUNCI = "clientos-profil";
const KLIEN_BAWAAN = "c1";

type Profil = {
  clientId: string;
  siap: boolean;
};

const KonteksProfil = createContext<Profil | null>(null);

export function PenyediaProfil({ children }: { children: ReactNode }) {
  const [clientId, setClientId] = useState<string>(KLIEN_BAWAAN);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    try {
      const mentah = window.localStorage.getItem(KUNCI);
      if (mentah) {
        const tersimpan = JSON.parse(mentah) as Partial<{ clientId: string }>;
        if (typeof tersimpan.clientId === "string" && tersimpan.clientId && tersimpan.clientId !== "11111111-1111-1111-1111-111111111111") {
          setClientId(tersimpan.clientId);
        } else {
          setClientId(KLIEN_BAWAAN);
        }
      }
    } catch {
      /* abaikan penyimpanan yang rusak */
    }
    setSiap(true);
  }, []);

  const nilai = useMemo(
    () => ({ clientId, siap }),
    [clientId, siap],
  );

  return <KonteksProfil.Provider value={nilai}>{children}</KonteksProfil.Provider>;
}

export function useProfil() {
  const konteks = useContext(KonteksProfil);
  if (!konteks) throw new Error("useProfil harus dipakai di dalam PenyediaProfil");
  return konteks;
}
