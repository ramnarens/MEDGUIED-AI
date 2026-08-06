import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Clock, Info } from 'lucide-react';

interface AdherenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdherenceModal: React.FC<AdherenceModalProps> = ({ isOpen, onClose }) => {
  // Hardcoded for the prototype demo as requested
  const weekData = [
    { day: 'Monday', m: 'taken', a: 'taken', n: 'missed' },
    { day: 'Tuesday', m: 'taken', a: 'taken', n: 'taken' },
    { day: 'Wednesday', m: 'missed', a: 'taken', n: 'taken' },
    { day: 'Thursday', m: 'taken', a: 'upcoming', n: 'upcoming' },
    { day: 'Friday', m: 'none', a: 'none', n: 'none' },
    { day: 'Saturday', m: 'none', a: 'none', n: 'none' },
    { day: 'Sunday', m: 'none', a: 'none', n: 'none' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken': return <CheckCircle size={18} color="var(--color-accent)" />;
      case 'missed': return <XCircle size={18} color="var(--color-danger)" />;
      case 'upcoming': return <Clock size={18} color="var(--color-warning)" />;
      default: return <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-border)' }} />;
    }
  };

  const circumference = 2 * Math.PI * 40; // r=40
  const adherencePercent = 92;
  const strokeDashoffset = circumference - (adherencePercent / 100) * circumference;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} 
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ 
              background: 'var(--color-background)', 
              width: '100%', 
              maxWidth: '800px', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              borderRadius: 'var(--radius-xl)', 
              position: 'relative',
              boxShadow: 'var(--shadow-2xl)' 
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--color-background)', zIndex: 10 }}>
              <div>
                <h2>Weekly Adherence</h2>
                <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  Current Adherence: <strong style={{ color: 'var(--color-accent)' }}>{adherencePercent}%</strong>
                  <span style={{ fontSize: '0.875rem' }}>Excellent Progress 🎉</span>
                </p>
              </div>
              <button onClick={onClose} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={24} color="var(--color-text)" />
              </button>
            </div>

            <div style={{ padding: '2rem' }}>
              <div className="responsive-grid-2" style={{ marginBottom: '3rem' }}>
                {/* Summary & Chart */}
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1.5rem' }}>
                    <svg width="120" height="120" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border)" strokeWidth="12" />
                      <motion.circle 
                        cx="50" cy="50" r="40" fill="none" 
                        stroke="var(--color-accent)" strokeWidth="12" 
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{adherencePercent}%</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', textAlign: 'center' }}>
                    <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>24</div>
                      <div className="text-sm text-muted">Taken</div>
                    </div>
                    <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)' }}>2</div>
                      <div className="text-sm text-muted">Missed</div>
                    </div>
                  </div>
                </div>

                {/* AI Insights & Achievements */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Info size={20} color="var(--color-primary)" /> AI Insights
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <li style={{ padding: '0.75rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>"You never missed an afternoon dose this week."</li>
                      <li style={{ padding: '0.75rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>"You often miss medicines after dinner. Try setting an extra alarm."</li>
                    </ul>
                  </div>

                  <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Achievements</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={{ background: 'var(--color-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--color-warning)' }}>
                        <span>🔥</span> <span className="text-sm font-semibold">5-Day Streak</span>
                      </div>
                      <div style={{ background: 'var(--color-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5 }}>
                        <span style={{ filter: 'grayscale(100%)' }}>🏆</span> <span className="text-sm">Perfect Week</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Calendar */}
              <h3 style={{ marginBottom: '1.5rem' }}>Weekly Calendar</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {weekData.map((day, idx) => (
                  <motion.div 
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.05) }}
                    className="glass" 
                    style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}
                  >
                    <h4 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>{day.day}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {getStatusIcon(day.m)} <span>Morning</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {getStatusIcon(day.a)} <span>Afternoon</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {getStatusIcon(day.n)} <span>Night</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdherenceModal;
