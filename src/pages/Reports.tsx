import React from 'react';
import { Download, Share2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const Reports = () => {
  const { caregiverStats } = useAppContext();

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Adherence Reports</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ padding: '0.5rem 1rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Share2 size={18} /> Share
          </button>
          <button style={{ padding: '0.5rem 1rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Monthly Overview</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '200px', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', gap: '1rem' }}>
          {[80, 85, 90, 88, 92, 95, 92].map((height, i) => (
            <div key={i} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '100%', background: 'var(--color-primary)', height: `${height}%`, borderRadius: '4px 4px 0 0', opacity: i === 6 ? 1 : 0.6 }} />
              <span className="text-muted text-sm">W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="responsive-grid-2" style={{ gap: '1.5rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h4 className="text-muted">Total Doses Taken</h4>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent)', marginTop: '0.5rem' }}>142</p>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h4 className="text-muted">Current Adherence Rate</h4>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.5rem' }}>{caregiverStats.adherenceRate}%</p>
        </div>
      </div>
    </div>
  );
};
export default Reports;
