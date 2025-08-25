import { useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export function useQRCode() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async (
    text: string, 
    options: QRCodeOptions = {}
  ): Promise<string> => {
    setIsGenerating(true);
    
    try {
      const defaultOptions = {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        ...options
      };

      const qrCodeUrl = await QRCode.toDataURL(text, defaultOptions);
      return qrCodeUrl;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMobileVideoUrl = (osNumber?: string, sessionId?: string) => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    
    if (osNumber) params.append('os', osNumber);
    if (sessionId) params.append('session', sessionId);
    
    const queryString = params.toString();
    return `${baseUrl}/video-recording-mobile${queryString ? `?${queryString}` : ''}`;
  };

  const generateMobilePhotoUrl = (sessionId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/upload-photos/${sessionId}`;
  };

  return {
    generateQRCode,
    generateMobileVideoUrl,
    generateMobilePhotoUrl,
    isGenerating
  };
}