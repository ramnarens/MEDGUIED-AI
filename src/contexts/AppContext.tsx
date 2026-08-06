import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockPatient, mockMedicines, mockSchedule, mockCaregiverStats } from '../data/mockData';
import { translations } from '../translations';
import { supabase } from '../lib/supabase';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  patient: typeof mockPatient;
  medicines: typeof mockMedicines;
  schedule: typeof mockSchedule;
  caregiverStats: typeof mockCaregiverStats;
  markAsTaken: (timeOfDay: string, medicineId: string) => void;
  scannedImage: string | null;
  setScannedImage: (img: string | null) => void;
  updateSchedule: (newTimes: { label: string, time: string, medicineId: string }[]) => void;
  language: 'en' | 'hi' | 'te';
  setLanguage: (lang: 'en' | 'hi' | 'te') => void;
  t: (key: string) => string;
  session: any;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [schedule, setSchedule] = useState(mockSchedule);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi' | 'te'>('en');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const t = (key: string) => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const markAsTaken = (timeOfDay: string, medicineId: string) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      // @ts-ignore
      const timeSlot = newSchedule[timeOfDay];
      const medIndex = timeSlot.findIndex((m: any) => m.medicineId === medicineId);
      if (medIndex !== -1) {
        timeSlot[medIndex].taken = true;
      }
      return newSchedule;
    });
  };

  const updateSchedule = (newTimes: { label: string, time: string, medicineId: string }[]) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      const medId = newTimes[0]?.medicineId;
      if (medId) {
        Object.keys(newSchedule).forEach(key => {
          // @ts-ignore
          if (newSchedule[key]) {
            // @ts-ignore
            newSchedule[key] = newSchedule[key].filter(m => m.medicineId !== medId);
          }
        });
      }
      newTimes.forEach(t => {
        // @ts-ignore
        if (!newSchedule[t.label]) newSchedule[t.label] = [];
        // @ts-ignore
        newSchedule[t.label].push({ medicineId: t.medicineId, taken: false, time: t.time });
      });
      return newSchedule;
    });
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      patient: mockPatient,
      medicines: mockMedicines,
      schedule,
      caregiverStats: mockCaregiverStats,
      markAsTaken,
      scannedImage,
      setScannedImage,
      updateSchedule,
      language,
      setLanguage,
      t,
      session,
      signOut: async () => { await supabase.auth.signOut(); }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
