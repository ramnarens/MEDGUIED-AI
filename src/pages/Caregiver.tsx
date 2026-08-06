import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Phone, Video, MapPin, AlertCircle } from 'lucide-react';

const Caregiver = () => {
  const { patient, caregiverStats } = useAppContext();

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Family Dashboard</h2>
        <span style={{ padding: '0.5rem 1rem', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
          Caregiver Mode
        </span>
      </div>

      <div className="responsive-grid-1-2" style={{ gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <img src={patient.avatar} alt={patient.name} style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '1rem', objectFit: 'cover' }} />
          <h3>{patient.name}</h3>
          <p className="text-muted">Age: {patient.age} • {patient.language}</p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button style={{ padding: '0.75rem', borderRadius: '50%', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer' }}><Phone size={20} /></button>
            <button style={{ padding: '0.75rem', borderRadius: '50%', border: 'none', background: 'var(--color-secondary)', color: 'white', cursor: 'pointer' }}><Video size={20} /></button>
            <button style={{ padding: '0.75rem', borderRadius: '50%', background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', cursor: 'pointer' }}><MapPin size={20} /></button>
          </div>
        </div>

        <div className="responsive-grid-2" style={{ gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h4 className="text-muted" style={{ marginBottom: '0.5rem' }}>Weekly Adherence</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>{caregiverStats.adherenceRate}%</div>
            <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${caregiverStats.adherenceRate}%`, background: 'var(--color-accent)' }} />
            </div>
          </div>
          
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: caregiverStats.missedDoses > 0 ? '4px solid var(--color-danger)' : 'none' }}>
            <h4 className="text-muted" style={{ marginBottom: '0.5rem' }}>Missed Doses</h4>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: caregiverStats.missedDoses > 0 ? 'var(--color-danger)' : 'var(--color-text)' }}>
              {caregiverStats.missedDoses}
            </div>
            {caregiverStats.missedDoses > 0 && (
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', marginTop: '1rem', fontSize: '0.875rem' }}>
                <AlertCircle size={16} /> Needs attention
              </p>
            )}
          </div>
          
          <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', gridColumn: 'span 2' }}>
            <h4>Recent Alerts</h4>
            <ul style={{ marginTop: '1rem', listStyle: 'none' }}>
              <li style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Missed morning dose of Lisinopril</span>
                <span className="text-muted">2 hours ago</span>
              </li>
              <li style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Metformin running low (3 days left)</span>
                <span className="text-muted">Yesterday</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Caregiver;
