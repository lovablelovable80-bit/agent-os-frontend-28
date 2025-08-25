import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Video,
  Camera,
  Square,
  Play,
  Pause,
  RotateCcw,
  Save,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Battery,
  Wifi,
  Volume2,
  Eye,
  Zap
} from "lucide-react";

interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  status: "ok" | "problem" | "unchecked";
  observation?: string;
}

interface DeviceInspectionProps {
  deviceType: string;
  onComplete: (data: {
    checklist: ChecklistItem[];
    videoBlob?: Blob;
    observations: string;
  }) => void;
}

const deviceChecklists = {
  smartphone: [
    { id: "screen", category: "Tela", label: "Tela sem rachaduras", status: "unchecked" as const },
    { id: "touch", category: "Tela", label: "Touch responsivo em toda área", status: "unchecked" as const },
    { id: "brightness", category: "Tela", label: "Brilho funcionando", status: "unchecked" as const },
    { id: "battery", category: "Bateria", label: "Carregamento normal", status: "unchecked" as const },
    { id: "battery_life", category: "Bateria", label: "Duração adequada", status: "unchecked" as const },
    { id: "speakers", category: "Áudio", label: "Alto-falantes funcionando", status: "unchecked" as const },
    { id: "microphone", category: "Áudio", label: "Microfone captando áudio", status: "unchecked" as const },
    { id: "headphone_jack", category: "Áudio", label: "Entrada de fone (se aplicável)", status: "unchecked" as const },
    { id: "front_camera", category: "Câmeras", label: "Câmera frontal", status: "unchecked" as const },
    { id: "rear_camera", category: "Câmeras", label: "Câmera traseira", status: "unchecked" as const },
    { id: "flash", category: "Câmeras", label: "Flash funcionando", status: "unchecked" as const },
    { id: "wifi", category: "Conectividade", label: "WiFi conectando", status: "unchecked" as const },
    { id: "bluetooth", category: "Conectividade", label: "Bluetooth funcionando", status: "unchecked" as const },
    { id: "mobile_data", category: "Conectividade", label: "Dados móveis", status: "unchecked" as const },
    { id: "charging_port", category: "Conectores", label: "Conector de carga", status: "unchecked" as const },
    { id: "sim_tray", category: "Conectores", label: "Bandeja do SIM", status: "unchecked" as const },
    { id: "buttons", category: "Botões", label: "Todos os botões respondem", status: "unchecked" as const },
    { id: "biometrics", category: "Biometria", label: "Sensor biométrico", status: "unchecked" as const },
    { id: "vibration", category: "Outros", label: "Vibração funcionando", status: "unchecked" as const },
    { id: "sensors", category: "Outros", label: "Sensores (giroscópio, proximidade)", status: "unchecked" as const }
  ],
  tablet: [
    { id: "screen", category: "Tela", label: "Tela sem rachaduras", status: "unchecked" as const },
    { id: "touch", category: "Tela", label: "Touch responsivo", status: "unchecked" as const },
    { id: "battery", category: "Bateria", label: "Carregamento normal", status: "unchecked" as const },
    { id: "speakers", category: "Áudio", label: "Alto-falantes", status: "unchecked" as const },
    { id: "cameras", category: "Câmeras", label: "Câmeras funcionando", status: "unchecked" as const },
    { id: "wifi", category: "Conectividade", label: "WiFi", status: "unchecked" as const },
    { id: "charging_port", category: "Conectores", label: "Conector de carga", status: "unchecked" as const },
    { id: "buttons", category: "Botões", label: "Botões físicos", status: "unchecked" as const }
  ],
  laptop: [
    { id: "screen", category: "Tela", label: "Tela sem defeitos", status: "unchecked" as const },
    { id: "keyboard", category: "Entrada", label: "Teclado completo", status: "unchecked" as const },
    { id: "trackpad", category: "Entrada", label: "Trackpad responsivo", status: "unchecked" as const },
    { id: "battery", category: "Bateria", label: "Carregamento/bateria", status: "unchecked" as const },
    { id: "ports", category: "Conectores", label: "Portas USB/outros", status: "unchecked" as const },
    { id: "audio", category: "Áudio", label: "Áudio funcionando", status: "unchecked" as const },
    { id: "webcam", category: "Câmera", label: "Webcam", status: "unchecked" as const },
    { id: "wifi", category: "Conectividade", label: "WiFi/Bluetooth", status: "unchecked" as const }
  ]
};

export function DeviceInspection({ deviceType, onComplete }: DeviceInspectionProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    deviceChecklists[deviceType as keyof typeof deviceChecklists] || deviceChecklists.smartphone
  );
  const [observations, setObservations] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const updateChecklistItem = (id: string, status: "ok" | "problem", observation?: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status, observation }
        : item
    ));
  };

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment" // Usar câmera traseira se disponível
        }, 
        audio: true 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const recorder = new MediaRecorder(mediaStream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm; codecs=vp9,opus') 
          ? 'video/webm; codecs=vp9,opus'
          : 'video/webm'
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedVideo(blob);
        setVideoUrl(URL.createObjectURL(blob));
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Timer para gravação
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
      }, 300000); // Máximo 5 minutos

      toast({
        title: "Gravação iniciada",
        description: "Mostre todos os detalhes do aparelho durante a gravação"
      });
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar a câmera",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingTime(0);
      
      // Parar todas as tracks do stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      toast({
        title: "Gravação finalizada",
        description: "Vídeo de entrada salvo com sucesso"
      });
    }
  };

  const resetRecording = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setRecordedVideo(null);
    setVideoUrl(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const checkedItems = checklist.filter(item => item.status !== "unchecked").length;
    return (checkedItems / checklist.length) * 100;
  };

  const getStatusIcon = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "problem":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4 border border-muted-foreground rounded" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "tela":
        return <Eye className="h-4 w-4" />;
      case "bateria":
        return <Battery className="h-4 w-4" />;
      case "áudio":
        return <Volume2 className="h-4 w-4" />;
      case "conectividade":
        return <Wifi className="h-4 w-4" />;
      case "conectores":
        return <Zap className="h-4 w-4" />;
      default:
        return <Smartphone className="h-4 w-4" />;
    }
  };

  const groupedChecklist = checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const handleComplete = () => {
    const incompleteItems = checklist.filter(item => item.status === "unchecked");
    
    if (incompleteItems.length > 0) {
      toast({
        title: "Inspeção incompleta",
        description: `${incompleteItems.length} itens ainda não foram verificados`,
        variant: "destructive"
      });
      return;
    }

    onComplete({
      checklist,
      videoBlob: recordedVideo || undefined,
      observations
    });

    toast({
      title: "Inspeção concluída",
      description: "Dados salvos com sucesso"
    });
  };

  return (
    <div className="space-y-6">
      {/* Video Recording Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Vídeo de Entrada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
            {!recordedVideo ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={videoUrl || undefined}
                controls
                className="w-full h-full object-cover"
              />
            )}
            
            {isRecording && (
              <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {formatTime(recordingTime)}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            {!recordedVideo && !isRecording && (
              <Button onClick={startRecording} className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Iniciar Gravação
              </Button>
            )}
            
            {isRecording && (
              <Button onClick={stopRecording} variant="destructive" className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Parar Gravação
              </Button>
            )}
            
            {recordedVideo && (
              <Button onClick={resetRecording} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Gravar Novamente
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Checklist de Inspeção</CardTitle>
            <div className="text-sm text-muted-foreground">
              {Math.round(getProgress())}% concluído
            </div>
          </div>
          <Progress value={getProgress()} className="w-full" />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-4">
              {Object.entries(groupedChecklist).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2 font-medium text-sm">
                    {getCategoryIcon(category)}
                    {category}
                  </div>
                  <div className="space-y-2 ml-6">
                    {items.map((item) => (
                      <div key={item.id} className="space-y-2 p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            {item.label}
                          </Label>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant={item.status === "ok" ? "default" : "outline"}
                              onClick={() => updateChecklistItem(item.id, "ok")}
                              className="h-8 px-3"
                            >
                              OK
                            </Button>
                            <Button
                              size="sm"
                              variant={item.status === "problem" ? "destructive" : "outline"}
                              onClick={() => updateChecklistItem(item.id, "problem")}
                              className="h-8 px-3"
                            >
                              Problema
                            </Button>
                          </div>
                        </div>
                        
                        {item.status === "problem" && (
                          <Textarea
                            placeholder="Descreva o problema encontrado..."
                            value={item.observation || ""}
                            onChange={(e) => updateChecklistItem(item.id, "problem", e.target.value)}
                            className="text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Observations */}
      <Card>
        <CardHeader>
          <CardTitle>Observações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Adicione observações gerais sobre o estado do aparelho, histórico relatado pelo cliente, etc..."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Inspeção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">
                {checklist.filter(item => item.status === "ok").length}
              </div>
              <div className="text-sm text-muted-foreground">Itens OK</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">
                {checklist.filter(item => item.status === "problem").length}
              </div>
              <div className="text-sm text-muted-foreground">Problemas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">
                {checklist.filter(item => item.status === "unchecked").length}
              </div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
          </div>

          <Button 
            onClick={handleComplete} 
            className="w-full"
            disabled={checklist.some(item => item.status === "unchecked")}
          >
            <Save className="h-4 w-4 mr-2" />
            Finalizar Inspeção
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}