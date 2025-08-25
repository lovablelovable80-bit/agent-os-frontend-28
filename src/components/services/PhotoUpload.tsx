import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import {
  Camera,
  Upload,
  X,
  Download,
  Eye,
  QrCode,
  Smartphone,
  Check,
  Image as ImageIcon
} from "lucide-react";

interface PhotoUploadProps {
  onPhotosChange: (photos: File[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ onPhotosChange, maxPhotos = 5 }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Gerar URL único para upload
  useEffect(() => {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const uploadEndpoint = `${window.location.origin}/api/upload-photos/${sessionId}`;
    setUploadUrl(uploadEndpoint);
    
    // Gerar QR Code
    QRCode.toDataURL(uploadEndpoint, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    .then((url) => {
      setQrCodeUrl(url);
    })
    .catch((err) => {
      console.error('Erro ao gerar QR Code:', err);
    });
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleAddPhotos(files);
  };

  const handleAddPhotos = (newFiles: File[]) => {
    // Filtrar apenas imagens
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== newFiles.length) {
      toast({
        title: "Alguns arquivos foram ignorados",
        description: "Apenas arquivos de imagem são aceitos",
        variant: "destructive",
      });
    }

    // Verificar limite
    const totalPhotos = photos.length + imageFiles.length;
    if (totalPhotos > maxPhotos) {
      toast({
        title: "Limite excedido",
        description: `Máximo de ${maxPhotos} fotos permitido`,
        variant: "destructive",
      });
      return;
    }

    // Verificar tamanho dos arquivos (max 10MB por foto)
    const oversizedFiles = imageFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Arquivos muito grandes",
        description: "Cada foto deve ter no máximo 10MB",
        variant: "destructive",
      });
      return;
    }

    const updatedPhotos = [...photos, ...imageFiles];
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);

    toast({
      title: "Fotos adicionadas",
      description: `${imageFiles.length} foto(s) carregada(s) com sucesso`,
    });
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    handleAddPhotos(files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = 'qr-code-upload-fotos.png';
    link.href = qrCodeUrl;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Fotos da Ordem de Serviço
        </Label>
        <p className="text-sm text-muted-foreground">
          Adicione fotos do dispositivo, problema relatado, peças, etc. (máximo {maxPhotos} fotos)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Tradicional */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span className="font-medium">Upload Direto</span>
              </div>
              
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                  <p className="text-sm font-medium">Clique ou arraste fotos aqui</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WebP até 10MB cada</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Selecionar Arquivos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code para Celular */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                <span className="font-medium">Upload via Celular</span>
              </div>
              
              <div className="text-center space-y-3">
                {qrCodeUrl && (
                  <div className="inline-block p-3 bg-white rounded-lg border">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code para upload" 
                      className="w-32 h-32 mx-auto"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center justify-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Escaneie com seu celular
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tire fotos diretamente no local de atendimento
                  </p>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadQRCode}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Baixar QR
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(uploadUrl, '_blank')}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Visualizar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Fotos Carregadas */}
      {photos.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="font-medium">Fotos Carregadas</span>
                </div>
                <Badge variant="secondary">
                  {photos.length}/{maxPhotos}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <div className="mt-1 text-xs text-muted-foreground truncate">
                      {photo.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(photo.size)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}