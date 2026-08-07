import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Check, Clock, Bell, X, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Reminders = () => {
  const { schedule, markAsTaken } = useAppContext();
  const navigate = useNavigate();

  const handleTake = (timeOfDay: string, medicineId: string) => {
    markAsTaken(timeOfDay, medicineId);
    // Could add confetti animation here
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Daily Schedule</h2>
        <button onClick={() => navigate('/voice')} style={{ padding: '0.5rem 1rem', background: 'var(--color-secondary)', color: 'white', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
           Ask Assistant
        </button>
      </div>

      {Object.entries(schedule).map(([timeOfDay, meds]: [string, any]) => (
        <div key={timeOfDay} style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            <Clock size={24} /> {timeOfDay}
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {meds.map((med: any) => (
              <div key={med.medicineId} className="glass animate-slide-up" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: med.taken ? 0.6 : 1, transition: 'var(--transition-normal)' }}>
                <div>
                  <h4 style={{ textDecoration: med.taken ? 'line-through' : 'none' }}>Medicine ID: {med.medicineId}</h4>
                  <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <Bell size={16} /> Scheduled for {med.time}
                  </p>
                </div>
                {!med.taken ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.75rem', borderRadius: '50%', border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer' }}>
                      <X size={20} color="var(--color-muted)" />
                    </button>
                    <button onClick={() => handleTake(timeOfDay, med.medicineId)} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--color-accent)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <Check size={20} /> Mark Taken
                    </button>
                  </div>
                ) : (
                  <div style={{ color: 'var(--color-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={24} /> Completed
                  </div>
                )}
              </div>
            ))}
            {meds.length === 0 && (
              <p className="text-muted glass" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>No medicines scheduled.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reminders;
