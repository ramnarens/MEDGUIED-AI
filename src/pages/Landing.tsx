import React from 'react';

const Landing = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 className="animate-slide-up" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
        Understand Medicines. Never Miss a Dose.
      </h1>
      <p className="animate-fade-in text-lg text-muted" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
        Scan prescriptions, receive reminders, hear instructions in your language, and keep your loved ones safe.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <a href="/login" style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-full)', fontWeight: '600' }}>
          Start Scanning
        </a>
      </div>
    </div>
  );
};
export default Landing;
