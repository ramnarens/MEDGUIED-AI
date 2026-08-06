import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Save, Plus } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const ScheduleBuilder = () => {
  const navigate = useNavigate();
  const { medicines, updateSchedule } = useAppContext();
  const med = medicines[0];

  const [times, setTimes] = useState([
    { id: 1, label: 'Morning', time: '08:00' },
    { id: 2, label: 'Night', time: '20:00' }
  ]);

  const handleTimeChange = (id: number, field: string, value: string) => {
    setTimes(times.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSave = () => {
    const formattedTimes = times.map(t => {
      let hour = parseInt(t.time.split(':')[0]);
      const minute = t.time.split(':')[1];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12;
      const timeStr = `${hour < 10 ? '0'+hour : hour}:${minute} ${ampm}`;
      return { label: t.label, time: timeStr, medicineId: med.id };
    });
    
    updateSchedule(formattedTimes);
    navigate('/reminders');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '1rem' }}>Create Schedule</h2>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>Set up reminders for {med.genericName} ({med.brandName})</p>

      <div className="glass animate-slide-up" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} /> Reminder Times
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {times.map(t => (
            <div key={t.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select value={t.label} onChange={(e) => handleTimeChange(t.id, 'label', e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '1rem' }}>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
              <input type="time" value={t.time} onChange={(e) => handleTimeChange(t.id, 'time', e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '1rem' }} />
            </div>
          ))}
          
          <button 
            onClick={() => setTimes([...times, { id: Date.now(), label: 'Afternoon', time: '14:00' }])} 
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '2px dashed var(--color-border)', background: 'transparent', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1rem', fontWeight: 600 }}
          >
            <Plus size={18} /> Add Another Time
          </button>
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
