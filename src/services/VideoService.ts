// Service layer para operações de vídeo
// Preparado para integração futura com Supabase

interface VideoMetadata {
  id: string;
  osId?: string;
  filename: string;
  size: number;
  duration?: number;
  quality: 'HD' | 'FHD';
  mimeType: string;
  thumbnail?: string;
  createdAt: Date;
  uploadedAt?: Date;
  tags?: string[];
  description?: string;
}

interface VideoUploadProgress {
  progress: number;
  stage: 'compressing' | 'uploading' | 'processing' | 'complete';
  error?: string;
}

class VideoService {
  // Local storage para vídeos offline
  private readonly STORAGE_KEY = 'pending_video_uploads';

  // Salvar vídeo localmente para sincronização posterior
  async saveVideoLocally(video: File, metadata: Partial<VideoMetadata>): Promise<string> {
    try {
      const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Converter para base64 para armazenamento local
      const base64Data = await this.fileToBase64(video);
      
      const videoData: VideoMetadata = {
        id: videoId,
        filename: video.name,
        size: video.size,
        mimeType: video.type,
        quality: metadata.quality || 'HD',
        createdAt: new Date(),
        ...metadata
      };

      // Salvar no localStorage (temporário)
      const pendingUploads = this.getPendingUploads();
      pendingUploads.push({
        ...videoData,
        data: base64Data
      });
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pendingUploads));
      
      return videoId;
    } catch (error) {
      console.error('Erro ao salvar vídeo localmente:', error);
      throw error;
    }
  }

  // Obter vídeos pendentes de upload
  getPendingUploads(): any[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao recuperar vídeos pendentes:', error);
      return [];
    }
  }

  // Comprimir vídeo (implementação futura)
  async compressVideo(
    video: File, 
    quality: 'HD' | 'FHD' = 'HD'
  ): Promise<File> {
    // TODO: Implementar compressão de vídeo
    // Por enquanto, retorna o vídeo original
    return video;
  }

  // Gerar thumbnail do vídeo
  async generateThumbnail(video: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const videoElement = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      videoElement.onloadedmetadata = () => {
        canvas.width = 160;
        canvas.height = 120;
        
        videoElement.currentTime = 1; // Capturar thumbnail no segundo 1
      };

      videoElement.onseeked = () => {
        ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
      };

      videoElement.onerror = reject;
      videoElement.src = URL.createObjectURL(video);
    });
  }

  // Upload para Supabase (placeholder para implementação futura)
  async uploadToSupabase(
    videoId: string,
    progressCallback?: (progress: VideoUploadProgress) => void
  ): Promise<boolean> {
    // TODO: Implementar upload para Supabase Storage
    // Simular progresso para demonstração
    
    if (progressCallback) {
      progressCallback({ progress: 0, stage: 'compressing' });
      await this.delay(1000);
      
      progressCallback({ progress: 25, stage: 'uploading' });
      await this.delay(2000);
      
      progressCallback({ progress: 75, stage: 'processing' });
      await this.delay(1000);
      
      progressCallback({ progress: 100, stage: 'complete' });
    }

    return true;
  }

  // Sincronizar vídeos pendentes com o backend
  async syncPendingVideos(): Promise<void> {
    const pendingUploads = this.getPendingUploads();
    
    for (const upload of pendingUploads) {
      try {
        await this.uploadToSupabase(upload.id);
        
        // Remover da lista de pendentes após upload bem-sucedido
        this.removePendingUpload(upload.id);
      } catch (error) {
        console.error(`Erro ao sincronizar vídeo ${upload.id}:`, error);
      }
    }
  }

  // Remover vídeo da lista de pendentes
  private removePendingUpload(videoId: string): void {
    const pendingUploads = this.getPendingUploads();
    const filtered = pendingUploads.filter(upload => upload.id !== videoId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  // Converter arquivo para base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Delay utility
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Limpar storage local
  clearLocalStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Obter informações de uso do storage
  getStorageInfo(): { count: number; totalSize: number } {
    const pendingUploads = this.getPendingUploads();
    const totalSize = pendingUploads.reduce((acc, upload) => acc + upload.size, 0);
    
    return {
      count: pendingUploads.length,
      totalSize
    };
  }
}

export const videoService = new VideoService();
export type { VideoMetadata, VideoUploadProgress };