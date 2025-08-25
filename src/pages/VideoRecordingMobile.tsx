import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCapacitorVideo } from "@/hooks/useCapacitorVideo";
import {
  Video,
  Camera,
  Play,
  Pause,
  Square,
  Upload,
  Trash2,
  ArrowLeft,
  Smartphone,
  Clock,
  FileVideo,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VideoRecordingMobile() {
  const [selectedQuality, setSelectedQuality] = useState<'HD' | 'FHD'>('HD');
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    recordings,
    isRecording,
    isNativeCapable,
    recordVideo,
    removeVideo,
    uploadVideo,
    checkNativeCapability,
  } = useCapacitorVideo();

  useEffect(() => {
    checkNativeCapability();
  }, [checkNativeCapability]);

  // Timer for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = async () => {
    await recordVideo();
  };

  const handleUploadAll = async () => {
    if (recordings.length === 0) {
      toast({
        title: "Nenhum vídeo para enviar",
        description: "Grave pelo menos um vídeo antes de enviar",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const video of recordings) {
        await uploadVideo(video);
      }
      
      setUploadComplete(true);
      toast({
        title: "Vídeos enviados!",
        description: `${recordings.length} vídeo(s) enviados para a ordem de serviço`,
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold">Vídeos Enviados!</h2>
            <p className="text-muted-foreground">
              {recordings.length} vídeo(s) foram enviados com sucesso para a ordem de serviço.
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/services')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Serviços
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => window.close()}
                className="w-full"
              >
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Gravação de Vídeo - OS
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/services')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Grave vídeos do dispositivo e problema para anexar à ordem de serviço
            </p>
            {!isNativeCapable && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <p className="text-sm text-warning-foreground">
                  <Smartphone className="w-4 h-4 inline mr-1" />
                  Para melhor qualidade, use o app mobile nativo
                </p>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Quality Settings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Configurações de Gravação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Qualidade do Vídeo</label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={selectedQuality === 'HD' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedQuality('HD')}
                >
                  HD (720p)
                </Button>
                <Button
                  variant={selectedQuality === 'FHD' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedQuality('FHD')}
                >
                  FHD (1080p)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recording Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              {/* Recording Status */}
              {isRecording && (
                <div className="space-y-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full mx-auto animate-pulse"></div>
                  <div className="text-lg font-mono">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {formatTime(recordingTime)}
                  </div>
                  <p className="text-sm text-muted-foreground">Gravando...</p>
                </div>
              )}

              {/* Camera Preview Area */}
              <div className="aspect-video bg-muted border-2 border-dashed rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Camera className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isRecording ? 'Gravando...' : 'Toque em gravar para iniciar'}
                  </p>
                </div>
              </div>

              {/* Recording Button */}
              <Button
                size="lg"
                className={`w-20 h-20 rounded-full ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-primary'
                }`}
                onClick={handleStartRecording}
                disabled={isRecording}
              >
                {isRecording ? (
                  <Square className="w-8 h-8 text-white" />
                ) : (
                  <Video className="w-8 h-8 text-white" />
                )}
              </Button>

              <p className="text-sm text-muted-foreground">
                {isRecording ? 'Toque para parar' : 'Toque para gravar'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recorded Videos */}
        {recordings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Vídeos Gravados</span>
                <Badge variant="secondary">
                  {recordings.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {recordings.map((video, index) => (
                  <div key={video.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <FileVideo className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Vídeo {index + 1}</p>
                      <p className="text-xs text-muted-foreground">
                        {video.createdAt.toLocaleTimeString()} • {formatFileSize(video.size)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVideo(video.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full bg-gradient-primary"
                onClick={handleUploadAll}
                disabled={recordings.length === 0}
              >
                <Upload className="w-4 h-4 mr-2" />
                Enviar {recordings.length} Vídeo(s)
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <h4 className="font-medium text-foreground">Dicas para melhor gravação:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Use modo paisagem para melhor enquadramento</li>
                <li>Mantenha o dispositivo estável durante a gravação</li>
                <li>Grave de diferentes ângulos do problema</li>
                <li>Fale alto e claro ao descrever o defeito</li>
                <li>Certifique-se de ter boa iluminação</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}