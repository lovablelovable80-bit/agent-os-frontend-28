import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ModernCard, ModernSection } from "@/components/mobile/ModernCard";
import { ModernList, ModernListItem } from "@/components/mobile/ModernListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNativeApp, usePlatformConfig } from "@/hooks/useNativeApp";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Filter,
  Camera,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Wrench,
  User,
  Calendar,
  DollarSign,
  Phone,
  MessageSquare,
  Package,
  FileText,
  Star,
  TrendingUp,
  Activity,
  Timer,
  ArrowRight,
  MoreVertical,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Eye,
  Edit,
  Printer,
  MapPin,
  Zap,
  Target,
  Users,
  BarChart3,
  Settings,
  Bell
} from "lucide-react";

// Mock data expandido - em produção viria do Supabase
const mockServices = [
  {
    id: "OS-2024-001",
    client: "João Silva",
    device: "iPhone 13 Pro",
    problem: "Tela quebrada",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-15",
    estimatedValue: 450.00,
    hasPhotos: true,
    hasVideos: false,
    technician: "Carlos Santos",
    clientPhone: "(11) 99999-9999",
    clientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
  },
  {
    id: "OS-2024-002", 
    client: "Maria Santos",
    device: "Samsung Galaxy S23",
    problem: "Bateria viciada",
    status: "in_progress",
    priority: "medium",
    createdAt: "2024-01-14",
    estimatedValue: 180.00,
    hasPhotos: false,
    hasVideos: true,
    technician: "Ana Silva",
    clientPhone: "(11) 88888-8888",
    clientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e9?w=40&h=40&fit=crop&crop=face"
  },
  {
    id: "OS-2024-003",
    client: "Pedro Oliveira", 
    device: "MacBook Air M2",
    problem: "Não liga",
    status: "completed",
    priority: "high",
    createdAt: "2024-01-13",
    estimatedValue: 800.00,
    hasPhotos: true,
    hasVideos: true,
    technician: "Roberto Lima",
    clientPhone: "(11) 77777-7777",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
  },
  {
    id: "OS-2024-004",
    client: "Ana Costa",
    device: "iPad Pro",
    problem: "Touch não responde",
    status: "pending",
    priority: "medium",
    createdAt: "2024-01-16",
    estimatedValue: 650.00,
    hasPhotos: true,
    hasVideos: false,
    technician: "Carlos Santos",
    clientPhone: "(11) 66666-6666",
    clientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
  }
];

const statusConfig = {
  pending: { label: "Pendente", color: "bg-warning", icon: Clock, variant: "secondary" as const },
  in_progress: { label: "Em Andamento", color: "bg-accent", icon: Wrench, variant: "default" as const },
  completed: { label: "Concluído", color: "bg-success", icon: CheckCircle, variant: "default" as const },
  cancelled: { label: "Cancelado", color: "bg-destructive", icon: XCircle, variant: "destructive" as const },
};

const priorityConfig = {
  low: { label: "Baixa", color: "text-muted-foreground" },
  medium: { label: "Média", color: "text-warning" },
  high: { label: "Alta", color: "text-destructive" },
};

export default function ServicesMobile() {
  const navigate = useNavigate();
  const { isNativeApp } = useNativeApp();
  const config = usePlatformConfig();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const stats = useMemo(() => {
    const pending = mockServices.filter(s => s.status === "pending").length;
    const inProgress = mockServices.filter(s => s.status === "in_progress").length;
    const completed = mockServices.filter(s => s.status === "completed").length;
    const totalValue = mockServices.reduce((acc, s) => acc + s.estimatedValue, 0);
    
    return { pending, inProgress, completed, totalValue };
  }, []);

  const filteredServices = useMemo(() => {
    return mockServices.filter(service => {
      const matchesSearch = service.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.problem.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = selectedFilter === "all" || service.status === selectedFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  const handleCreateNew = () => {
    navigate("/services/new");
  };

  const handleServiceClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  const handleCameraPress = () => {
    if (isNativeApp) {
      navigate("/photo-upload-mobile");
    } else {
      toast({
        title: "Funcionalidade Nativa",
        description: "Disponível apenas no app mobile nativo",
      });
    }
  };

  const handleVideoPress = () => {
    if (isNativeApp) {
      navigate("/video-recording-mobile");
    } else {
      toast({
        title: "Funcionalidade Nativa", 
        description: "Disponível apenas no app mobile nativo",
      });
    }
  };

  const handleClientAction = (action: string, phone: string) => {
    switch (action) {
      case "call":
        window.open(`tel:${phone}`, '_self');
        break;
      case "whatsapp":
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${cleanPhone}`, '_blank');
        break;
      default:
        toast({
          title: "Ação",
          description: `${action} em desenvolvimento`,
        });
    }
  };

  const getStatusInfo = (status: keyof typeof statusConfig) => statusConfig[status];
  const getPriorityInfo = (priority: keyof typeof priorityConfig) => priorityConfig[priority];

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className={config.containerPadding}>
      <div className="space-y-mobile">
        {/* Estatísticas de Dashboard */}
        <ModernSection title="Dashboard" icon={Activity}>
          <div className="grid grid-cols-2 gap-mobile">
            <ModernCard variant="elevated" size="sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <h4 className="text-mobile-xl font-bold text-foreground">
                  {stats.pending}
                </h4>
                <p className="text-mobile-xs text-muted-foreground">Pendentes</p>
              </div>
            </ModernCard>

            <ModernCard variant="elevated" size="sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Wrench className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-mobile-xl font-bold text-foreground">
                  {stats.inProgress}
                </h4>
                <p className="text-mobile-xs text-muted-foreground">Em Andamento</p>
              </div>
            </ModernCard>

            <ModernCard variant="elevated" size="sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <h4 className="text-mobile-xl font-bold text-foreground">
                  {stats.completed}
                </h4>
                <p className="text-mobile-xs text-muted-foreground">Concluídas</p>
              </div>
            </ModernCard>

            <ModernCard variant="elevated" size="sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-mobile-sm font-bold text-foreground">
                  {formatCurrency(stats.totalValue)}
                </h4>
                <p className="text-mobile-xs text-muted-foreground">Total</p>
              </div>
            </ModernCard>
          </div>
        </ModernSection>

        {/* Barra de Pesquisa */}
        <ModernCard variant="compact">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ordens de serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </ModernCard>

        {/* Ações Rápidas para App Nativo */}
        {isNativeApp && (
          <ModernSection title="Capture" icon={Camera}>
            <div className="grid grid-cols-2 gap-mobile">
              <Button
                onClick={handleCameraPress}
                variant="outline"
                className="h-20 flex-col gap-2"
              >
                <Camera className="w-6 h-6" />
                <span className="text-mobile-sm">Fotos</span>
              </Button>
              <Button
                onClick={handleVideoPress}
                variant="outline"
                className="h-20 flex-col gap-2"
              >
                <Video className="w-6 h-6" />
                <span className="text-mobile-sm">Vídeos</span>
              </Button>
            </div>
          </ModernSection>
        )}

        {/* Filtros Rápidos */}
        <ModernCard variant="compact">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: "all", label: "Todas", count: mockServices.length },
              { key: "pending", label: "Pendentes", count: mockServices.filter(s => s.status === "pending").length },
              { key: "in_progress", label: "Em Andamento", count: mockServices.filter(s => s.status === "in_progress").length },
              { key: "completed", label: "Concluídas", count: mockServices.filter(s => s.status === "completed").length },
            ].map(filter => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.key)}
                className="whitespace-nowrap"
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </ModernCard>

        {/* Lista de Ordens de Serviço */}
        <ModernSection 
          title="Ordens de Serviço"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate("/services")}>
              Ver todas
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >
          <ModernList variant="card">
            {filteredServices.map((service) => {
              const statusInfo = getStatusInfo(service.status as keyof typeof statusConfig);
              const priorityInfo = getPriorityInfo(service.priority as keyof typeof priorityConfig);
              const StatusIcon = statusInfo.icon;

              return (
                <ModernListItem
                  key={service.id}
                  title={service.id}
                  subtitle={`${service.client} • ${service.device}`}
                  description={service.problem}
                  avatar={service.clientAvatar}
                  badge={statusInfo.label}
                  badgeVariant={statusInfo.variant}
                  onPress={() => handleServiceClick(service.id)}
                  rightContent={
                    <div className="text-right space-y-1">
                      <div className="text-mobile-lg font-bold text-success">
                        {formatCurrency(service.estimatedValue)}
                      </div>
                      <div className={`text-mobile-xs font-medium ${priorityInfo.color}`}>
                        Prioridade: {priorityInfo.label}
                      </div>
                      <div className="flex items-center gap-1">
                        {service.hasPhotos && <Camera className="w-3 h-3 text-muted-foreground" />}
                        {service.hasVideos && <Video className="w-3 h-3 text-muted-foreground" />}
                        <span className="text-mobile-xs text-muted-foreground">
                          {formatDate(service.createdAt)}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClientAction("call", service.clientPhone);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Phone className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClientAction("whatsapp", service.clientPhone);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  }
                />
              );
            })}
          </ModernList>
        </ModernSection>

        {/* Progresso do Dia */}
        <ModernSection title="Meta do Dia">
          <ModernCard>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-mobile-sm text-muted-foreground">Ordens Concluídas</span>
                  <span className="text-mobile-sm font-medium">{stats.completed}/10</span>
                </div>
                <Progress value={(stats.completed / 10) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-mobile-sm text-muted-foreground">Faturamento</span>
                  <span className="text-mobile-sm font-medium">
                    {formatCurrency(stats.totalValue)}/R$ 5.000
                  </span>
                </div>
                <Progress value={(stats.totalValue / 5000) * 100} className="h-2" />
              </div>
            </div>
          </ModernCard>
        </ModernSection>

        {/* Ações Rápidas */}
        <ModernSection title="Ações Rápidas">
          <div className="grid grid-cols-2 gap-mobile">
            <Button
              onClick={handleCreateNew}
              variant="default"
              className="h-16 flex-col gap-2 bg-gradient-primary"
            >
              <Plus className="w-5 h-5" />
              <span className="text-mobile-xs">Nova OS</span>
            </Button>
            <Button
              onClick={() => navigate("/services/reports")}
              variant="outline"
              className="h-16 flex-col gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-mobile-xs">Relatórios</span>
            </Button>
          </div>
        </ModernSection>

        {/* Botão Flutuante para Nova OS */}
        <Button
          onClick={handleCreateNew}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg z-40 bg-gradient-primary"
          size="sm"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}