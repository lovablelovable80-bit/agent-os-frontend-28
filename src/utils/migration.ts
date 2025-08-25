// Utilities para migração futura para Supabase
// Definições de tipos e estruturas de dados

export interface ServiceOrder {
  id: string;
  customer_id: string;
  device_info: {
    brand: string;
    model: string;
    category: 'smartphone' | 'laptop' | 'tablet' | 'watch' | 'headphone';
    serial_number?: string;
    purchase_date?: string;
  };
  problem_description: string;
  detailed_description?: string;
  status: 'pending' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled' | 'quote';
  priority: 'high' | 'medium' | 'low';
  assigned_technician?: string;
  estimated_cost?: number;
  final_cost?: number;
  created_at: string;
  updated_at: string;
  due_date?: string;
  completion_date?: string;
  photos?: string[]; // URLs dos arquivos no Supabase Storage
  videos?: string[]; // URLs dos vídeos no Supabase Storage
  notes?: string;
  parts_needed?: string[];
  warranty_expires?: string;
}

export interface VideoRecord {
  id: string;
  service_order_id: string;
  file_path: string; // Caminho no Supabase Storage
  file_name: string;
  file_size: number;
  duration?: number;
  quality: 'HD' | 'FHD' | '4K';
  mime_type: string;
  thumbnail_path?: string;
  created_at: string;
  uploaded_at?: string;
  tags?: string[];
  description?: string;
  is_processed: boolean;
  processing_status?: 'pending' | 'processing' | 'complete' | 'error';
}

export interface PhotoRecord {
  id: string;
  service_order_id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  uploaded_at?: string;
  tags?: string[];
  description?: string;
}

// Estrutura de dados para migração
export interface MigrationData {
  service_orders: ServiceOrder[];
  videos: VideoRecord[];
  photos: PhotoRecord[];
  customers: any[];
  technicians: any[];
  service_types: any[];
}

// SQL para criação das tabelas (quando Supabase for conectado)
export const supabaseTables = {
  service_orders: `
    CREATE TABLE service_orders (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      customer_id UUID REFERENCES customers(id),
      device_info JSONB NOT NULL,
      problem_description TEXT NOT NULL,
      detailed_description TEXT,
      status TEXT CHECK (status IN ('pending', 'in_progress', 'waiting_parts', 'completed', 'cancelled', 'quote')) DEFAULT 'pending',
      priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
      assigned_technician UUID REFERENCES technicians(id),
      estimated_cost DECIMAL(10,2),
      final_cost DECIMAL(10,2),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      due_date DATE,
      completion_date TIMESTAMP WITH TIME ZONE,
      photos TEXT[],
      videos TEXT[],
      notes TEXT,
      parts_needed TEXT[],
      warranty_expires DATE
    );
  `,
  
  video_records: `
    CREATE TABLE video_records (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
      file_path TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      duration INTEGER,
      quality TEXT CHECK (quality IN ('HD', 'FHD', '4K')) DEFAULT 'HD',
      mime_type TEXT NOT NULL,
      thumbnail_path TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      uploaded_at TIMESTAMP WITH TIME ZONE,
      tags TEXT[],
      description TEXT,
      is_processed BOOLEAN DEFAULT FALSE,
      processing_status TEXT CHECK (processing_status IN ('pending', 'processing', 'complete', 'error')) DEFAULT 'pending'
    );
  `,
  
  photo_records: `
    CREATE TABLE photo_records (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
      file_path TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      uploaded_at TIMESTAMP WITH TIME ZONE,
      tags TEXT[],
      description TEXT
    );
  `
};

// RLS Policies (Row Level Security)
export const rlsPolicies = {
  service_orders: `
    -- Permitir leitura para técnicos e admins
    CREATE POLICY "Service orders readable by technicians" ON service_orders
      FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        (assigned_technician = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
      );
    
    -- Permitir criação para técnicos e admins
    CREATE POLICY "Service orders creatable by technicians" ON service_orders
      FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        auth.jwt() ->> 'role' IN ('technician', 'admin')
      );
    
    -- Permitir atualização apenas do técnico responsável ou admin
    CREATE POLICY "Service orders updatable by assigned technician" ON service_orders
      FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        (assigned_technician = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
      );
  `,
  
  video_records: `
    -- Vídeos acessíveis apenas pelos responsáveis pela OS
    CREATE POLICY "Videos accessible by OS technician" ON video_records
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM service_orders 
          WHERE id = video_records.service_order_id 
          AND (assigned_technician = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
        )
      );
  `
};

// Funções para preparar dados para migração
export function prepareServiceOrderForMigration(mockService: any): ServiceOrder {
  return {
    id: mockService.id,
    customer_id: mockService.cliente, // Será UUID após migração
    device_info: {
      brand: mockService.device.split(' ')[0],
      model: mockService.device,
      category: mockService.categoria,
    },
    problem_description: mockService.problema,
    detailed_description: mockService.descricaoDetalhada,
    status: mockService.status.toLowerCase().replace(' ', '_'),
    priority: mockService.prioridade.toLowerCase(),
    assigned_technician: mockService.tecnico,
    estimated_cost: mockService.valor,
    created_at: mockService.entrada,
    updated_at: new Date().toISOString(),
    due_date: mockService.prazo,
    notes: mockService.observacoes,
    parts_needed: mockService.pecas,
  };
}

// Storage buckets que serão criados no Supabase
export const storageBuckets = {
  'service-videos': {
    public: false,
    allowedMimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    fileSizeLimit: 100 * 1024 * 1024, // 100MB
  },
  'service-photos': {
    public: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
  },
  'video-thumbnails': {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    fileSizeLimit: 1 * 1024 * 1024, // 1MB
  }
};