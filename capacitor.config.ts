import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.66e7fe6c2e2a47fa9146003e6c345a0c',
  appName: 'AgentOS Mobile',
  webDir: 'dist',
  server: {
    url: 'https://66e7fe6c-2e2a-47fa-9146-003e6c345a0c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'microphone'],
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#1a1a1a',
    },
    Keyboard: {
      resize: 'body',
    },
  },
};

export default config;