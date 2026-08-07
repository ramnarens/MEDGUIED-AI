import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockPatient, mockMedicines, mockSchedule, mockCaregiverStats } from '../data/mockData';
import { translations } from '../translations';

export interface Refill {
  id: string;
  medicineName: string;
  dosage: string;
  remainingPills: number;
}

export interface DynamicMedicine {
  id: string;
  medicine: string;
  brand: string | null;
  generic: string | null;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  instruction: string;
  foodRelation: string | null;
  notes: string | null;
  confidenceScore: number;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  patient: typeof mockPatient;
  medicines: typeof mockMedicines;
  dynamicMedicines: DynamicMedicine[];
  refills: Refill[];
  addAnalyzedMedicines: (meds: any[]) => void;
  schedule: typeof mockSchedule | any;
  caregiverStats: typeof mockCaregiverStats;
  markAsTaken: (timeOfDay: string, medicineId: string) => void;
  scannedImage: string | null;
  setScannedImage: (img: string | null) => void;
  updateSchedule: (newTimes: { label: string, time: string, medicineId: string, name?: string }[]) => void;
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  session: any;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [schedule, setSchedule] = useState<any>(mockSchedule);
  const [dynamicMedicines, setDynamicMedicines] = useState<DynamicMedicine[]>([]);
  const [refills, setRefills] = useState<Refill[]>([]);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [language, setLanguageState] = useState<string>(() => localStorage.getItem('language') || 'en');

  const setLanguage = (lang: string) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = (key: string) => {
    // @ts-ignore
    const langSet = translations[language] || translations['en'];
    return langSet[key] || key;
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const markAsTaken = (timeOfDay: string, medicineId: string) => {
    setSchedule((prev: any) => {
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

  const updateSchedule = (newTimes: { label: string, time: string, medicineId: string, name?: string }[]) => {
    setSchedule((prev: any) => {
      const newSchedule = { ...prev };
      
      // If we are passing names, this is a bulk update from the dynamic schedule builder
      if (newTimes.length > 0 && newTimes[0].name) {
        // Clear all dynamic medicines first to replace them
        newTimes.forEach(t => {
           Object.keys(newSchedule).forEach(key => {
             if (newSchedule[key]) {
               newSchedule[key] = newSchedule[key].filter((m: any) => m.medicineId !== t.medicineId);
             }
           });
        });
      } else {
        const medId = newTimes[0]?.medicineId;
        if (medId) {
          Object.keys(newSchedule).forEach(key => {
            if (newSchedule[key]) {
              newSchedule[key] = newSchedule[key].filter((m: any) => m.medicineId !== medId);
            }
          });
        }
      }

      newTimes.forEach(t => {
        if (!newSchedule[t.label]) newSchedule[t.label] = [];
        newSchedule[t.label].push({ medicineId: t.medicineId, name: t.name, taken: false, time: t.time });
      });
      return newSchedule;
    });
  };

  const addAnalyzedMedicines = (meds: any[]) => {
    const newMeds: DynamicMedicine[] = meds.map((m, idx) => ({
      ...m,
      id: `dyn_${Date.now()}_${idx}`
    }));

    setDynamicMedicines(prev => [...prev, ...newMeds]);

    // Update refills dynamically
    setRefills(prev => {
      const newRefills = [...prev];
      newMeds.forEach(med => {
        const existing = newRefills.find(r => r.medicineName.toLowerCase() === med.medicine.toLowerCase());
        const durationMatch = med.duration.match(/\d+/);
        const addedPills = durationMatch ? parseInt(durationMatch[0]) * 2 : 30; // Estimate
        
        if (existing) {
          existing.remainingPills += addedPills;
        } else {
          newRefills.push({
            id: `ref_${Date.now()}_${Math.random()}`,
            medicineName: med.medicine,
            dosage: med.dosage,
            remainingPills: addedPills
          });
        }
      });
      return newRefills;
    });
  };


  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      patient: mockPatient,
      medicines: mockMedicines,
      dynamicMedicines,
      refills,
      addAnalyzedMedicines,
      schedule,
      caregiverStats: mockCaregiverStats,
      markAsTaken,
      scannedImage,
      setScannedImage,
      updateSchedule,
      language,
      setLanguage,
      t,
      session: null,
      signOut: async () => {}
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
