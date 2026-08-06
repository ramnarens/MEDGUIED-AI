import React from 'react';
import { Users, Activity, FileText } from 'lucide-react';

const Admin = () => {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary-dark)' }}>
            <Users size={24} />
          </div>
          <div>
            <h4 className="text-muted">Total Patients</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>1,248</p>
          </div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--color-secondary)', opacity: 0.8, borderRadius: 'var(--radius-md)', color: 'white' }}>
            <Activity size={24} />
          </div>
          <div>
            <h4 className="text-muted">System Health</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>99.9% Uptime</p>
          </div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--color-warning)', opacity: 0.8, borderRadius: 'var(--radius-md)', color: 'white' }}>
            <FileText size={24} />
          </div>
          <div>
            <h4 className="text-muted">Prescriptions Scanned</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>8,432</p>
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent OCR Logs</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '1rem 0' }}>Time</th>
              <th>Patient ID</th>
              <th>Confidence Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {['10:42 AM', '10:38 AM', '10:15 AM'].map((time, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 0', color: 'var(--color-muted)' }}>{time}</td>
                <td style={{ fontWeight: 500 }}>P-{Math.floor(Math.random() * 9000) + 1000}</td>
                <td>{90 + Math.floor(Math.random() * 9)}%</td>
                <td>
                  <span style={{ padding: '0.25rem 0.75rem', background: 'var(--color-accent)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: '0.875rem' }}>
                    Success
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Admin;
