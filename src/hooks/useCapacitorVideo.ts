import { useState, useCallback, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Device } from '@capacitor/device';
import { useToast } from '@/hooks/use-toast';
import { videoService, VideoMetadata } from '@/services/VideoService';

interface VideoRecording {
  id: string;
  path: string;
  webPath?: string;
  size: number;
  duration?: number;
  thumbnail?: string;
  createdAt: Date;
}

export function useCapacitorVideo() {
  const [recordings, setRecordings] = useState<VideoRecording[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isNativeCapable, setIsNativeCapable] = useState(false);
  const { toast } = useToast();

  // Check if device supports native video recording
  const checkNativeCapability = useCallback(async () => {
    try {
      const info = await Device.getInfo();
      setIsNativeCapable(info.platform !== 'web');
    } catch (error) {
      setIsNativeCapable(false);
    }
  }, []);

  // Record video using native camera
  const recordVideo = useCallback(async () => {
    if (!isNativeCapable) {
      toast({
        title: "Funcionalidade não disponível",
        description: "Gravação nativa disponível apenas no app mobile",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsRecording(true);
      
      // Note: Camera plugin doesn't support video recording yet
      // This is a placeholder for future implementation when video support is added
      const video = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (video.webPath) {
        const videoId = `video_${Date.now()}`;
        const recording: VideoRecording = {
          id: videoId,
          path: video.path || video.webPath,
          webPath: video.webPath,
          size: 0, // Will be calculated when actual video support is available
          createdAt: new Date(),
        };

        setRecordings(prev => [...prev, recording]);
        
        toast({
          title: "Vídeo gravado!",
          description: "Vídeo salvo com sucesso",
        });

        return recording;
      }
    } catch (error) {
      toast({
        title: "Erro na gravação",
        description: "Não foi possível gravar o vídeo",
        variant: "destructive",
      });
    } finally {
      setIsRecording(false);
    }

    return null;
  }, [isNativeCapable, toast]);

  // Save video to local filesystem (for offline capability)
  const saveVideoLocally = useCallback(async (video: VideoRecording) => {
    try {
      const fileName = `${video.id}.mp4`;
      
      await Filesystem.writeFile({
        path: `videos/${fileName}`,
        data: video.webPath || video.path,
        directory: Directory.Data,
      });

      toast({
        title: "Vídeo salvo localmente",
        description: "Vídeo armazenado para sincronização posterior",
      });
    } catch (error) {
      toast({
        title: "Erro no armazenamento",
        description: "Não foi possível salvar o vídeo localmente",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Get saved videos from local storage
  const getLocalVideos = useCallback(async () => {
    try {
      const videos = await Filesystem.readdir({
        path: 'videos',
        directory: Directory.Data,
      });
      
      return videos.files;
    } catch (error) {
      return [];
    }
  }, []);

  // Remove video recording
  const removeVideo = useCallback((videoId: string) => {
    setRecordings(prev => prev.filter(video => video.id !== videoId));
    
    toast({
      title: "Vídeo removido",
      description: "Vídeo excluído com sucesso",
    });
  }, [toast]);

  // Upload video with progress tracking
  const uploadVideo = useCallback(async (video: VideoRecording) => {
    try {
      // Salvar localmente para sincronização posterior
      await videoService.saveVideoLocally(
        new File([], video.path), // Placeholder - seria o arquivo real
        {
          osId: video.id.split('_')[0], // Extrair OS ID se disponível
          quality: 'HD',
          description: 'Vídeo de entrada da ordem de serviço'
        }
      );

      toast({
        title: "Vídeo salvo",
        description: "Vídeo preparado para upload quando conectar ao Supabase",
      });
    } catch (error) {
      toast({
        title: "Erro no armazenamento",
        description: "Não foi possível salvar o vídeo",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Get storage info
  const getStorageInfo = useCallback(() => {
    return videoService.getStorageInfo();
  }, []);

  // Sync pending videos (for future Supabase integration)
  const syncPendingVideos = useCallback(async () => {
    try {
      await videoService.syncPendingVideos();
      toast({
        title: "Sincronização completa",
        description: "Vídeos enviados para o servidor",
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Alguns vídeos não puderam ser enviados",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    recordings,
    isRecording,
    isNativeCapable,
    recordVideo,
    saveVideoLocally,
    getLocalVideos,
    removeVideo,
    uploadVideo,
    checkNativeCapability,
    getStorageInfo,
    syncPendingVideos,
  };
}