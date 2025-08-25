import { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNativeApp } from "@/hooks/useNativeApp";
import ServicesMobile from "./ServicesMobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { CommunicationPanel } from "@/components/services/CommunicationPanel";
import { AdvancedReports } from "@/components/services/AdvancedReports";
import { PhotoUpload } from "@/components/services/PhotoUpload";
import { DeviceInspection } from "@/components/services/DeviceInspection";
import { VideoRecordingCard } from "@/components/services/VideoRecordingCard";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Printer, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  User,
  Calendar,
  Wrench,
  DollarSign,
  Save,
  X,
  TrendingUp,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Star,
  MessageSquare,
  History,
  FileText,
  BarChart3,
  Timer,
  Package,
  Wrench as Tool,
  MapPin,
  Mail,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  Trash2,
  Copy,
  Send,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  Settings,
  Bell,
  Zap,
  Activity,
  Users,
  Target,
  TrendingDown,
  Archive,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Video
} from "lucide-react";

// Mock data expandido para demonstração
const mockServices = [
  {
    id: "OS001",
    cliente: "João Silva",
    telefone: "(11) 99999-9999",
    email: "joao.silva@email.com",
    device: "iPhone 14 Pro",
    categoria: "smartphone",
    problema: "Tela quebrada, touch não funciona",
    descricaoDetalhada: "Cliente relatou queda do aparelho. Tela apresenta rachaduras e touch screen não responde em algumas áreas.",
    status: "Em andamento",
    tecnico: "Carlos Santos",
    entrada: "2024-01-15",
    prazo: "2024-01-17",
    valor: 450.00,
    prioridade: "Alta",
    progresso: 65,
    pecas: ["Tela LCD", "Touch Screen"],
    observacoes: "Aguardando chegada da peça. Cliente informado sobre prazo.",
    historico: [
      { data: "2024-01-15 10:30", acao: "OS criada", usuario: "Sistema" },
      { data: "2024-01-15 11:00", acao: "Diagnóstico realizado", usuario: "Carlos Santos" },
      { data: "2024-01-15 14:20", acao: "Peças solicitadas", usuario: "Carlos Santos" }
    ]
  },
  {
    id: "OS002", 
    cliente: "Maria Santos",
    telefone: "(11) 88888-8888",
    email: "maria.santos@email.com",
    device: "Samsung Galaxy S23",
    categoria: "smartphone",
    problema: "Bateria viciada, não segura carga",
    descricaoDetalhada: "Aparelho desliga sozinho mesmo com bateria indicando carga. Duração da bateria muito reduzida.",
    status: "Aguardando peça",
    tecnico: "Ana Costa",
    entrada: "2024-01-14",
    prazo: "2024-01-20",
    valor: 280.00,
    prioridade: "Média",
    progresso: 30,
    pecas: ["Bateria Original"],
    observacoes: "Bateria solicitada ao fornecedor. Previsão de chegada em 3 dias.",
    historico: [
      { data: "2024-01-14 09:15", acao: "OS criada", usuario: "Sistema" },
      { data: "2024-01-14 10:30", acao: "Teste de bateria realizado", usuario: "Ana Costa" }
    ]
  },
  {
    id: "OS003",
    cliente: "Carlos Oliveira", 
    telefone: "(11) 77777-7777",
    email: "carlos.oliveira@email.com",
    device: "Xiaomi Mi 11",
    categoria: "smartphone",
    problema: "Não carrega, conector danificado",
    descricaoDetalhada: "Conector USB-C apresenta sinais de oxidação. Cabo não encaixa corretamente.",
    status: "Finalizado",
    tecnico: "João Lima",
    entrada: "2024-01-10",
    prazo: "2024-01-12",
    valor: 150.00,
    prioridade: "Baixa",
    progresso: 100,
    pecas: ["Conector USB-C"],
    observacoes: "Serviço concluído. Cliente satisfeito com o resultado.",
    historico: [
      { data: "2024-01-10 14:00", acao: "OS criada", usuario: "Sistema" },
      { data: "2024-01-11 09:30", acao: "Reparo iniciado", usuario: "João Lima" },
      { data: "2024-01-12 16:45", acao: "Serviço finalizado", usuario: "João Lima" }
    ]
  },
  {
    id: "OS004",
    cliente: "Ana Costa",
    telefone: "(11) 66666-6666",
    email: "ana.costa@email.com", 
    device: "iPhone 13",
    categoria: "smartphone",
    problema: "Câmera traseira não funciona",
    descricaoDetalhada: "Câmera principal não inicializa. Aplicativo da câmera fecha automaticamente.",
    status: "Orçamento",
    tecnico: "-",
    entrada: "2024-01-16",
    prazo: "2024-01-18",
    valor: 0,
    prioridade: "Média",
    progresso: 15,
    pecas: [],
    observacoes: "Aguardando aprovação do orçamento pelo cliente.",
    historico: [
      { data: "2024-01-16 11:20", acao: "OS criada", usuario: "Sistema" },
      { data: "2024-01-16 15:30", acao: "Orçamento enviado", usuario: "Carlos Santos" }
    ]
  },
  {
    id: "OS005",
    cliente: "Pedro Martins",
    telefone: "(11) 55555-5555",
    email: "pedro.martins@email.com",
    device: "MacBook Air M1",
    categoria: "laptop",
    problema: "Teclado não funciona",
    descricaoDetalhada: "Algumas teclas não respondem. Possível dano por líquido.",
    status: "Em andamento",
    tecnico: "Ana Costa",
    entrada: "2024-01-17",
    prazo: "2024-01-22",
    valor: 680.00,
    prioridade: "Alta",
    progresso: 45,
    pecas: ["Teclado", "Top Case"],
    observacoes: "Aguardando peças originais da Apple.",
    historico: [
      { data: "2024-01-17 08:45", acao: "OS criada", usuario: "Sistema" },
      { data: "2024-01-17 10:15", acao: "Diagnóstico completo", usuario: "Ana Costa" }
    ]
  },
  {
    id: "OS006",
    cliente: "Luciana Ferreira",
    telefone: "(11) 44444-4444",
    email: "luciana.ferreira@email.com",
    device: "iPad Pro 12.9",
    categoria: "tablet",
    problema: "Tela não liga",
    descricaoDetalhada: "Aparelho não apresenta sinais de vida. Não carrega nem liga.",
    status: "Diagnóstico",
    tecnico: "João Lima",
    entrada: "2024-01-18",
    prazo: "2024-01-20",
    valor: 0,
    prioridade: "Média",
    progresso: 25,
    pecas: [],
    observacoes: "Realizando testes na placa-mãe.",
    historico: [
      { data: "2024-01-18 13:30", acao: "OS criada", usuario: "Sistema" }
    ]
  }
];

const statusColors = {
  "Em andamento": "bg-primary/10 text-primary border-primary/20",
  "Aguardando peça": "bg-warning/10 text-warning border-warning/20", 
  "Finalizado": "bg-success/10 text-success border-success/20",
  "Orçamento": "bg-accent/10 text-accent border-accent/20",
  "Diagnóstico": "bg-secondary/10 text-secondary border-secondary/20",
  "Cancelado": "bg-destructive/10 text-destructive border-destructive/20"
};

const priorityColors = {
  "Alta": "bg-destructive/10 text-destructive border-destructive/20",
  "Média": "bg-warning/10 text-warning border-warning/20",
  "Baixa": "bg-success/10 text-success border-success/20"
};

const categoryIcons = {
  "smartphone": Smartphone,
  "laptop": Laptop,
  "tablet": Tablet,
  "watch": Watch,
  "headphone": Headphones
};

export default function Services() {
  const isMobile = useIsMobile();
  const { isNativeApp } = useNativeApp();
  const { toast } = useToast();
  
  // All hooks first
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"entrada" | "prazo" | "valor" | "cliente">("entrada");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [viewServiceOpen, setViewServiceOpen] = useState(false);
  const [editServiceOpen, setEditServiceOpen] = useState(false);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    valorServico: 0,
    valorPecas: 0,
    desconto: 0,
    formaPagamento: "",
    observacoes: ""
  });
  const [formData, setFormData] = useState({
    cliente: "",
    telefone: "",
    email: "",
    device: "",
    categoria: "",
    problema: "",
    descricaoDetalhada: "",
    prioridade: "",
    tecnico: "",
    prazo: "",
    valor: "",
    servicoSelecionado: "",
    status: ""
  });
  const [osPhotos, setOsPhotos] = useState<File[]>([]);
  const [showInspection, setShowInspection] = useState(false);
  const [inspectionData, setInspectionData] = useState<any>(null);

  // Estados para cadastro de tipos de serviços
  const [isManageServicesOpen, setIsManageServicesOpen] = useState(false);
  const [isNewServiceTypeOpen, setIsNewServiceTypeOpen] = useState(false);
  const [serviceTypeForm, setServiceTypeForm] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    preco: "",
    tempoEstimado: ""
  });

  // Mock data para tipos de serviços cadastrados
  const [registeredServices, setRegisteredServices] = useState([
    {
      id: "srv001",
      nome: "Troca de Tela iPhone X",
      categoria: "smartphone",
      descricao: "Substituição completa do conjunto tela/touch iPhone X",
      preco: 430.00,
      tempoEstimado: "2-3 horas"
    },
    {
      id: "srv002", 
      nome: "Troca de Bateria Samsung Galaxy S23",
      categoria: "smartphone",
      descricao: "Substituição da bateria original Samsung Galaxy S23",
      preco: 280.00,
      tempoEstimado: "1-2 horas"
    },
    {
      id: "srv003",
      nome: "Reparo Conector USB-C",
      categoria: "smartphone", 
      descricao: "Substituição do conector de carregamento USB-C",
      preco: 150.00,
      tempoEstimado: "2-4 horas"
    },
    {
      id: "srv004",
      nome: "Troca de Teclado MacBook",
      categoria: "laptop",
      descricao: "Substituição completa do teclado MacBook (qualquer modelo)",
      preco: 680.00,
      tempoEstimado: "4-6 horas"
    },
    {
      id: "srv005",
      nome: "Reparo Tela iPad",
      categoria: "tablet",
      descricao: "Reparo ou substituição de tela de iPad (todos os modelos)",
      preco: 520.00,
      tempoEstimado: "3-5 horas"
    }
  ]);

  // Templates de diagnóstico para diferentes tipos de dispositivo
  const diagnosticTemplates = {
    smartphone: [
      "Teste de tela e touch screen",
      "Verificação da bateria e carregamento",
      "Teste de conectividade (WiFi, Bluetooth, dados)",
      "Verificação das câmeras",
      "Teste de áudio (alto-falantes e microfone)",
      "Análise de software e vírus"
    ],
    laptop: [
      "Teste do sistema operacional",
      "Verificação de hardware (RAM, HD, processador)",
      "Teste de teclado e touchpad",
      "Verificação da tela e conectores",
      "Teste de conectividade e portas USB",
      "Análise de temperatura e coolers"
    ],
    tablet: [
      "Teste de tela e digitalização",
      "Verificação da bateria",
      "Teste de conectividade WiFi",
      "Verificação das câmeras",
      "Teste de áudio",
      "Análise do sistema operacional"
    ]
  };

  // Notificações do sistema
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "urgent",
      title: "OS #001 - Prazo Vencido",
      message: "iPhone 14 Pro de João Silva está 2 dias em atraso",
      time: "há 5 min",
      read: false,
      osId: "OS001"
    },
    {
      id: 2,
      type: "info",
      title: "Peça Chegou",
      message: "Bateria Samsung Galaxy S23 disponível para OS #002",
      time: "há 15 min",
      read: false,
      osId: "OS002"
    },
    {
      id: 3,
      type: "success",
      title: "Orçamento Aprovado",
      message: "Cliente Ana Costa aprovou orçamento da OS #004",
      time: "há 1h",
      read: true,
      osId: "OS004"
    }
  ]);

  // Auto-refresh effect
  // useEffect(() => {
  //   if (autoRefresh) {
  //     const interval = setInterval(() => {
  //       // Simular atualização de dados
  //       console.log("Atualizando dados...");
  //     }, refreshInterval);
  //     return () => clearInterval(interval);
  //   }
  // }, [autoRefresh, refreshInterval]);

  // Filtros e ordenação aprimorados
  const filteredAndSortedServices = useMemo(() => {
    let filtered = mockServices.filter(service => {
      const matchesSearch = service.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.problema.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.tecnico.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || service.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || service.prioridade === priorityFilter;
      const matchesCategory = categoryFilter === "all" || service.categoria === categoryFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "cliente":
          aValue = a.cliente.toLowerCase();
          bValue = b.cliente.toLowerCase();
          break;
        case "valor":
          aValue = a.valor;
          bValue = b.valor;
          break;
        case "prazo":
          aValue = new Date(a.prazo).getTime();
          bValue = new Date(b.prazo).getTime();
          break;
        case "entrada":
        default:
          aValue = new Date(a.entrada).getTime();
          bValue = new Date(b.entrada).getTime();
          break;
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const total = mockServices.length;
    const emAndamento = mockServices.filter(s => s.status === "Em andamento").length;
    const aguardando = mockServices.filter(s => s.status === "Aguardando peça").length;
    const finalizados = mockServices.filter(s => s.status === "Finalizado").length;
    const orcamentos = mockServices.filter(s => s.status === "Orçamento").length;
    const receita = mockServices.reduce((acc, s) => acc + s.valor, 0);
    const receitaMedia = receita / (finalizados || 1);
    const prioridadeAlta = mockServices.filter(s => s.prioridade === "Alta").length;
    const vencidos = mockServices.filter(s => new Date(s.prazo) < new Date() && s.status !== "Finalizado").length;
    const hoje = new Date().toISOString().split('T')[0];
    const hojePrazos = mockServices.filter(s => s.prazo === hoje && s.status !== "Finalizado").length;
    
    return {
      total,
      emAndamento,
      aguardando,
      finalizados,
      orcamentos,
      receita,
      receitaMedia,
      prioridadeAlta,
      vencidos,
      hojePrazos,
      taxaConclusao: total > 0 ? (finalizados / total) * 100 : 0,
      crescimento: 12.5 // Exemplo de crescimento mensal
    };
  }, []);

  // Use layout mobile para dispositivos móveis (após todos os hooks)
  if (isMobile || isNativeApp) {
    return <ServicesMobile />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em andamento": return <Clock className="w-4 h-4" />;
      case "Finalizado": return <CheckCircle className="w-4 h-4" />;
      case "Aguardando peça": return <Package className="w-4 h-4" />;
      case "Orçamento": return <FileText className="w-4 h-4" />;
      case "Diagnóstico": return <Tool className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (categoria: string) => {
    const IconComponent = categoryIcons[categoria as keyof typeof categoryIcons] || Smartphone;
    return <IconComponent className="w-4 h-4" />;
  };

  // Funções de seleção múltipla
  const handleSelectService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedServices.length === filteredAndSortedServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredAndSortedServices.map(s => s.id));
    }
  };

  // Funções de ações em massa
  const handleBulkStatusChange = (newStatus: string) => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Status Atualizado",
        description: `${selectedServices.length} OS(s) foram atualizadas para "${newStatus}"`,
      });
      setSelectedServices([]);
      setBulkActionsOpen(false);
      setIsLoading(false);
    }, 1500);
  };

  const handleBulkDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "OS Removidas",
        description: `${selectedServices.length} ordem(ns) de serviço foram removidas`,
        variant: "destructive"
      });
      setSelectedServices([]);
      setBulkActionsOpen(false);
      setIsLoading(false);
    }, 1500);
  };

  const handleBulkPrint = () => {
    toast({
      title: "Imprimindo Ordens",
      description: `Imprimindo ${selectedServices.length} OS(s) selecionadas...`,
    });
    setSelectedServices([]);
  };

  const handleExportData = () => {
    toast({
      title: "Exportando Dados",
      description: "Relatório Excel será baixado em instantes...",
    });
  };

  // Funções dos botões
  const handleViewService = (service: any) => {
    setSelectedService(service);
    setViewServiceOpen(true);
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setFormData({
      cliente: service.cliente,
      telefone: service.telefone,
      email: service.email,
      device: service.device,
      categoria: service.categoria,
      problema: service.problema,
      descricaoDetalhada: service.descricaoDetalhada,
      prioridade: service.prioridade,
      tecnico: service.tecnico === "-" ? "" : service.tecnico,
      prazo: service.prazo,
      valor: service.valor.toString(),
      servicoSelecionado: "",
      status: service.status || ""
    });
    setEditServiceOpen(true);
  };

  const handlePrintService = (service: any) => {
    toast({
      title: "Imprimindo Ordem de Serviço",
      description: `OS #${service.id} está sendo impressa...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Impressão Concluída",
        description: `OS #${service.id} foi impressa com sucesso!`,
      });
    }, 2000);
  };

  const handleCreateService = () => {
    if (!formData.cliente || !formData.telefone || !formData.device || !formData.problema) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newServiceId = `OS${String(mockServices.length + 1).padStart(3, '0')}`;
    
    // Aqui você faria o upload das fotos para o servidor/Supabase
    if (osPhotos.length > 0) {
      console.log(`Uploading ${osPhotos.length} photos for OS ${newServiceId}`);
      // TODO: Implementar upload real das fotos
    }

    // Dados da inspeção
    if (inspectionData) {
      console.log(`Inspection data for OS ${newServiceId}:`, inspectionData);
      // TODO: Salvar dados da inspeção no banco
      if (inspectionData.videoBlob) {
        console.log(`Entry video recorded: ${(inspectionData.videoBlob.size / 1024 / 1024).toFixed(2)}MB`);
        // TODO: Upload do vídeo para Supabase Storage
      }
    }
    
    const inspectionSummary = inspectionData ? {
      totalItems: inspectionData.checklist?.length || 0,
      okItems: inspectionData.checklist?.filter((item: any) => item.status === "ok").length || 0,
      problemItems: inspectionData.checklist?.filter((item: any) => item.status === "problem").length || 0,
      hasVideo: !!inspectionData.videoBlob,
      observations: inspectionData.observations
    } : null;

    toast({
      title: "Ordem de Serviço Criada",
      description: `Nova OS #${newServiceId} criada com sucesso!${osPhotos.length > 0 ? ` Com ${osPhotos.length} foto(s).` : ''}${inspectionSummary ? ` Inspeção: ${inspectionSummary.okItems}/${inspectionSummary.totalItems} OK.` : ''}`,
    });

    resetNewServiceForm();
    setIsNewServiceOpen(false);
  };

  const handleSaveEdit = () => {
    toast({
      title: "Serviço Atualizado",
      description: `OS #${selectedService?.id} foi atualizada com sucesso!`,
    });
    setEditServiceOpen(false);
    setSelectedService(null);
  };

  const resetNewServiceForm = () => {
    setFormData({
      cliente: "",
      telefone: "",
      email: "",
      device: "",
      categoria: "",
      problema: "",
      descricaoDetalhada: "",
      prioridade: "",
      tecnico: "",
      prazo: "",
      valor: "",
      servicoSelecionado: "",
      status: ""
    });
    setOsPhotos([]);
    setInspectionData(null);
    setShowInspection(false);
  };

  // Funções para gerenciar tipos de serviços
  const handleCreateServiceType = () => {
    if (!serviceTypeForm.nome || !serviceTypeForm.categoria || !serviceTypeForm.preco) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newServiceType = {
      id: `srv${String(registeredServices.length + 1).padStart(3, '0')}`,
      nome: serviceTypeForm.nome,
      categoria: serviceTypeForm.categoria,
      descricao: serviceTypeForm.descricao,
      preco: parseFloat(serviceTypeForm.preco),
      tempoEstimado: serviceTypeForm.tempoEstimado
    };

    setRegisteredServices([...registeredServices, newServiceType]);
    
    toast({
      title: "Tipo de Serviço Criado",
      description: `${newServiceType.nome} foi adicionado ao catálogo!`,
    });

    resetServiceTypeForm();
    setIsNewServiceTypeOpen(false);
  };

  const resetServiceTypeForm = () => {
    setServiceTypeForm({
      nome: "",
      categoria: "",
      descricao: "",
      preco: "",
      tempoEstimado: ""
    });
  };

  const handleSelectServiceType = (serviceId: string) => {
    const selectedService = registeredServices.find(s => s.id === serviceId);
    if (selectedService) {
      setFormData({
        ...formData,
        servicoSelecionado: serviceId,
        problema: selectedService.nome,
        descricaoDetalhada: selectedService.descricao,
        valor: selectedService.preco.toString(),
        categoria: selectedService.categoria
      });
    }
  };

  const handleRemoveServiceType = (serviceId: string) => {
    setRegisteredServices(registeredServices.filter(s => s.id !== serviceId));
    toast({
      title: "Serviço Removido",
      description: "Tipo de serviço foi removido do catálogo.",
    });
  };

  return (
    <PageContainer 
      title="Gestão de Serviços" 
      description="Sistema completo para gerenciamento de ordens de serviço e assistência técnica"
      action={
        <div className="flex gap-2">
          {/* Indicador de notificações */}
          <DropdownMenu open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4 mr-2" />
                Alertas
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-background border shadow-lg" align="end">
              <div className="p-3 border-b">
                <h3 className="font-semibold">Notificações</h3>
                <p className="text-xs text-muted-foreground">
                  {notifications.filter(n => !n.read).length} não lidas
                </p>
              </div>
              <ScrollArea className="h-64">
                <div className="p-2 space-y-2">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        !notification.read 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-muted/50 border-muted'
                      }`}
                      onClick={() => {
                        if (notification.osId) {
                          const service = mockServices.find(s => s.id === notification.osId);
                          if (service) {
                            handleViewService(service);
                            setIsNotificationsOpen(false);
                          }
                        }
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'urgent' ? 'bg-destructive' :
                          notification.type === 'success' ? 'bg-success' : 'bg-primary'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full">
                  Marcar todas como lidas
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Analytics Dashboard */}
          <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Dashboard de Analytics
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-primary">{stats.total}</h3>
                        <p className="text-sm text-muted-foreground">Total de OS</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-success">{stats.taxaConclusao.toFixed(1)}%</h3>
                        <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-accent">R$ {stats.receitaMedia.toFixed(0)}</h3>
                        <p className="text-sm text-muted-foreground">Ticket Médio</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-warning">3.2 dias</h3>
                        <p className="text-sm text-muted-foreground">Tempo Médio</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Status das OS</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries({
                          "Em andamento": stats.emAndamento,
                          "Finalizado": stats.finalizados,
                          "Aguardando peça": stats.aguardando,
                          "Orçamento": stats.orcamentos
                        }).map(([status, count]) => (
                          <div key={status} className="flex items-center justify-between">
                            <span className="text-sm">{status}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-primary"
                                  style={{width: `${(count / stats.total) * 100}%`}}
                                />
                              </div>
                              <span className="text-sm font-medium w-8">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Dispositivos Mais Atendidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { device: "Smartphones", count: 4, percent: 67 },
                          { device: "Laptops", count: 1, percent: 17 },
                          { device: "Tablets", count: 1, percent: 16 }
                        ].map((item) => (
                          <div key={item.device} className="flex items-center justify-between">
                            <span className="text-sm">{item.device}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-accent"
                                  style={{width: `${item.percent}%`}}
                                />
                              </div>
                              <span className="text-sm font-medium w-8">{item.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Templates de Diagnóstico */}
          <Dialog open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Templates de Diagnóstico</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="smartphone" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="smartphone">Smartphones</TabsTrigger>
                  <TabsTrigger value="laptop">Laptops</TabsTrigger>
                  <TabsTrigger value="tablet">Tablets</TabsTrigger>
                </TabsList>
                {Object.entries(diagnosticTemplates).map(([category, tests]) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Checklist padrão para diagnóstico de {category}s
                    </p>
                    <div className="space-y-2">
                      {tests.map((test, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 border rounded-lg">
                          <Checkbox id={`test-${category}-${index}`} />
                          <Label htmlFor={`test-${category}-${index}`} className="text-sm">
                            {test}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" size="sm">
                      Aplicar Template à OS Selecionada
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>
            </DialogContent>
          </Dialog>

          {/* Auto-refresh Toggle */}
          <div className="flex items-center gap-2 px-3 py-1 border rounded-md">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-3 h-3"
              />
              <span className="text-xs">Auto-refresh</span>
            </label>
            <Separator orientation="vertical" className="h-4" />
            <Activity className={`w-3 h-3 ${autoRefresh ? 'text-success animate-pulse' : 'text-muted-foreground'}`} />
          </div>

          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-background border shadow-lg" align="end">
              <DropdownMenuItem>
                <Zap className="w-4 h-4 mr-2" />
                Configurar Automações
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="w-4 h-4 mr-2" />
                Gerenciar Notificações
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Técnicos
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ExternalLink className="w-4 h-4 mr-2" />
                Integrações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botão Gerenciar Serviços */}
          <Dialog open={isManageServicesOpen} onOpenChange={setIsManageServicesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Gerenciar Serviços
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Catálogo de Serviços</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">
                    Gerencie os tipos de serviços oferecidos pela sua assistência técnica
                  </p>
                  <Dialog open={isNewServiceTypeOpen} onOpenChange={setIsNewServiceTypeOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Serviço
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Cadastrar Novo Tipo de Serviço</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="serviceName">Nome do Serviço *</Label>
                            <Input 
                              id="serviceName"
                              placeholder="Ex: Troca de Tela iPhone X"
                              value={serviceTypeForm.nome}
                              onChange={(e) => setServiceTypeForm({...serviceTypeForm, nome: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="serviceCategory">Categoria *</Label>
                            <Select value={serviceTypeForm.categoria} onValueChange={(value) => setServiceTypeForm({...serviceTypeForm, categoria: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="smartphone">Smartphone</SelectItem>
                                <SelectItem value="laptop">Laptop</SelectItem>
                                <SelectItem value="tablet">Tablet</SelectItem>
                                <SelectItem value="watch">Smartwatch</SelectItem>
                                <SelectItem value="headphone">Fones de Ouvido</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="serviceDescription">Descrição</Label>
                          <Textarea 
                            id="serviceDescription"
                            placeholder="Descrição detalhada do serviço..."
                            value={serviceTypeForm.descricao}
                            onChange={(e) => setServiceTypeForm({...serviceTypeForm, descricao: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="servicePrice">Preço (R$) *</Label>
                            <Input 
                              id="servicePrice"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={serviceTypeForm.preco}
                              onChange={(e) => setServiceTypeForm({...serviceTypeForm, preco: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="serviceTime">Tempo Estimado</Label>
                            <Input 
                              id="serviceTime"
                              placeholder="Ex: 2-3 horas"
                              value={serviceTypeForm.tempoEstimado}
                              onChange={(e) => setServiceTypeForm({...serviceTypeForm, tempoEstimado: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => {setIsNewServiceTypeOpen(false); resetServiceTypeForm();}}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateServiceType}>
                          <Save className="w-4 h-4 mr-2" />
                          Cadastrar Serviço
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Lista de Serviços Cadastrados */}
                <div className="grid gap-4">
                  {registeredServices.map((service) => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {getCategoryIcon(service.categoria)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{service.nome}</h3>
                              <p className="text-sm text-muted-foreground">{service.descricao}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {service.categoria}
                                </Badge>
                                {service.tempoEstimado && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Timer className="w-3 h-3" />
                                    {service.tempoEstimado}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-lg font-bold text-success">R$ {service.preco.toFixed(2)}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleRemoveServiceType(service.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewServiceOpen} onOpenChange={setIsNewServiceOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:shadow-glow transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Nova OS
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
              <DialogHeader className="pb-4 border-b bg-gradient-to-r from-primary/5 to-primary/10 -m-6 p-6 mb-6">
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  Nova Ordem de Serviço
                  <Badge variant="secondary" className="ml-auto">
                    {Object.values(formData).filter(val => val !== "").length}/14 campos
                  </Badge>
                </DialogTitle>
                <p className="text-muted-foreground mt-2">
                  Preencha as informações para criar uma nova ordem de serviço
                </p>
              </DialogHeader>
              
              <div className="overflow-y-auto max-h-[calc(95vh-140px)] pr-2">
                <div className="grid gap-8 py-2">
                {/* Informações do Cliente */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Dados do Cliente
                    <div className="ml-auto">
                      <Badge variant={formData.cliente && formData.telefone ? "default" : "secondary"} className="text-xs">
                        {formData.cliente && formData.telefone ? "Completo" : "Pendente"}
                      </Badge>
                    </div>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cliente">Nome Completo *</Label>
                      <Input 
                        id="cliente" 
                        placeholder="Nome do cliente"
                        value={formData.cliente}
                        onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input 
                        id="telefone" 
                        placeholder="(11) 99999-9999"
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="cliente@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Informações do Dispositivo */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/20 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-accent to-accent/80 rounded-lg shadow-glow">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    Dispositivo
                    <div className="ml-auto">
                      <Badge variant={formData.device && formData.categoria ? "default" : "secondary"} className="text-xs">
                        {formData.device && formData.categoria ? "Completo" : "Pendente"}
                      </Badge>
                    </div>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="device">Modelo do Dispositivo *</Label>
                      <Input 
                        id="device" 
                        placeholder="Ex: iPhone 14 Pro, Samsung Galaxy S23"
                        value={formData.device}
                        onChange={(e) => setFormData({...formData, device: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smartphone">Smartphone</SelectItem>
                          <SelectItem value="laptop">Laptop</SelectItem>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="watch">Smartwatch</SelectItem>
                          <SelectItem value="headphone">Fones de Ouvido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Problema e Diagnóstico */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-warning/5 to-warning/10 rounded-xl border border-warning/20 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-warning to-warning/80 rounded-lg shadow-glow">
                      <Tool className="w-5 h-5 text-white" />
                    </div>
                    Serviço / Problema
                    <div className="ml-auto">
                      <Badge variant={formData.problema ? "default" : "secondary"} className="text-xs">
                        {formData.problema ? "Definido" : "Pendente"}
                      </Badge>
                    </div>
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="servicoSelecionado">Selecionar Serviço Cadastrado</Label>
                      <Select value={formData.servicoSelecionado} onValueChange={handleSelectServiceType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um serviço do catálogo (opcional)" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {registeredServices.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{service.nome}</span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  R$ {service.preco.toFixed(2)}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.servicoSelecionado && (
                        <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Serviço selecionado preencherá automaticamente os campos abaixo
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setFormData({...formData, servicoSelecionado: ""})}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Limpar
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="problema">Resumo do Problema *</Label>
                      <Input 
                        id="problema" 
                        placeholder="Ex: Tela quebrada, não carrega, bateria viciada"
                        value={formData.problema}
                        onChange={(e) => setFormData({...formData, problema: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descricaoDetalhada">Descrição Detalhada</Label>
                      <Textarea 
                        id="descricaoDetalhada" 
                        placeholder="Descreva detalhadamente o problema relatado pelo cliente, sintomas observados, etc..."
                        rows={4}
                        value={formData.descricaoDetalhada}
                        onChange={(e) => setFormData({...formData, descricaoDetalhada: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Configurações da OS */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-success/5 to-success/10 rounded-xl border border-success/20 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-success to-success/80 rounded-lg shadow-glow">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    Configurações da OS
                    <div className="ml-auto">
                      <Badge variant={formData.prioridade && formData.status ? "default" : "secondary"} className="text-xs">
                        {formData.prioridade && formData.status ? "Configurado" : "Pendente"}
                      </Badge>
                    </div>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prioridade">Prioridade</Label>
                      <Select value={formData.prioridade} onValueChange={(value) => setFormData({...formData, prioridade: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Baixa">Baixa</SelectItem>
                          <SelectItem value="Média">Média</SelectItem>
                          <SelectItem value="Alta">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tecnico">Técnico Responsável</Label>
                      <Select value={formData.tecnico} onValueChange={(value) => setFormData({...formData, tecnico: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Carlos Santos">Carlos Santos</SelectItem>
                          <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                          <SelectItem value="João Lima">João Lima</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prazo">Prazo de Entrega</Label>
                      <Input 
                        id="prazo" 
                        type="date"
                        value={formData.prazo}
                        onChange={(e) => setFormData({...formData, prazo: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor Estimado (R$)</Label>
                      <Input 
                        id="valor" 
                        type="number"
                        placeholder="0.00"
                        value={formData.valor}
                        onChange={(e) => setFormData({...formData, valor: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status Inicial</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
                          <SelectItem value="Orçamento">Orçamento</SelectItem>
                          <SelectItem value="Em andamento">Em andamento</SelectItem>
                          <SelectItem value="Aguardando peça">Aguardando peça</SelectItem>
                          <SelectItem value="Finalizado">Finalizado</SelectItem>
                          <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Inspeção de Entrada */}
                <div className="space-y-4 p-6 bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 rounded-xl border border-indigo-500/20 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-glow">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    Inspeção de Entrada
                    <div className="ml-auto">
                      <Badge variant={inspectionData ? "default" : "secondary"} className="text-xs">
                        {inspectionData ? "Concluída" : "Pendente"}
                      </Badge>
                    </div>
                  </h3>
                  
                  {!showInspection && !inspectionData && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Realize a inspeção completa do aparelho com vídeo de entrada e checklist detalhado
                      </p>
                      <Button 
                        onClick={() => setShowInspection(true)}
                        className="bg-indigo-600 hover:bg-indigo-700"
                        disabled={!formData.categoria}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Iniciar Inspeção
                      </Button>
                      {!formData.categoria && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selecione a categoria do dispositivo primeiro
                        </p>
                      )}
                    </div>
                  )}

                  {showInspection && (
                    <DeviceInspection
                      deviceType={formData.categoria}
                      onComplete={(data) => {
                        setInspectionData(data);
                        setShowInspection(false);
                        toast({
                          title: "Inspeção finalizada",
                          description: "Dados da inspeção salvos com sucesso"
                        });
                      }}
                    />
                  )}

                  {inspectionData && !showInspection && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-success/10 rounded-lg p-3">
                          <div className="text-xl font-bold text-success">
                            {inspectionData.checklist?.filter((item: any) => item.status === "ok").length || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Itens OK</div>
                        </div>
                        <div className="bg-destructive/10 rounded-lg p-3">
                          <div className="text-xl font-bold text-destructive">
                            {inspectionData.checklist?.filter((item: any) => item.status === "problem").length || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Problemas</div>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-3">
                          <div className="text-xl font-bold text-primary">
                            {inspectionData.videoBlob ? "Sim" : "Não"}
                          </div>
                          <div className="text-sm text-muted-foreground">Vídeo</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowInspection(true)}
                          className="flex-1"
                        >
                          Revisar Inspeção
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setInspectionData(null)}
                          className="flex-1"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Refazer
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Upload de Fotos */}
                <div className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/20 hover:shadow-lg transition-all duration-300">
                  <PhotoUpload 
                    onPhotosChange={setOsPhotos}
                    maxPhotos={8}
                  />
                </div>

                <Separator className="my-6" />

                {/* Gravação de Vídeo */}
                <VideoRecordingCard 
                  osNumber={selectedService?.id}
                  className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300"
                />

                <div className="flex justify-between items-center gap-4 pt-6 mt-8 border-t bg-gradient-to-r from-muted/50 to-muted/30 -mx-6 px-6 pb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse"></div>
                    {Object.values(formData).filter(val => val !== "").length > 8 ? "Quase pronto!" : "Preencha os campos obrigatórios"}
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {setIsNewServiceOpen(false); resetNewServiceForm();}}
                      className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button 
                      className="bg-gradient-primary hover:shadow-glow transition-all disabled:opacity-50" 
                      onClick={handleCreateService}
                      disabled={!formData.cliente || !formData.telefone || !formData.device || !formData.problema}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Criar Ordem de Serviço
                      {osPhotos.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          +{osPhotos.length} fotos
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {/* Dashboard de Estatísticas Expandido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">Em Andamento</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-primary">{stats.emAndamento}</p>
                  <div className="flex flex-col">
                    <Badge variant="secondary" className="text-xs mb-1">
                      {stats.total > 0 ? Math.round((stats.emAndamento / stats.total) * 100) : 0}%
                    </Badge>
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary rounded-full transition-all duration-1000"
                          style={{width: `${stats.total > 0 ? (stats.emAndamento / stats.total) * 100 : 0}%`}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-success/5 to-success/10 border border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-success to-success/80 rounded-xl shadow-md">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">Finalizados</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-success">{stats.finalizados}</p>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="w-3 h-3 text-success" />
                      <span className="text-xs text-success font-semibold">{stats.taxaConclusao.toFixed(1)}%</span>
                    </div>
                    <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-success to-success/70 rounded-full transition-all duration-1000"
                        style={{width: `${stats.taxaConclusao}%`}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-destructive/5 to-destructive/10 border border-destructive/20 relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-destructive to-destructive/80 rounded-xl shadow-md animate-pulse">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">Vencidos</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-destructive">{stats.vencidos}</p>
                  <div className="flex flex-col">
                    <Badge variant="destructive" className="text-xs mb-1 animate-pulse">
                      Urgente
                    </Badge>
                    {stats.vencidos > 0 && (
                      <div className="flex items-center gap-1">
                        <Bell className="w-3 h-3 text-destructive animate-bounce" />
                        <span className="text-xs text-destructive font-medium">Ação Necessária</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {stats.vencidos > 0 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-destructive to-destructive/50" />
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Hoje</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold">{stats.hojePrazos}</p>
                  <Badge variant="outline" className="text-xs">
                    Prazos
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Receita</p>
                <p className="text-lg font-bold">
                  R$ {(stats.receita / 1000).toFixed(1)}k
                </p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">+{stats.crescimento}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Meta Mensal</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold">{Math.round(stats.taxaConclusao)}%</p>
                  <Badge variant="secondary" className="text-xs">
                    85% Meta
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Ferramentas Avançada */}
      <Card className="mb-6">
        <CardContent className="p-4">
          {/* Ações em massa */}
          {selectedServices.length > 0 && (
            <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={selectedServices.length === filteredAndSortedServices.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    {selectedServices.length} item(s) selecionado(s)
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <DropdownMenu open={bulkActionsOpen} onOpenChange={setBulkActionsOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" disabled={isLoading}>
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Settings className="w-4 h-4 mr-2" />
                        )}
                        Ações em Massa
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-background border shadow-lg">
                      <DropdownMenuItem onClick={() => handleBulkStatusChange("Em andamento")}>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Iniciar Serviços
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusChange("Finalizado")}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Finalizar Serviços
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusChange("Aguardando peça")}>
                        <PauseCircle className="w-4 h-4 mr-2" />
                        Aguardar Peças
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleBulkPrint}>
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir Selecionadas
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedServices([])}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Limpar Seleção
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleBulkDelete} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover Selecionadas
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button variant="outline" size="sm" onClick={() => setSelectedServices([])}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Filtros e busca */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, dispositivo, OS, problema ou técnico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Aguardando peça">Aguardando peça</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                  <SelectItem value="Orçamento">Orçamento</SelectItem>
                  <SelectItem value="Diagnóstico">Diagnóstico</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="smartphone">Smartphone</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="watch">Smartwatch</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-background border shadow-lg">
                  <DropdownMenuItem onClick={() => {setSortBy("entrada"); setSortOrder("desc")}}>
                    <Clock className="w-4 h-4 mr-2" />
                    Mais Recentes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {setSortBy("entrada"); setSortOrder("asc")}}>
                    <Clock className="w-4 h-4 mr-2" />
                    Mais Antigas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {setSortBy("prazo"); setSortOrder("asc")}}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Prazo: Próximos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {setSortBy("valor"); setSortOrder("desc")}}>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Maior Valor
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {setSortBy("cliente"); setSortOrder("asc")}}>
                    <User className="w-4 h-4 mr-2" />
                    Cliente A-Z
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredAndSortedServices.length} de {stats.total} ordens de serviço
              {selectedServices.length > 0 && ` • ${selectedServices.length} selecionada(s)`}
            </p>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                Lista
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista/Grade de Serviços Aprimorada */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
        {filteredAndSortedServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
            <CardContent className="p-6">
              {/* Checkbox de seleção */}
              <div className="flex items-start gap-3">
                <Checkbox 
                  checked={selectedServices.includes(service.id)}
                  onCheckedChange={() => handleSelectService(service.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  {/* Header da OS */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getCategoryIcon(service.categoria)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary text-lg">#{service.id}</span>
                          <Badge className={`${statusColors[service.status as keyof typeof statusColors]} border text-xs`}>
                            {getStatusIcon(service.status)}
                            <span className="ml-1">{service.status}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Entrada: {service.entrada}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${priorityColors[service.prioridade as keyof typeof priorityColors]} border text-xs`}>
                        {service.prioridade}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 bg-background border shadow-lg" align="end">
                          <DropdownMenuItem onClick={() => handleViewService(service)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditService(service)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar OS
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrintService(service)}>
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimir OS
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar OS
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="w-4 h-4 mr-2" />
                            Enviar para Cliente
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Arquivar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir OS
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Informações do Cliente */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.cliente}</p>
                    <p className="text-xs text-muted-foreground">{service.telefone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.device}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{service.problema}</p>
                  </div>
                </div>

                {service.tecnico !== "-" && (
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{service.tecnico}</p>
                      <p className="text-xs text-muted-foreground">Técnico responsável</p>
                    </div>
                  </div>
                )}
              </div>

                  {/* Progresso */}
                  {service.progresso > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Progresso</span>
                        <span className="text-xs font-medium">{service.progresso}%</span>
                      </div>
                      <Progress value={service.progresso} className="h-2" />
                    </div>
                  )}

                  {/* Footer com Valor e Ações Rápidas */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {service.valor > 0 ? `R$ ${service.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "A orçar"}
                      </span>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewService(service)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditService(service)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {service.status === "Finalizado" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-success"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vazio aprimorado */}
      {filteredAndSortedServices.length === 0 && (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Nenhuma OS encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all"
                  ? "Tente ajustar os filtros de busca ou limpe os filtros para ver todas as ordens"
                  : "Comece criando sua primeira ordem de serviço"
                }
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              {(searchTerm || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all") ? (
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setCategoryFilter("all");
                }}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              ) : (
                <Button className="bg-gradient-primary" onClick={() => setIsNewServiceOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="flex items-center gap-1">
                    Criar Primeira OS
                    <Sparkles className="w-4 h-4" />
                  </span>
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Modal de Visualização Detalhada */}
      <Dialog open={viewServiceOpen} onOpenChange={setViewServiceOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Ordem de Serviço #{selectedService?.id}
              </div>
              <Button 
                onClick={() => setDeliveryModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                ENTREGAR APARELHO
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedService && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
                <TabsTrigger value="parts">Peças</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações do Cliente */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Cliente
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Nome</Label>
                        <p className="font-medium">{selectedService.cliente}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Telefone</Label>
                        <p className="font-medium">{selectedService.telefone}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">E-mail</Label>
                        <p className="font-medium">{selectedService.email}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Informações do Dispositivo */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        {getCategoryIcon(selectedService.categoria)}
                        Dispositivo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Modelo</Label>
                        <p className="font-medium">{selectedService.device}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Categoria</Label>
                        <p className="font-medium capitalize">{selectedService.categoria}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Problema</Label>
                        <p className="font-medium">{selectedService.problema}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Status e Progresso */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Status do Serviço
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`${statusColors[selectedService.status as keyof typeof statusColors]} border`}>
                          {getStatusIcon(selectedService.status)}
                          <span className="ml-1">{selectedService.status}</span>
                        </Badge>
                        <Badge className={`${priorityColors[selectedService.prioridade as keyof typeof priorityColors]} border`}>
                          {selectedService.prioridade}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Prazo: {selectedService.prazo}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">Progresso do Reparo</Label>
                        <span className="text-sm font-medium">{selectedService.progresso}%</span>
                      </div>
                      <Progress value={selectedService.progresso} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Técnico</Label>
                        <p className="font-medium">{selectedService.tecnico || "Não atribuído"}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Valor</Label>
                        <p className="font-medium text-lg">
                          {selectedService.valor > 0 ? `R$ ${selectedService.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "A orçar"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Descrição Detalhada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{selectedService.descricaoDetalhada}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{selectedService.observacoes}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Histórico de Atividades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedService.historico.map((item: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.acao}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">{item.data}</p>
                              <Badge variant="outline" className="text-xs">{item.usuario}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="parts" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Peças Necessárias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedService.pecas.length > 0 ? (
                      <div className="space-y-2">
                        {selectedService.pecas.map((peca: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{peca}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma peça necessária para este serviço.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={editServiceOpen} onOpenChange={setEditServiceOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar OS #{selectedService?.id}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cliente">Cliente</Label>
                <Input 
                  id="edit-cliente" 
                  value={formData.cliente}
                  onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-telefone">Telefone</Label>
                <Input 
                  id="edit-telefone" 
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-problema">Problema</Label>
              <Textarea 
                id="edit-problema" 
                value={formData.problema}
                onChange={(e) => setFormData({...formData, problema: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={selectedService?.status} onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Aguardando peça">Aguardando peça</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                    <SelectItem value="Orçamento">Orçamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-valor">Valor</Label>
                <Input 
                  id="edit-valor" 
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditServiceOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Entrega - Mini PDV */}
      <Dialog open={deliveryModalOpen} onOpenChange={setDeliveryModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Entrega do Aparelho
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Resumo da OS #{selectedService?.id}</h4>
              <p className="text-sm text-gray-600">{selectedService?.cliente}</p>
              <p className="text-sm text-gray-600">{selectedService?.device}</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="valor-servico">Valor do Serviço</Label>
                <Input
                  id="valor-servico"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={deliveryData.valorServico}
                  onChange={(e) => setDeliveryData({...deliveryData, valorServico: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="valor-pecas">Valor das Peças</Label>
                <Input
                  id="valor-pecas"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={deliveryData.valorPecas}
                  onChange={(e) => setDeliveryData({...deliveryData, valorPecas: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="desconto">Desconto</Label>
                <Input
                  id="desconto"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={deliveryData.desconto}
                  onChange={(e) => setDeliveryData({...deliveryData, desconto: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="forma-pagamento">Forma de Pagamento</Label>
                <Select value={deliveryData.formaPagamento} onValueChange={(value) => setDeliveryData({...deliveryData, formaPagamento: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao-debito">Cartão de Débito</SelectItem>
                    <SelectItem value="cartao-credito">Cartão de Crédito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="observacoes-entrega">Observações</Label>
                <Textarea
                  id="observacoes-entrega"
                  placeholder="Observações sobre a entrega..."
                  value={deliveryData.observacoes}
                  onChange={(e) => setDeliveryData({...deliveryData, observacoes: e.target.value})}
                />
              </div>
            </div>

            <Separator />

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center font-medium">
                <span>Total:</span>
                <span className="text-lg">
                  R$ {((deliveryData.valorServico + deliveryData.valorPecas) - deliveryData.desconto).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setDeliveryModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Aparelho entregue!",
                    description: `OS #${selectedService?.id} finalizada com sucesso.`,
                  });
                  setDeliveryModalOpen(false);
                  setViewServiceOpen(false);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}