import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Simplification = () => {
  const navigate = useNavigate();
  const { medicines, scannedImage } = useAppContext();
  const med = medicines[0];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '2rem' }}>AI Simplification</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)', textAlign: 'center' }}>
          <h4 className="text-muted" style={{ marginBottom: '1rem' }}>Original Prescription</h4>
          {scannedImage ? (
             <img src={scannedImage} alt="Scanned prescription" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
          ) : (
            <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', padding: '1rem', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
              Tab {med.genericName} {med.dosage} BD PC
            </div>
          )}
        </div>
        
        <ArrowRight size={32} style={{ color: 'var(--color-primary)' }} />
        
        <div className="glass animate-slide-up" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', border: '2px solid var(--color-primary)' }}>
          <h4 style={{ color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={24} /> Simplified Instructions
          </h4>
          <h3 style={{ marginBottom: '0.5rem' }}>{med.genericName} ({med.brandName})</h3>
          <p className="text-lg" style={{ fontWeight: 600 }}>{med.instructions}</p>
        </div>
      </div>

      <div style={{ marginTop: '3rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--color-warning)' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={20} color="var(--color-warning)" /> Important Warnings
          </h4>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text)' }}>
            {med.warnings.map((w, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{w}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button onClick={() => navigate('/schedule-builder')} style={{ padding: '0.75rem 2rem', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-full)', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Create Schedule & Reminders
        </button>
      </div>
    </div>
  );
};
export default Simplification;
