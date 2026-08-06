import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Simplification = () => {
  const navigate = useNavigate();
  const { dynamicMedicines, medicines, scannedImage } = useAppContext();
  
  // Use dynamic medicines if available, fallback to mock for safety if bypassing scanner
  const displayMeds = dynamicMedicines.length > 0 ? dynamicMedicines : medicines;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '2rem' }}>AI Simplification</h2>
      
      <div className="responsive-grid-3-auto" style={{ gap: '2rem', alignItems: 'center' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)', textAlign: 'center', height: 'fit-content' }}>
          <h4 className="text-muted" style={{ marginBottom: '1rem' }}>Original Prescription</h4>
          {scannedImage ? (
             <img src={scannedImage} alt="Scanned prescription" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} />
          ) : (
            <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', padding: '1rem', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
              No image scanned.
            </div>
          )}
        </div>
        
        <div style={{ display: 'none' }}>
          <ArrowRight size={32} style={{ color: 'var(--color-primary)' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {displayMeds.map((med: any, idx: number) => (
            <div key={med.id || idx} className="glass animate-slide-up" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', border: '2px solid var(--color-primary)', animationDelay: `${idx * 0.1}s` }}>
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={24} /> Simplified Instructions
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <div className="text-sm text-muted">Medicine</div>
                  <h3 style={{ marginBottom: '0' }}>{med.medicine || med.genericName} {med.brand ? `(${med.brand})` : ''}</h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div className="text-sm text-muted">Dosage</div>
                    <div style={{ fontWeight: 600 }}>{med.dosage}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted">Timing</div>
                    <div style={{ fontWeight: 600 }}>{med.timing}</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                  <div className="text-sm text-muted" style={{ marginBottom: '0.25rem' }}>Instruction</div>
                  <p className="text-lg" style={{ fontWeight: 600 }}>{med.instruction || med.instructions}</p>
                </div>

                {(med.notes || med.warnings) && (
                  <div style={{ marginTop: '1rem', padding: '1rem', borderLeft: '4px solid var(--color-warning)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '1rem' }}>
                      <AlertTriangle size={18} color="var(--color-warning)" /> Note / Warning
                    </h4>
                    <p style={{ fontSize: '0.9rem' }}>{med.notes || (med.warnings ? med.warnings.join(', ') : '')}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
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
