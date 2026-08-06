import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { Menu, X, Home, Scan, FileText, Bell, Mic, Users, AlertOctagon, Settings as SettingsIcon } from 'lucide-react';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Scanner from './pages/Scanner';
import Simplification from './pages/Simplification';
import Reminders from './pages/Reminders';
import VoiceAssistant from './pages/VoiceAssistant';
import Caregiver from './pages/Caregiver';
import Details from './pages/Details';
import Reports from './pages/Reports';
import Emergency from './pages/Emergency';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import ScheduleBuilder from './pages/ScheduleBuilder';

const Navigation = () => {
  const { theme, toggleTheme, t } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  
  if (isHome) {
    return (
      <header className="glass" style={{ padding: '1rem 0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: 'var(--radius-md)' }}></div>
            MedGuide AI
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/login" style={{ fontWeight: 600 }}>{t('nav_login')}</Link>
            <button onClick={toggleTheme} style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'var(--color-surface)', cursor: 'pointer' }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>
    );
  }

  const navLinks = [
    { name: t('nav_dashboard'), path: '/dashboard', icon: <Home size={20} /> },
    { name: t('nav_scan'), path: '/scanner', icon: <Scan size={20} /> },
    { name: t('nav_reminders'), path: '/reminders', icon: <Bell size={20} /> },
    { name: t('nav_voice'), path: '/voice', icon: <Mic size={20} /> },
    { name: t('nav_caregiver'), path: '/caregiver', icon: <Users size={20} /> },
    { name: t('nav_emergency'), path: '/emergency', icon: <AlertOctagon size={20} /> },
    { name: t('nav_settings'), path: '/settings', icon: <SettingsIcon size={20} /> }
  ];

  return (
    <>
      <header className="glass" style={{ padding: '1rem 0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setIsOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}>
              <Menu size={24} />
            </button>
            <Link to="/dashboard" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>MedGuide AI</Link>
          </div>
          <button onClick={toggleTheme} style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'var(--color-surface)', cursor: 'pointer' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} onClick={() => setIsOpen(false)}>
          <div 
            style={{ width: '280px', height: '100%', background: 'var(--color-background)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
            onClick={e => e.stopPropagation()}
            className="animate-slide-up"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>{t('nav_menu')}</span>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}>
                <X size={24} />
              </button>
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: location.pathname === link.path ? 'var(--color-primary-light)' : 'transparent', color: location.pathname === link.path ? 'var(--color-primary-dark)' : 'var(--color-text)', fontWeight: location.pathname === link.path ? 600 : 400 }}
                >
                  {link.icon} {link.name}
                </Link>
              ))}
            </nav>
            
            <div style={{ marginTop: 'auto' }}>
              <Link to="/admin" onClick={() => setIsOpen(false)} className="text-muted" style={{ display: 'block', padding: '1rem 0' }}>{t('nav_admin')}</Link>
              <button onClick={() => { setIsOpen(false); navigate('/'); }} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', background: 'transparent', cursor: 'pointer' }}>
                {t('nav_logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const AppContent = () => {
  return (
    <Router>
      <Navigation />
      <main style={{ flex: 1, minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/simplification" element={<Simplification />} />
          <Route path="/schedule-builder" element={<ScheduleBuilder />} />
          <Route path="/details" element={<Details />} />
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/caregiver" element={<Caregiver />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
