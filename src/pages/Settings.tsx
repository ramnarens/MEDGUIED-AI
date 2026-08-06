import React from 'react';
import { Settings as SettingsIcon, Globe, Bell, Shield, Moon, Eye } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const Settings = () => {
  const { theme, toggleTheme, language, setLanguage, t } = useAppContext();

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <SettingsIcon size={28} /> {t('settings_title')}
      </h2>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={20} /> {t('settings_appearance')}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <p style={{ fontWeight: 500 }}>{t('settings_dark_mode')}</p>
              <p className="text-muted text-sm">{t('settings_dark_desc')}</p>
            </div>
            <button onClick={toggleTheme} style={{ padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)', background: theme === 'dark' ? 'var(--color-primary)' : 'var(--color-surface)', color: theme === 'dark' ? 'white' : 'var(--color-text)', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
              {theme === 'dark' ? t('settings_enabled') : t('settings_disabled')}
            </button>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} /> {t('settings_lang_voice')}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontWeight: 500 }}>{t('settings_app_lang')}</p>
            <select value={language} onChange={(e) => setLanguage(e.target.value as any)} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }}>
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
