import { useState, useEffect } from 'react';

interface PersonalizationSettings {
  darkMode: boolean;
  primaryColor: string;
  sidebarCollapsed: boolean;
  animations: boolean;
  notifications: boolean;
  soundEffects: boolean;
  autoSave: boolean;
  compactMode: boolean;
  fontSize: number[];
  language: string;
}

const defaultSettings: PersonalizationSettings = {
  darkMode: false,
  primaryColor: 'blue',
  sidebarCollapsed: false,
  animations: true,
  notifications: true,
  soundEffects: false,
  autoSave: true,
  compactMode: false,
  fontSize: [14],
  language: 'pt-BR',
};

const colorThemes = {
  blue: {
    primary: '214 84% 56%',
    primaryGlow: '214 100% 70%',
    accent: '204 100% 60%',
  },
  green: {
    primary: '142 76% 36%',
    primaryGlow: '142 76% 50%',
    accent: '120 100% 40%',
  },
  purple: {
    primary: '262 83% 58%',
    primaryGlow: '262 83% 70%',
    accent: '280 100% 60%',
  },
  orange: {
    primary: '25 95% 53%',
    primaryGlow: '25 95% 65%',
    accent: '35 100% 55%',
  },
  red: {
    primary: '0 84% 60%',
    primaryGlow: '0 84% 70%',
    accent: '10 100% 60%',
  },
  teal: {
    primary: '173 58% 39%',
    primaryGlow: '173 58% 50%',
    accent: '180 100% 40%',
  },
};

export function usePersonalization() {
  const [settings, setSettings] = useState<PersonalizationSettings>(() => {
    const saved = localStorage.getItem('agentOS-personalization');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Aplicar tema escuro/claro
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Aplicar cores primárias
  useEffect(() => {
    const root = document.documentElement;
    const theme = colorThemes[settings.primaryColor as keyof typeof colorThemes];
    
    if (theme) {
      root.style.setProperty('--primary', theme.primary);
      root.style.setProperty('--primary-glow', theme.primaryGlow);
      root.style.setProperty('--accent', theme.accent);
      
      // Atualizar sidebar também
      root.style.setProperty('--sidebar-primary', theme.primary);
      root.style.setProperty('--sidebar-ring', theme.primary);
    }
  }, [settings.primaryColor]);

  // Aplicar tamanho da fonte
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${settings.fontSize[0]}px`;
  }, [settings.fontSize]);

  // Aplicar animações
  useEffect(() => {
    const root = document.documentElement;
    if (!settings.animations) {
      root.style.setProperty('--transition-smooth', 'none');
      root.style.setProperty('--transition-fast', 'none');
    } else {
      root.style.setProperty('--transition-smooth', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
      root.style.setProperty('--transition-fast', 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)');
    }
  }, [settings.animations]);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('agentOS-personalization', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof PersonalizationSettings>(
    key: K,
    value: PersonalizationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    // Resetar CSS customizado
    const root = document.documentElement;
    root.classList.remove('dark');
    const defaultTheme = colorThemes.blue;
    root.style.setProperty('--primary', defaultTheme.primary);
    root.style.setProperty('--primary-glow', defaultTheme.primaryGlow);
    root.style.setProperty('--accent', defaultTheme.accent);
    root.style.setProperty('--sidebar-primary', defaultTheme.primary);
    root.style.setProperty('--sidebar-ring', defaultTheme.primary);
    root.style.fontSize = '14px';
    root.style.setProperty('--transition-smooth', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
    root.style.setProperty('--transition-fast', 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)');
  };

  return {
    settings,
    updateSetting,
    resetSettings,
    colorThemes,
  };
}