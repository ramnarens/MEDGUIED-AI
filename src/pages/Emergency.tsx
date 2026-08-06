import React from 'react';
import { Phone, Navigation, AlertOctagon } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const Emergency = () => {
  const { patient } = useAppContext();

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '600px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <AlertOctagon size={64} style={{ color: 'var(--color-danger)', margin: '0 auto 1rem' }} />
        <h2>Emergency Information</h2>
        <p className="text-muted">Tap to call or share medical history immediately</p>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', border: '2px solid var(--color-danger)', marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', marginBottom: '1.5rem' }}>
          SOS Contacts
        </h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <button style={{ padding: '1.5rem', background: 'var(--color-danger)', color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', fontSize: '1.25rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Phone size={24} /> Call Ambulance (108)
          </button>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ flex: 1, padding: '1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <Phone size={24} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontWeight: 600 }}>Doctor</span>
              <span className="text-muted text-sm">Dr. Sharma</span>
            </button>
            <button style={{ flex: 1, padding: '1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <Phone size={24} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontWeight: 600 }}>{patient.emergencyContact.relation}</span>
              <span className="text-muted text-sm">{patient.emergencyContact.name}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Medical History</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            <span className="text-muted">Blood Group</span>
            <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>O+</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            <span className="text-muted">Allergies</span>
            <span style={{ fontWeight: 600 }}>Penicillin</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
            <span className="text-muted">Conditions</span>
            <span style={{ fontWeight: 600 }}>Type 2 Diabetes, Hypertension</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Emergency;
