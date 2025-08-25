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
  Users,
  Target,
  DollarSign,
  Calendar,
  TrendingUp,
  Phone,
  Mail,
  MessageSquare,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowRight
} from "lucide-react";

// Mock data - em produção viria do Supabase
const dashboardStats = [
  { title: "Total de Leads", value: "147", icon: Users, change: "+12%", changeType: "positive" },
  { title: "Conversão", value: "23%", icon: Target, change: "+5%", changeType: "positive" },
  { title: "Vendas do Mês", value: "R$ 45.2k", icon: DollarSign, change: "+18%", changeType: "positive" },
  { title: "Follow-ups", value: "32", icon: Calendar, change: "-3%", changeType: "negative" }
];

const leads = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-9999",
    status: "Novo",
    value: 2500,
    source: "Website",
    lastContact: "2024-01-20",
    priority: "high",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e9?w=40&h=40&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "João Santos", 
    email: "joao@email.com",
    phone: "(11) 88888-8888",
    status: "Qualificado",
    value: 5000,
    source: "Indicação",
    lastContact: "2024-01-19",
    priority: "high",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@email.com", 
    phone: "(11) 77777-7777",
    status: "Proposta",
    value: 3200,
    source: "Redes Sociais",
    lastContact: "2024-01-18",
    priority: "medium",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Pedro Oliveira",
    email: "pedro@email.com",
    phone: "(11) 66666-6666",
    status: "Ganho",
    value: 4800,
    source: "Indicação",
    lastContact: "2024-01-17",
    priority: "high",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
  }
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case "Novo":
      return { label: "Novo", color: "bg-accent", variant: "default" as const, icon: AlertCircle };
    case "Qualificado":
      return { label: "Qualificado", color: "bg-warning", variant: "secondary" as const, icon: Clock };
    case "Proposta":
      return { label: "Proposta", color: "bg-primary", variant: "default" as const, icon: Target };
    case "Ganho":
      return { label: "Ganho", color: "bg-success", variant: "default" as const, icon: CheckCircle };
    case "Perdido":
      return { label: "Perdido", color: "bg-destructive", variant: "destructive" as const, icon: AlertCircle };
    default:
      return { label: "Pendente", color: "bg-muted", variant: "outline" as const, icon: Clock };
  }
};

const getPriorityInfo = (priority: string) => {
  switch (priority) {
    case "high":
      return { label: "Alta", color: "text-destructive" };
    case "medium":
      return { label: "Média", color: "text-warning" };
    case "low":
      return { label: "Baixa", color: "text-muted-foreground" };
    default:
      return { label: "Normal", color: "text-foreground" };
  }
};

export default function CRMMobile() {
  const navigate = useNavigate();
  const { isNativeApp } = useNativeApp();
  const config = usePlatformConfig();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.phone.includes(searchTerm);
      
      const matchesFilter = selectedFilter === "all" || lead.status === selectedFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  const conversionStats = useMemo(() => {
    const total = leads.length;
    const novo = leads.filter(l => l.status === "Novo").length;
    const qualificado = leads.filter(l => l.status === "Qualificado").length;
    const proposta = leads.filter(l => l.status === "Proposta").length;
    const ganho = leads.filter(l => l.status === "Ganho").length;
    
    return {
      novo: (novo / total) * 100,
      qualificado: (qualificado / total) * 100,
      proposta: (proposta / total) * 100,
      ganho: (ganho / total) * 100
    };
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleLeadAction = (action: string, leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    
    switch (action) {
      case "call":
        if (lead?.phone) {
          window.open(`tel:${lead.phone}`, '_self');
        }
        break;
      case "email":
        if (lead?.email) {
          window.open(`mailto:${lead.email}`, '_self');
        }
        break;
      case "whatsapp":
        if (lead?.phone) {
          const phone = lead.phone.replace(/\D/g, '');
          window.open(`https://wa.me/55${phone}`, '_blank');
        }
        break;
      case "edit":
        navigate(`/crm/leads/${leadId}/edit`);
        break;
      case "view":
        navigate(`/crm/leads/${leadId}`);
        break;
      default:
        toast({
          title: "Funcionalidade",
          description: `${action} em desenvolvimento`,
        });
    }
  };

  return (
    <div className={config.containerPadding}>
      <div className="space-y-mobile">
        {/* Dashboard Stats */}
        <ModernSection title="Desempenho" icon={Activity}>
          <div className="grid grid-cols-2 gap-mobile">
            {dashboardStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <ModernCard key={index} variant="elevated" size="sm">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-mobile-xl font-bold text-foreground">
                      {stat.value}
                    </h4>
                    <p className="text-mobile-xs text-muted-foreground">{stat.title}</p>
                    <div className={`text-mobile-xs font-medium mt-1 ${
                      stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                </ModernCard>
              );
            })}
          </div>
        </ModernSection>

        {/* Funil de Conversão */}
        <ModernSection title="Funil de Vendas">
          <ModernCard>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-mobile-sm text-muted-foreground">Novos Leads</span>
                  <span className="text-mobile-sm font-medium">{conversionStats.novo.toFixed(0)}%</span>
                </div>
                <Progress value={conversionStats.novo} className="h-2 bg-accent/20">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${conversionStats.novo}%` }} />
                </Progress>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-mobile-sm text-muted-foreground">Qualificados</span>
                  <span className="text-mobile-sm font-medium">{conversionStats.qualificado.toFixed(0)}%</span>
                </div>
                <Progress value={conversionStats.qualificado} className="h-2 bg-warning/20">
                  <div className="h-full bg-warning rounded-full transition-all" style={{ width: `${conversionStats.qualificado}%` }} />
                </Progress>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-mobile-sm text-muted-foreground">Propostas</span>
                  <span className="text-mobile-sm font-medium">{conversionStats.proposta.toFixed(0)}%</span>
                </div>
                <Progress value={conversionStats.proposta} className="h-2 bg-primary/20">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${conversionStats.proposta}%` }} />
                </Progress>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-mobile-sm text-muted-foreground">Fechados</span>
                  <span className="text-mobile-sm font-medium">{conversionStats.ganho.toFixed(0)}%</span>
                </div>
                <Progress value={conversionStats.ganho} className="h-2 bg-success/20">
                  <div className="h-full bg-success rounded-full transition-all" style={{ width: `${conversionStats.ganho}%` }} />
                </Progress>
              </div>
            </div>
          </ModernCard>
        </ModernSection>

        {/* Barra de Pesquisa */}
        <ModernCard variant="compact">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar leads..."
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

        {/* Filtros por Status */}
        <ModernCard variant="compact">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: "all", label: "Todos", count: leads.length },
              { key: "Novo", label: "Novos", count: leads.filter(l => l.status === "Novo").length },
              { key: "Qualificado", label: "Qualificados", count: leads.filter(l => l.status === "Qualificado").length },
              { key: "Proposta", label: "Propostas", count: leads.filter(l => l.status === "Proposta").length },
              { key: "Ganho", label: "Fechados", count: leads.filter(l => l.status === "Ganho").length },
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

        {/* Lista de Leads */}
        <ModernSection 
          title="Leads Ativos"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate("/crm")}>
              Ver todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >
          <ModernList variant="card">
            {filteredLeads.map((lead) => {
              const statusInfo = getStatusInfo(lead.status);
              const priorityInfo = getPriorityInfo(lead.priority);
              const StatusIcon = statusInfo.icon;

              return (
                <ModernListItem
                  key={lead.id}
                  title={lead.name}
                  subtitle={lead.email}
                  description={`${lead.source} • ${formatDate(lead.lastContact)}`}
                  avatar={lead.avatar}
                  badge={statusInfo.label}
                  badgeVariant={statusInfo.variant}
                  onPress={() => handleLeadAction("view", lead.id)}
                  leftContent={
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  }
                  rightContent={
                    <div className="text-right space-y-1">
                      <div className="text-mobile-lg font-bold text-success">
                        {formatCurrency(lead.value)}
                      </div>
                      <div className={`text-mobile-xs font-medium ${priorityInfo.color}`}>
                        Prioridade: {priorityInfo.label}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <StatusIcon className="w-3 h-3" />
                        <span className="text-mobile-xs text-muted-foreground">
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeadAction("call", lead.id);
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
                            handleLeadAction("whatsapp", lead.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLeadAction("email", lead.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Mail className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  }
                />
              );
            })}
          </ModernList>
        </ModernSection>

        {/* Ações Rápidas */}
        <ModernSection title="Ações Rápidas">
          <div className="grid grid-cols-2 gap-mobile">
            <Button
              onClick={() => navigate("/crm/leads/new")}
              variant="default"
              className="h-16 flex-col gap-2 bg-gradient-primary"
            >
              <Plus className="w-5 h-5" />
              <span className="text-mobile-xs">Novo Lead</span>
            </Button>
            <Button
              onClick={() => navigate("/crm/reports")}
              variant="outline"
              className="h-16 flex-col gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-mobile-xs">Relatórios</span>
            </Button>
          </div>
        </ModernSection>

        {/* Botão Flutuante para Novo Lead */}
        <Button
          onClick={() => navigate("/crm/leads/new")}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg z-40 bg-gradient-primary"
          size="sm"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}