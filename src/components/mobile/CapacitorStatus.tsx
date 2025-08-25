import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Wifi, 
  Camera, 
  Video, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Settings,
  Download
} from 'lucide-react';
import { Device } from '@capacitor/device';
import { useToast } from '@/hooks/use-toast';

interface CapacitorStatusProps {
  className?: string;
}

export function CapacitorStatus({ className }: CapacitorStatusProps) {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isNative, setIsNative] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkDeviceCapabilities();
  }, []);

  const checkDeviceCapabilities = async () => {
    setIsLoading(true);
    try {
      const info = await Device.getInfo();
      setDeviceInfo(info);
      setIsNative(info.platform !== 'web');
    } catch (error) {
      console.error('Erro ao verificar capacidades do dispositivo:', error);
      setIsNative(false);
    } finally {
      setIsLoading(false);
    }
  };

  const capabilities = [
    {
      name: 'Gravação de Vídeo HD',
      available: isNative,
      icon: Video,
      description: 'Gravação nativa em alta qualidade'
    },
    {
      name: 'Câmera Nativa',
      available: isNative,
      icon: Camera,
      description: 'Acesso direto à câmera do dispositivo'
    },
    {
      name: 'Armazenamento Local',
      available: isNative,
      icon: Download,
      description: 'Cache local para uso offline'
    },
    {
      name: 'Notificações Push',
      available: isNative,
      icon: Settings,
      description: 'Notificações de status das OSs'
    }
  ];

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Verificando capacidades...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Status Mobile
          <Badge variant={isNative ? 'default' : 'secondary'}>
            {isNative ? 'App Nativo' : 'Navegador'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Info */}
        {deviceInfo && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Plataforma</p>
              <p className="text-muted-foreground">{deviceInfo.platform}</p>
            </div>
            <div>
              <p className="font-medium">Modelo</p>
              <p className="text-muted-foreground">{deviceInfo.model || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Capabilities */}
        <div className="space-y-3">
          <h4 className="font-medium">Funcionalidades Disponíveis</h4>
          {capabilities.map((capability) => (
            <div key={capability.name} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                capability.available 
                  ? 'bg-success/10 text-success' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {capability.available ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{capability.name}</p>
                <p className="text-xs text-muted-foreground">{capability.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Installation Guide */}
        {!isNative && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-sm">Para melhor experiência</p>
                <p className="text-xs text-muted-foreground">
                  Instale o app nativo para gravação de vídeo em qualidade superior e funcionalidades offline.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Instalação do App",
                      description: "Entre em contato para obter o link de download do app nativo",
                    });
                  }}
                >
                  Baixar App Nativo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkDeviceCapabilities}
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Atualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}