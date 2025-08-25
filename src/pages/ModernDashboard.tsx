import { ModernCard, ModernSection } from "@/components/mobile/ModernCard";
import { ModernHeader } from "@/components/mobile/ModernHeader";
import { ModernList, ModernListItem } from "@/components/mobile/ModernListItem";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNativeApp } from "@/hooks/useNativeApp";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Users,
  DollarSign,
  Camera,
  Video,
  Plus,
  Smartphone,
  Zap,
  Star,
  ArrowRight,
  Activity
} from "lucide-react";

export default function ModernDashboard() {
  const { isNativeApp } = useNativeApp();
  const navigate = useNavigate();

  // Mock data - em produção viria do Supabase
  const stats = {
    pendingOrders: 12,
    inProgress: 8,
    completed: 45,
    revenue: 15250.00,
    avgCompletionTime: 2.5,
    customerSatisfaction: 4.8
  };

  const recentOrders = [
    {
      id: "OS-001",
      client: "João Silva",
      device: "iPhone 14 Pro",
      status: "pending",
      value: 450.00,
      priority: "high",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: "OS-002", 
      client: "Maria Santos",
      device: "MacBook Air",
      status: "in_progress",
      value: 800.00,
      priority: "medium",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e9?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: "OS-003",
      client: "Pedro Costa",
      device: "Galaxy S23",
      status: "completed",
      value: 320.00,
      priority: "low",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    }
  ];

  const quickActions = [
    { icon: Plus, label: "Nova OS", action: () => navigate("/services/new"), primary: true },
    { icon: Camera, label: "Fotos", action: () => navigate("/photo-upload-mobile"), native: true },
    { icon: Video, label: "Vídeos", action: () => navigate("/video-recording-mobile"), native: true },
    { icon: Users, label: "Clientes", action: () => navigate("/customers") },
    { icon: BarChart3, label: "Relatórios", action: () => navigate("/gestao-geral") },
    { icon: Wrench, label: "Técnicos", action: () => navigate("/settings/access-control") }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Pendente", color: "bg-warning", icon: Clock };
      case "in_progress":
        return { label: "Em Andamento", color: "bg-accent", icon: Wrench };
      case "completed":
        return { label: "Concluído", color: "bg-success", icon: CheckCircle };
      default:
        return { label: "Desconhecido", color: "bg-muted", icon: AlertTriangle };
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-mobile">
      {/* Welcome Section */}
      <ModernSection 
        title="Bom dia!" 
        subtitle="Aqui está o resumo do seu negócio"
        icon={Activity}
      >
        <ModernCard variant="gradient" className="text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-mobile-2xl font-bold mb-1">
                {stats.pendingOrders + stats.inProgress}
              </h3>
              <p className="text-primary-foreground/80 text-mobile-sm">
                Ordens ativas hoje
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </ModernCard>
      </ModernSection>

      {/* Quick Stats */}
      <ModernSection title="Estatísticas">
        <div className="grid grid-cols-2 gap-mobile">
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
              <h4 className="text-mobile-xl font-bold text-foreground">
                {formatCurrency(stats.revenue)}
              </h4>
              <p className="text-mobile-xs text-muted-foreground">Faturamento</p>
            </div>
          </ModernCard>

          <ModernCard variant="elevated" size="sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-mobile-xl font-bold text-foreground">
                {stats.avgCompletionTime}d
              </h4>
              <p className="text-mobile-xs text-muted-foreground">Tempo médio</p>
            </div>
          </ModernCard>

          <ModernCard variant="elevated" size="sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-warning" />
              </div>
              <h4 className="text-mobile-xl font-bold text-foreground">
                {stats.customerSatisfaction}
              </h4>
              <p className="text-mobile-xs text-muted-foreground">Satisfação</p>
            </div>
          </ModernCard>
        </div>
      </ModernSection>

      {/* Quick Actions */}
      <ModernSection title="Ações Rápidas">
        <div className="grid grid-cols-3 gap-mobile">
          {quickActions
            .filter(action => !action.native || isNativeApp)
            .map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.primary ? "default" : "outline"}
                  onClick={action.action}
                  className={`h-20 flex-col gap-2 rounded-xl ${
                    action.primary ? 'bg-gradient-primary' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-mobile-xs">{action.label}</span>
                </Button>
              );
            })}
        </div>
      </ModernSection>

      {/* Native App Features */}
      {isNativeApp && (
        <ModernSection 
          title="Recursos Móveis"
          subtitle="Aproveite as funcionalidades nativas"
          icon={Smartphone}
        >
          <ModernCard variant="glass">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/photo-upload-mobile")}
                className="h-16 flex-col gap-2 border-dashed"
              >
                <Camera className="w-5 h-5" />
                <span className="text-mobile-xs">Capturar Fotos</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/video-recording-mobile")}
                className="h-16 flex-col gap-2 border-dashed"
              >
                <Video className="w-5 h-5" />
                <span className="text-mobile-xs">Gravar Vídeos</span>
              </Button>
            </div>
          </ModernCard>
        </ModernSection>
      )}

      {/* Recent Orders */}
      <ModernSection 
        title="Ordens Recentes"
        action={
          <Button variant="ghost" size="sm" onClick={() => navigate("/services")}>
            Ver todas
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        }
      >
        <ModernList variant="card">
          {recentOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <ModernListItem
                key={order.id}
                title={order.id}
                subtitle={`${order.client} • ${order.device}`}
                avatar={order.avatar}
                badge={statusInfo.label}
                badgeVariant={order.status === 'completed' ? 'default' : 'secondary'}
                onPress={() => navigate(`/services/${order.id}`)}
                rightContent={
                  <div className="text-right">
                    <p className="text-mobile-sm font-semibold text-success">
                      {formatCurrency(order.value)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`status-dot ${
                        order.status === 'pending' ? 'status-pending' :
                        order.status === 'in_progress' ? 'status-progress' :
                        'status-completed'
                      }`} />
                      <span className="text-mobile-xs text-muted-foreground">
                        {order.priority === 'high' ? 'Alta' : 
                         order.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                  </div>
                }
              />
            );
          })}
        </ModernList>
      </ModernSection>

      {/* Performance Metrics */}
      <ModernSection title="Desempenho do Mês">
        <ModernCard>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-mobile-sm text-muted-foreground">Meta de Ordens</span>
                <span className="text-mobile-sm font-medium">75/100</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-mobile-sm text-muted-foreground">Satisfação</span>
                <span className="text-mobile-sm font-medium">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-mobile-sm text-muted-foreground">Pontualidade</span>
                <span className="text-mobile-sm font-medium">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
          </div>
        </ModernCard>
      </ModernSection>
    </div>
  );
}