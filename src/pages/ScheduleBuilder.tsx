import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Save, Plus } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface ReminderState {
  id: string;
  label: string;
  time: string;
}

const ScheduleBuilder = () => {
  const navigate = useNavigate();
  const { dynamicMedicines, medicines, updateSchedule } = useAppContext();
  
  const displayMeds = dynamicMedicines.length > 0 ? dynamicMedicines : (medicines as any[]);
  const mainMed = displayMeds[0] || {};
  const medName = mainMed.medicine || mainMed.genericName || "Medicine";
  const medBrand = mainMed.brand || mainMed.brandName || "";
  
  const displayTitle = medBrand ? `${medName} (${medBrand})` : medName;

  const [reminders, setReminders] = useState<ReminderState[]>([
    { id: '1', label: 'Morning', time: '08:00' },
    { id: '2', label: 'Night', time: '20:00' }
  ]);

  const handleTimeChange = (id: string, field: string, value: string) => {
    setReminders(reminders.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addAnotherTime = () => {
    setReminders([...reminders, { id: Date.now().toString(), label: 'Afternoon', time: '14:00' }]);
  };

  const handleSave = () => {
    const formattedTimes = reminders.map(t => {
      let hour = parseInt(t.time.split(':')[0]);
      const minute = t.time.split(':')[1];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12;
      const timeStr = `${hour < 10 ? '0'+hour : hour}:${minute} ${ampm}`;
      return { label: t.label, time: timeStr, medicineId: mainMed.id, name: displayTitle };
    });
    
    updateSchedule(formattedTimes);
    navigate('/reminders');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem', color: '#0f172a', fontWeight: 800, fontSize: '2rem' }}>Create Schedule</h1>
      <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Set up reminders for {displayTitle}</p>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontSize: '1.4rem' }}>
          <Clock size={24} color="#0f172a" /> Reminder Times
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reminders.map((t) => (
            <div key={t.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }}>
              <select 
                value={t.label} 
                onChange={(e) => handleTimeChange(t.id, 'label', e.target.value)} 
                style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#334155', fontSize: '1rem', outline: 'none', appearance: 'auto' }}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
              
              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  type="time" 
                  value={t.time} 
                  onChange={(e) => handleTimeChange(t.id, 'time', e.target.value)} 
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#334155', fontSize: '1rem', outline: 'none', fontFamily: 'monospace', fontWeight: 600 }} 
                />
              </div>
            </div>
          ))}
          
          <button 
            onClick={addAnotherTime}
            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px dashed #e2e8f0', background: 'transparent', color: '#3b82f6', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}
          >
            <Plus size={18} /> Add Another Time
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => navigate('/simplification')} style={{ flex: 1, padding: '1.25rem', borderRadius: '100px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>
          Back
        </button>
        <button onClick={handleSave} style={{ flex: 2, padding: '1.25rem', borderRadius: '100px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 700, fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <Save size={20} /> Save Schedule
        </button>
      </div>
    </div>
  );
};

export default ScheduleBuilder;
