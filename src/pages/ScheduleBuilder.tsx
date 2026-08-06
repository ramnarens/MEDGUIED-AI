import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Save, Pill } from 'lucide-react';
import { useAppContext, DynamicMedicine } from '../contexts/AppContext';

interface ReminderState {
  id: string;
  medicineId: string;
  medicineName: string;
  label: string;
  time: string;
}

const ScheduleBuilder = () => {
  const navigate = useNavigate();
  const { dynamicMedicines, medicines, updateSchedule } = useAppContext();
  
  const displayMeds = dynamicMedicines.length > 0 ? dynamicMedicines : (medicines as any[]);
  const [reminders, setReminders] = useState<ReminderState[]>([]);

  useEffect(() => {
    // Generate one default reminder per medicine based on its timing instruction
    const initialReminders: ReminderState[] = [];
    displayMeds.forEach(med => {
      let label = 'Morning';
      let time = '08:00';
      const timingStr = (med.timing || med.timing?.[0] || '').toLowerCase();
      
      if (timingStr.includes('night') || timingStr.includes('dinner')) {
        label = 'Night';
        time = '20:00';
      } else if (timingStr.includes('afternoon') || timingStr.includes('lunch')) {
        label = 'Afternoon';
        time = '14:00';
      }
      
      initialReminders.push({
        id: `rem_${Date.now()}_${Math.random()}`,
        medicineId: med.id,
        medicineName: med.medicine || med.genericName,
        label,
        time
      });
    });
    setReminders(initialReminders);
  }, [displayMeds]);

  const handleTimeChange = (id: string, field: string, value: string) => {
    setReminders(reminders.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSave = () => {
    const formattedTimes = reminders.map(t => {
      let hour = parseInt(t.time.split(':')[0]);
      const minute = t.time.split(':')[1];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12;
      const timeStr = `${hour < 10 ? '0'+hour : hour}:${minute} ${ampm}`;
      return { label: t.label, time: timeStr, medicineId: t.medicineId, name: t.medicineName };
    });
    
    updateSchedule(formattedTimes);
    navigate('/reminders');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Create Schedule</h2>

      {/* Detected Medicines Summary Card */}
      <div className="glass animate-fade-in" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', borderLeft: '4px solid var(--color-primary)' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
          <Pill size={20} /> Detected Medicines ({displayMeds.length} Found)
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {displayMeds.map((med, idx) => (
            <div key={idx} style={{ background: 'var(--color-surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-accent)' }}>✓</span> {med.medicine || med.genericName}
            </div>
          ))}
        </div>
      </div>

      <div className="glass animate-slide-up" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} /> Reminder Times
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reminders.map((t, idx) => (
            <div key={t.id} style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', animationDelay: `${idx * 0.1}s` }} className="animate-fade-in">
              <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{t.medicineName}</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={t.label} onChange={(e) => handleTimeChange(t.id, 'label', e.target.value)} style={{ flex: 1, minWidth: '120px', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '1rem' }}>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
                <input type="time" value={t.time} onChange={(e) => handleTimeChange(t.id, 'time', e.target.value)} style={{ flex: 1, minWidth: '120px', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)', fontSize: '1rem' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => navigate('/simplification')} style={{ padding: '1rem', flex: 1, borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 600 }}>
          Back
        </button>
        <button onClick={handleSave} style={{ padding: '1rem', flex: 2, borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <Save size={20} /> Save Schedule
        </button>
      </div>
    </div>
  );
};
export default ScheduleBuilder;
