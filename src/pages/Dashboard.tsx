import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Pill, Bell, AlertCircle, TrendingUp, Calendar as CalendarIcon, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdherenceModal from '../components/AdherenceModal';

const Dashboard = () => {
  const { patient, schedule, caregiverStats, t, refills } = useAppContext();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>{t('dash_welcome')}, {patient.name}</h2>
          <p className="text-muted">{t('dash_overview')}</p>
        </div>
        <img src={patient.avatar} alt="Profile" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--color-primary)' }} />
      </div>

      <div className="summary-grid">
        {/* Quick Stats */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary-dark)' }}>
            <Pill size={24} />
          </div>
          <div>
            <h4 className="text-muted">{t('dash_meds_today')}</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{schedule.Morning.length + schedule.Night.length}</p>
          </div>
        </div>

        <div 
          className="glass hover-scale" 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s ease' }}
        >
          <div style={{ padding: '1rem', background: 'var(--color-accent)', opacity: 0.8, borderRadius: 'var(--radius-md)', color: 'white' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <h4 className="text-muted">{t('dash_adherence')}</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{caregiverStats.adherenceRate}%</p>
          </div>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: caregiverStats.missedDoses > 0 ? '4px solid var(--color-danger)' : 'none' }}>
          <div style={{ padding: '1rem', background: caregiverStats.missedDoses > 0 ? 'var(--color-danger)' : 'var(--color-background)', opacity: 0.8, borderRadius: 'var(--radius-md)', color: caregiverStats.missedDoses > 0 ? 'white' : 'var(--color-muted)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="text-muted">{t('dash_missed')}</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: caregiverStats.missedDoses > 0 ? 'var(--color-danger)' : 'var(--color-text)' }}>
              {caregiverStats.missedDoses}
            </p>
          </div>
        </div>
      </div>

      <div className="responsive-grid-2-1" style={{ gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bell size={20} /> {t('dash_next_reminder')}</h3>
              <button onClick={() => navigate('/reminders')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>{t('dash_view_all')}</button>
            </div>
            
            <div style={{ padding: '1.5rem', background: 'var(--color-background)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Metformin (500mg)</h4>
                  <p className="text-muted">Take one tablet after dinner</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>08:00 PM</p>
                  <p className="text-muted text-sm">in 2 hours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
             <h3 style={{ marginBottom: '1.5rem' }}>{t('dash_recent')}</h3>
             <button onClick={() => navigate('/scanner')} style={{ width: '100%', padding: '1rem', border: '2px dashed var(--color-primary)', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
               {t('dash_scan_new')}
             </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarIcon size={20} /> Upcoming Refills
              </h3>
              <span className="text-sm font-semibold text-muted">{refills.length} Medicines</span>
            </div>
            
            {refills.length === 0 ? (
              <p className="text-muted text-center" style={{ padding: '1rem 0' }}>No medicines found. Scan a prescription to add.</p>
            ) : (
              <ul style={{ listStyle: 'none', display: 'grid', gap: '1rem' }}>
                {refills.map(refill => {
                  let statusColor = 'var(--color-danger)';
                  let statusText = 'Critical';
                  if (refill.remainingPills > 10) {
                    statusColor = 'var(--color-accent)';
                    statusText = 'Good';
                  } else if (refill.remainingPills >= 5) {
                    statusColor = '#EAB308'; // Yellow
                    statusText = 'Order Soon';
                  } else if (refill.remainingPills >= 2) {
                    statusColor = 'var(--color-warning)'; // Orange/Warning
                    statusText = 'Low Stock';
                  }

                  return (
                    <li key={refill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                      <div>
                        <p style={{ fontWeight: 500 }}>{refill.medicineName} ({refill.dosage})</p>
                        <p className="text-muted text-sm">{refill.remainingPills} pills left</p>
                      </div>
                      <span style={{ padding: '0.25rem 0.5rem', background: statusColor, color: 'white', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>{statusText}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-danger)', color: 'white' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} /> {t('dash_emergency')}
            </h3>
            <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>{t('dash_emergency_desc')}</p>
            <button onClick={() => navigate('/emergency')} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-full)', border: 'none', background: 'white', color: 'var(--color-danger)', fontWeight: 700, cursor: 'pointer' }}>
              {t('dash_open_emergency')}
            </button>
          </div>
        </div>
      </div>

      <AdherenceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
export default Dashboard;
