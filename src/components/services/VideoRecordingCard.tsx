import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Smartphone, 
  QrCode, 
  ExternalLink,
  Camera,
  Upload,
  Clock,
  FileVideo
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import QRCode from "qrcode";

interface VideoRecordingCardProps {
  osNumber?: string;
  className?: string;
}

export function VideoRecordingCard({ osNumber, className }: VideoRecordingCardProps) {
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showQrCode, setShowQrCode] = useState(false);

  const generateQrCode = async () => {
    try {
      // Generate QR code for mobile video recording
      const recordingUrl = `${window.location.origin}/video-recording-mobile${osNumber ? `?os=${osNumber}` : ''}`;
      const qrUrl = await QRCode.toDataURL(recordingUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
      setShowQrCode(true);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const handleDesktopRecording = () => {
    navigate('/video-recording-mobile');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Gravação de Vídeo
          {osNumber && (
            <Badge variant="outline">OS #{osNumber}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showQrCode ? (
          <>
            <p className="text-sm text-muted-foreground">
              Grave vídeos do dispositivo e problema para documentação da ordem de serviço
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex-col h-auto p-4 space-y-2"
                onClick={generateQrCode}
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Mobile Nativo</p>
                  <p className="text-xs text-muted-foreground">Qualidade superior</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="flex-col h-auto p-4 space-y-2"
                onClick={handleDesktopRecording}
              >
                <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Navegador</p>
                  <p className="text-xs text-muted-foreground">Acesso rápido</p>
                </div>
              </Button>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <FileVideo className="w-4 h-4" />
                Funcionalidades Avançadas
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Gravação em HD/FHD com áudio</li>
                <li>• Múltiplos ângulos do problema</li>
                <li>• Armazenamento local e sincronização</li>
                <li>• Integração automática com OS</li>
                <li>• Templates de gravação por categoria</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="mx-auto w-48">
              <img 
                src={qrCodeUrl} 
                alt="QR Code para gravação mobile" 
                className="w-full h-auto border rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <QrCode className="w-4 h-4" />
                <span className="text-sm font-medium">Escaneie com o celular</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Abra a câmera do seu celular e aponte para o QR Code
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQrCode(false)}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleDesktopRecording}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Abrir no Navegador
              </Button>
            </div>

            <div className="bg-primary/5 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-primary" />
                <div className="text-xs space-y-1">
                  <p className="font-medium">Próximas funcionalidades:</p>
                  <p className="text-muted-foreground">
                    Com a integração Supabase: upload automático, backup na nuvem, 
                    compartilhamento seguro com clientes
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}