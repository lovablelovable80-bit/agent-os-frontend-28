export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      atividades: {
        Row: {
          cliente_id: string | null
          concluida: boolean
          created_at: string
          data_atividade: string
          descricao: string | null
          empresa_id: string
          id: string
          oportunidade_id: string | null
          tipo: string
          titulo: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          cliente_id?: string | null
          concluida?: boolean
          created_at?: string
          data_atividade?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          oportunidade_id?: string | null
          tipo: string
          titulo: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          cliente_id?: string | null
          concluida?: boolean
          created_at?: string
          data_atividade?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          oportunidade_id?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atividades_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividades_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividades_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividades_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          cpf_cnpj: string | null
          created_at: string
          data_nascimento: string | null
          email: string | null
          empresa_id: string
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          status: Database["public"]["Enums"]["status_cliente"]
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          empresa_id: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_cliente"]
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          empresa_id?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          status?: Database["public"]["Enums"]["status_cliente"]
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_ia: {
        Row: {
          ativo: boolean
          conhecimento_personalizado: string | null
          created_at: string
          empresa_id: string
          id: string
          max_tokens: number
          nome_assistente: string
          prompt_sistema: string
          tabelas_autorizadas: string[] | null
          temperatura: number
          updated_at: string
          usar_dados_empresa: boolean
        }
        Insert: {
          ativo?: boolean
          conhecimento_personalizado?: string | null
          created_at?: string
          empresa_id: string
          id?: string
          max_tokens?: number
          nome_assistente?: string
          prompt_sistema?: string
          tabelas_autorizadas?: string[] | null
          temperatura?: number
          updated_at?: string
          usar_dados_empresa?: boolean
        }
        Update: {
          ativo?: boolean
          conhecimento_personalizado?: string | null
          created_at?: string
          empresa_id?: string
          id?: string
          max_tokens?: number
          nome_assistente?: string
          prompt_sistema?: string
          tabelas_autorizadas?: string[] | null
          temperatura?: number
          updated_at?: string
          usar_dados_empresa?: boolean
        }
        Relationships: []
      }
      documentos: {
        Row: {
          arquivo_url: string | null
          cliente_id: string | null
          created_at: string
          empresa_id: string
          id: string
          nome: string
          observacoes: string | null
          oportunidade_id: string | null
          tamanho_arquivo: number | null
          tipo: Database["public"]["Enums"]["tipo_documento"]
          updated_at: string
          usuario_id: string
        }
        Insert: {
          arquivo_url?: string | null
          cliente_id?: string | null
          created_at?: string
          empresa_id: string
          id?: string
          nome: string
          observacoes?: string | null
          oportunidade_id?: string | null
          tamanho_arquivo?: number | null
          tipo: Database["public"]["Enums"]["tipo_documento"]
          updated_at?: string
          usuario_id: string
        }
        Update: {
          arquivo_url?: string | null
          cliente_id?: string | null
          created_at?: string
          empresa_id?: string
          id?: string
          nome?: string
          observacoes?: string | null
          oportunidade_id?: string | null
          tamanho_arquivo?: number | null
          tipo?: Database["public"]["Enums"]["tipo_documento"]
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cnpj: string
          created_at: string
          id: string
          logo_url: string | null
          nome: string
          status: Database["public"]["Enums"]["status_empresa"]
          updated_at: string
        }
        Insert: {
          cnpj: string
          created_at?: string
          id?: string
          logo_url?: string | null
          nome: string
          status?: Database["public"]["Enums"]["status_empresa"]
          updated_at?: string
        }
        Update: {
          cnpj?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          nome?: string
          status?: Database["public"]["Enums"]["status_empresa"]
          updated_at?: string
        }
        Relationships: []
      }
      financeiro: {
        Row: {
          cliente_id: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          descricao: string
          empresa_id: string
          id: string
          observacoes: string | null
          oportunidade_id: string | null
          status: Database["public"]["Enums"]["status_pagamento"]
          tipo: string
          updated_at: string
          usuario_id: string
          valor: number
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          descricao: string
          empresa_id: string
          id?: string
          observacoes?: string | null
          oportunidade_id?: string | null
          status?: Database["public"]["Enums"]["status_pagamento"]
          tipo: string
          updated_at?: string
          usuario_id: string
          valor: number
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string
          empresa_id?: string
          id?: string
          observacoes?: string | null
          oportunidade_id?: string | null
          status?: Database["public"]["Enums"]["status_pagamento"]
          tipo?: string
          updated_at?: string
          usuario_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financeiro_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      oportunidade_itens: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          oportunidade_id: string
          preco_total: number
          preco_unitario: number
          produto_id: string | null
          quantidade: number
          servico_id: string | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          oportunidade_id: string
          preco_total?: number
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          servico_id?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          oportunidade_id?: string
          preco_total?: number
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          servico_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oportunidade_itens_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidade_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidade_itens_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      oportunidades: {
        Row: {
          cliente_id: string
          created_at: string
          data_fechamento_prevista: string | null
          data_fechamento_real: string | null
          descricao: string | null
          empresa_id: string
          fonte: string | null
          id: string
          observacoes: string | null
          probabilidade: number | null
          status: Database["public"]["Enums"]["status_oportunidade"]
          titulo: string
          updated_at: string
          valor: number
          vendedor_id: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_fechamento_prevista?: string | null
          data_fechamento_real?: string | null
          descricao?: string | null
          empresa_id: string
          fonte?: string | null
          id?: string
          observacoes?: string | null
          probabilidade?: number | null
          status?: Database["public"]["Enums"]["status_oportunidade"]
          titulo: string
          updated_at?: string
          valor?: number
          vendedor_id: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_fechamento_prevista?: string | null
          data_fechamento_real?: string | null
          descricao?: string | null
          empresa_id?: string
          fonte?: string | null
          id?: string
          observacoes?: string | null
          probabilidade?: number | null
          status?: Database["public"]["Enums"]["status_oportunidade"]
          titulo?: string
          updated_at?: string
          valor?: number
          vendedor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oportunidades_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean
          categoria: string | null
          created_at: string
          custo: number | null
          descricao: string | null
          empresa_id: string
          estoque: number | null
          estoque_minimo: number | null
          id: string
          marca: string | null
          nome: string
          preco: number
          sku: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          custo?: number | null
          descricao?: string | null
          empresa_id: string
          estoque?: number | null
          estoque_minimo?: number | null
          id?: string
          marca?: string | null
          nome: string
          preco?: number
          sku?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          custo?: number | null
          descricao?: string | null
          empresa_id?: string
          estoque?: number | null
          estoque_minimo?: number | null
          id?: string
          marca?: string | null
          nome?: string
          preco?: number
          sku?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean
          categoria: string | null
          codigo: string | null
          created_at: string
          descricao: string | null
          duracao_estimada: number | null
          empresa_id: string
          id: string
          nome: string
          preco: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          duracao_estimada?: number | null
          empresa_id: string
          id?: string
          nome: string
          preco?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          duracao_estimada?: number | null
          empresa_id?: string
          id?: string
          nome?: string
          preco?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "servicos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          empresa_id: string
          id: string
          nome: string
          status: Database["public"]["Enums"]["status_usuario"]
          tipo_usuario: Database["public"]["Enums"]["tipo_usuario"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          empresa_id: string
          id: string
          nome: string
          status?: Database["public"]["Enums"]["status_usuario"]
          tipo_usuario?: Database["public"]["Enums"]["tipo_usuario"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          empresa_id?: string
          id?: string
          nome?: string
          status?: Database["public"]["Enums"]["status_usuario"]
          tipo_usuario?: Database["public"]["Enums"]["tipo_usuario"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_complete_schema: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_current_user_empresa_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_dashboard_stats: {
        Args: { empresa_id_param: string }
        Returns: Json
      }
      get_financial_summary: {
        Args: { empresa_id_param: string; start_date: string; end_date: string }
        Returns: {
          periodo: string
          receitas: number
          despesas: number
          saldo: number
        }[]
      }
      get_pipeline_summary: {
        Args: { empresa_id_param: string }
        Returns: {
          status: Database["public"]["Enums"]["status_oportunidade"]
          quantidade: number
          valor_total: number
          probabilidade_media: number
        }[]
      }
      get_user_activity_summary: {
        Args: { empresa_id_param: string; start_date: string; end_date: string }
        Returns: {
          usuario_id: string
          nome: string
          total_atividades: number
          atividades_concluidas: number
          atividades_pendentes: number
        }[]
      }
      is_superadmin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      status_cliente: "ativo" | "inativo" | "prospecto"
      status_empresa: "ativa" | "inativa" | "suspensa"
      status_oportunidade:
        | "prospecto"
        | "qualificado"
        | "proposta"
        | "negociacao"
        | "fechado_ganho"
        | "fechado_perdido"
      status_pagamento: "pendente" | "pago" | "atrasado" | "cancelado"
      status_usuario: "ativo" | "inativo" | "pendente"
      tipo_documento:
        | "contrato"
        | "proposta"
        | "orcamento"
        | "nota_fiscal"
        | "recibo"
        | "outros"
      tipo_usuario: "superadmin" | "admin" | "tecnico" | "vendedor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      status_cliente: ["ativo", "inativo", "prospecto"],
      status_empresa: ["ativa", "inativa", "suspensa"],
      status_oportunidade: [
        "prospecto",
        "qualificado",
        "proposta",
        "negociacao",
        "fechado_ganho",
        "fechado_perdido",
      ],
      status_pagamento: ["pendente", "pago", "atrasado", "cancelado"],
      status_usuario: ["ativo", "inativo", "pendente"],
      tipo_documento: [
        "contrato",
        "proposta",
        "orcamento",
        "nota_fiscal",
        "recibo",
        "outros",
      ],
      tipo_usuario: ["superadmin", "admin", "tecnico", "vendedor"],
    },
  },
} as const
