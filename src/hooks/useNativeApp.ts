import { useState, useEffect } from 'react';
import { Device } from '@capacitor/device';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';

interface NativeAppInfo {
  isNativeApp: boolean;
  platform: 'web' | 'ios' | 'android';
  deviceInfo: any;
  isLoading: boolean;
}

export function useNativeApp(): NativeAppInfo {
  const [appInfo, setAppInfo] = useState<NativeAppInfo>({
    isNativeApp: false,
    platform: 'web',
    deviceInfo: null,
    isLoading: true,
  });

  useEffect(() => {
    const initializeNativeApp = async () => {
      try {
        const deviceInfo = await Device.getInfo();
        const isNative = deviceInfo.platform !== 'web';
        
        setAppInfo({
          isNativeApp: isNative,
          platform: deviceInfo.platform as 'web' | 'ios' | 'android',
          deviceInfo,
          isLoading: false,
        });

        // Configurações específicas para app nativo
        if (isNative) {
          // Configurar status bar
          if (deviceInfo.platform === 'ios' || deviceInfo.platform === 'android') {
            await StatusBar.setStyle({ style: Style.Light });
            await StatusBar.setBackgroundColor({ color: '#1a1a1a' });
          }

          // Listener para teclado
          Keyboard.addListener('keyboardWillShow', () => {
            document.body.classList.add('keyboard-open');
          });

          Keyboard.addListener('keyboardWillHide', () => {
            document.body.classList.remove('keyboard-open');
          });
        }
      } catch (error) {
        console.error('Erro ao inicializar app nativo:', error);
        setAppInfo({
          isNativeApp: false,
          platform: 'web',
          deviceInfo: null,
          isLoading: false,
        });
      }
    };

    initializeNativeApp();
  }, []);

  return appInfo;
}

// Hook para configurações específicas por plataforma
export function usePlatformConfig() {
  const { platform, isNativeApp } = useNativeApp();
  
  const config = {
    // Configurações de layout
    containerPadding: isNativeApp ? 'p-4' : 'p-6',
    cardSpacing: isNativeApp ? 'space-y-4' : 'space-y-6',
    buttonSize: isNativeApp ? 'h-12' : 'h-10',
    platform: platform,
    
    // Configurações de interação
    touchTarget: isNativeApp ? 'min-h-[44px]' : 'min-h-[40px]',
    fontSize: {
      base: isNativeApp ? 'text-base' : 'text-sm',
      large: isNativeApp ? 'text-lg' : 'text-base',
      title: isNativeApp ? 'text-xl' : 'text-lg',
    },
    
    // Configurações específicas por plataforma
    safePadding: {
      top: platform === 'ios' ? 'pt-safe-area-inset-top' : 'pt-4',
      bottom: platform === 'ios' ? 'pb-safe-area-inset-bottom' : 'pb-4',
    },
    
    // Navegação
    navigation: {
      type: isNativeApp ? 'bottom-tabs' : 'sidebar',
      height: isNativeApp ? 'h-16' : 'h-12',
    }
  };
  
  return config;
}