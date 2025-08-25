import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ModernCard, ModernSection } from "@/components/mobile/ModernCard";
import { ModernHeader } from "@/components/mobile/ModernHeader";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Upload,
  X,
  Check,
  Smartphone,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles,
  Zap
} from "lucide-react";

export default function PhotoUploadMobile() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleAddPhotos(files);
  };

  const handleAddPhotos = (newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== newFiles.length) {
      toast({
        title: "Alguns arquivos foram ignorados",
        description: "Apenas arquivos de imagem são aceitos",
        variant: "destructive",
      });
    }

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

    toast({
      title: "Fotos adicionadas",
      description: `${imageFiles.length} foto(s) carregada(s) com sucesso`,
    });
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
  };

  const handleUpload = async () => {
    if (photos.length === 0) {
      toast({
        title: "Nenhuma foto selecionada",
        description: "Adicione pelo menos uma foto antes de enviar",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Simular upload
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadComplete(true);
      toast({
        title: "Fotos enviadas com sucesso!",
        description: `${photos.length} foto(s) foram enviadas para a ordem de serviço`,
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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

  if (uploadComplete) {
    return (
      <div className="full-screen-mobile bg-gradient-subtle flex items-center justify-center p-mobile">
        <ModernCard variant="elevated" className="w-full max-w-md text-center">
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-3xl flex items-center justify-center animate-bounce-gentle">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-mobile-2xl font-bold mb-2">Fotos Enviadas!</h2>
              <p className="text-muted-foreground text-mobile-base">
                {photos.length} foto(s) foram enviadas com sucesso para a ordem de serviço.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="w-full mobile-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </ModernCard>
      </div>
    );
  }

  return (
    <div className="full-screen-mobile bg-gradient-subtle">
      <ModernHeader
        title="Upload de Fotos"
        subtitle="Capture imagens da ordem de serviço"
        showBack={true}
        variant="gradient"
      />
      
      <div className="p-mobile space-y-mobile">
        {/* Upload Area */}
        <ModernSection 
          title="Adicionar Fotos"
          subtitle="Tire fotos ou selecione da galeria"
          icon={Camera}
        >
          <ModernCard 
            variant="glass" 
            className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-mobile-lg font-bold mb-2">Capturar Fotos</h3>
              <p className="text-muted-foreground text-mobile-sm mb-4">
                Toque aqui para abrir a câmera ou galeria
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const input = fileInputRef.current;
                    if (input) {
                      input.setAttribute('capture', 'environment');
                      input.click();
                    }
                  }}
                  className="mobile-button"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Câmera
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const input = fileInputRef.current;
                    if (input) {
                      input.removeAttribute('capture');
                      input.click();
                    }
                  }}
                  className="mobile-button"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Galeria
                </Button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
          </ModernCard>
        </ModernSection>

        {/* Lista de Fotos */}
        {photos.length > 0 && (
          <ModernSection 
            title="Fotos Selecionadas"
            subtitle={`${photos.length} foto(s) prontas para envio`}
            icon={Sparkles}
          >
            <ModernCard>
              <div className="grid grid-cols-2 gap-mobile mb-6">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group animate-scale-in">
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-border/20 bg-muted">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 shadow-lg"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="mt-2 text-center">
                      <span className="text-mobile-xs text-muted-foreground">
                        {formatFileSize(photo.size)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mobile-button bg-gradient-primary h-14 text-mobile-base font-semibold"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando fotos...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-3" />
                    Enviar {photos.length} Foto(s)
                  </>
                )}
              </Button>
            </ModernCard>
          </ModernSection>
        )}

        {/* Tips Section */}
        {photos.length === 0 && (
          <ModernSection title="Dicas de Fotografia">
            <ModernCard variant="minimal">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-mobile-sm text-muted-foreground">
                    Tire fotos com boa iluminação para melhor qualidade
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-mobile-sm text-muted-foreground">
                    Capture diferentes ângulos do problema
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-mobile-sm text-muted-foreground">
                    Inclua fotos do número de série se visível
                  </p>
                </div>
              </div>
            </ModernCard>
          </ModernSection>
        )}
      </div>
    </div>
  );
}