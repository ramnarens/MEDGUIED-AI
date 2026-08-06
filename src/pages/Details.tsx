import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const Details = () => {
  const { medicines } = useAppContext();
  const med = medicines[0];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <div className="glass" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <img src={med.photo} alt={med.genericName} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ marginBottom: '0.5rem' }}>{med.genericName}</h2>
              <p className="text-muted text-lg">Brand: {med.brandName}</p>
            </div>
            <span style={{ padding: '0.5rem 1rem', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              {med.dosage}
            </span>
          </div>

          <div className="responsive-grid-2" style={{ gap: '1.5rem', marginTop: '2rem' }}>
            <div>
              <h4 className="text-muted">Purpose</h4>
              <p style={{ marginTop: '0.25rem', fontWeight: 500 }}>{med.purpose}</p>
            </div>
            <div>
              <h4 className="text-muted">Food Instructions</h4>
              <p style={{ marginTop: '0.25rem', fontWeight: 500 }}>{med.food}</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
            <h4>Simplified Instructions</h4>
            <p style={{ marginTop: '0.5rem', fontSize: '1.125rem' }}>{med.instructions}</p>
          </div>

          <div className="responsive-grid-2" style={{ gap: '1.5rem', marginTop: '2rem' }}>
            <div>
              <h4 style={{ color: 'var(--color-warning)', marginBottom: '0.5rem' }}>Side Effects</h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {med.sideEffects.map((effect, i) => <li key={i}>{effect}</li>)}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--color-danger)', marginBottom: '0.5rem' }}>Warnings</h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {med.warnings.map((warning, i) => <li key={i}>{warning}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Details;
