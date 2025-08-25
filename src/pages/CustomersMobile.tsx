import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ModernCard, ModernSection } from "@/components/mobile/ModernCard";
import { ModernList, ModernListItem } from "@/components/mobile/ModernListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNativeApp, usePlatformConfig } from "@/hooks/useNativeApp";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Star,
  Activity,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MessageSquare
} from "lucide-react";

// Mock data - em produção viria do Supabase
const mockCustomers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    address: "Rua das Flores, 123 - São Paulo, SP",
    status: "Ativo",
    category: "Premium",
    lastService: "2024-01-15",
    totalServices: 5,
    totalSpent: 2500.00,
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@email.com", 
    phone: "(11) 88888-8888",
    address: "Av. Paulista, 456 - São Paulo, SP",
    status: "Ativo",
    category: "Regular",
    lastService: "2024-01-10",
    totalServices: 3,
    totalSpent: 850.00,
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e9?w=40&h=40&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro.costa@email.com",
    phone: "(11) 77777-7777", 
    address: "Rua Augusta, 789 - São Paulo, SP",
    status: "Inativo",
    category: "Regular",
    lastService: "2023-12-20",
    totalServices: 2,
    totalSpent: 420.00,
    rating: 3,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
  }
];

const getCategoryInfo = (category: string) => {
  switch (category) {
    case "Premium":
      return { label: "Premium", color: "bg-primary", variant: "default" as const };
    case "Regular":
      return { label: "Regular", color: "bg-secondary", variant: "secondary" as const };
    default:
      return { label: "Básico", color: "bg-muted", variant: "outline" as const };
  }
};

const getStatusInfo = (status: string) => {
  switch (status) {
    case "Ativo":
      return { label: "Ativo", color: "bg-success", variant: "default" as const };
    case "Inativo":
      return { label: "Inativo", color: "bg-muted", variant: "secondary" as const };
    default:
      return { label: "Pendente", color: "bg-warning", variant: "outline" as const };
  }
};

export default function CustomersMobile() {
  const navigate = useNavigate();
  const { isNativeApp } = useNativeApp();
  const config = usePlatformConfig();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const stats = useMemo(() => {
    const active = mockCustomers.filter(c => c.status === "Ativo").length;
    const premium = mockCustomers.filter(c => c.category === "Premium").length;
    const totalRevenue = mockCustomers.reduce((acc, c) => acc + c.totalSpent, 0);
    const avgRating = mockCustomers.reduce((acc, c) => acc + c.rating, 0) / mockCustomers.length;

    return { active, premium, totalRevenue, avgRating };
  }, []);

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      
      const matchesFilter = selectedFilter === "all" || 
                           (selectedFilter === "active" && customer.status === "Ativo") ||
                           (selectedFilter === "premium" && customer.category === "Premium") ||
                           (selectedFilter === "inactive" && customer.status === "Inativo");
      
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-warning fill-current' : 'text-muted'}`}
      />
    ));
  };

  const handleCustomerAction = (action: string, customerId: number) => {
    const customer = mockCustomers.find(c => c.id === customerId);
    
    switch (action) {
      case "call":
        if (customer?.phone) {
          window.open(`tel:${customer.phone}`, '_self');
        }
        break;
      case "email":
        if (customer?.email) {
          window.open(`mailto:${customer.email}`, '_self');
        }
        break;
      case "whatsapp":
        if (customer?.phone) {
          const phone = customer.phone.replace(/\D/g, '');
          window.open(`https://wa.me/55${phone}`, '_blank');
        }
        break;
      case "edit":
        navigate(`/customers/${customerId}/edit`);
        break;
      case "view":
        navigate(`/customers/${customerId}`);
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
        {/* Estatísticas Rápidas */}
        <ModernSection title="Resumo" icon={Activity}>
          <div className="grid grid-cols-2 gap-mobile">
            <ModernCard variant="elevated" size="sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <h4 className="text-mobile-xl font-bold text-foreground">
                  {stats.active}
                </h4>
                <p className="text-mobile-xs text-muted-foreground">Ativos</p>
              </div>
            </ModernCard>

            <ModernCard variant="elevated" size="sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-mobile-xl font-bold text-foreground">
                  {stats.premium}
                </h4>
                <p className="text-mobile-xs text-muted-foreground">Premium</p>
              </div>
            </ModernCard>

            <ModernCard variant="elevated" size="sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-mobile-sm font-bold text-foreground">
                  {formatCurrency(stats.totalRevenue)}
                </h4>
                <p className="text-mobile-xs text-muted-foreground">Faturamento</p>
              </div>
            </ModernCard>

            <ModernCard variant="elevated" size="sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-warning" />
                </div>
                <h4 className="text-mobile-xl font-bold text-foreground">
                  {stats.avgRating.toFixed(1)}
                </h4>
                <p className="text-mobile-xs text-muted-foreground">Satisfação</p>
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
                placeholder="Buscar clientes..."
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

        {/* Filtros Rápidos */}
        <ModernCard variant="compact">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: "all", label: "Todos", count: mockCustomers.length },
              { key: "active", label: "Ativos", count: mockCustomers.filter(c => c.status === "Ativo").length },
              { key: "premium", label: "Premium", count: mockCustomers.filter(c => c.category === "Premium").length },
              { key: "inactive", label: "Inativos", count: mockCustomers.filter(c => c.status === "Inativo").length },
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

        {/* Lista de Clientes */}
        <ModernSection title="Clientes">
          <ModernList variant="card">
            {filteredCustomers.map((customer) => {
              const categoryInfo = getCategoryInfo(customer.category);
              const statusInfo = getStatusInfo(customer.status);

              return (
                <ModernListItem
                  key={customer.id}
                  title={customer.name}
                  subtitle={customer.email}
                  description={customer.address}
                  avatar={customer.avatar}
                  badge={categoryInfo.label}
                  badgeVariant={categoryInfo.variant}
                  onPress={() => handleCustomerAction("view", customer.id)}
                  leftContent={
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  }
                  rightContent={
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-1 justify-end">
                        {renderStars(customer.rating)}
                      </div>
                      <div className="text-sm font-medium text-success">
                        {formatCurrency(customer.totalSpent)}
                      </div>
                      <Badge variant={statusInfo.variant} className="text-xs">
                        {statusInfo.label}
                      </Badge>
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomerAction("call", customer.id);
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
                            handleCustomerAction("whatsapp", customer.id);
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
                            handleCustomerAction("edit", customer.id);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  }
                />
              );
            })}
          </ModernList>
        </ModernSection>

        {/* Botão Flutuante para Novo Cliente */}
        <Button
          onClick={() => navigate("/customers/new")}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg z-40 bg-gradient-primary"
          size="sm"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}