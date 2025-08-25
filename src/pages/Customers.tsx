import { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNativeApp } from "@/hooks/useNativeApp";
import CustomersMobile from "./CustomersMobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { BulkImport } from "@/components/customers/BulkImport";
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  MoreVertical,
  Trash2,
  User,
  Calendar,
  Filter,
  Download,
  Upload,
  Eye,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Star,
  Clock,
  FileText,
  Tag,
  Building,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  RefreshCw,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  BarChart3
} from "lucide-react";

// Mock data mais rico para clientes
const mockCustomers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    address: "Rua das Flores, 123 - São Paulo, SP",
    cep: "01234-567",
    city: "São Paulo",
    state: "SP",
    status: "Ativo",
    category: "Premium",
    lastService: "2024-01-15",
    totalServices: 5,
    totalSpent: 2500.00,
    lastContact: "2024-01-20",
    contactMethod: "WhatsApp",
    birthDate: "1985-03-15",
    company: "Empresa ABC Ltda",
    notes: "Cliente preferencial, sempre pontual",
    tags: ["VIP", "Pontual"],
    rating: 5,
    satisfaction: 95,
    source: "Indicação"
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 88888-8888",
    address: "Av. Paulista, 456 - São Paulo, SP",
    cep: "01310-100",
    city: "São Paulo",
    state: "SP",
    status: "Ativo",
    category: "Regular",
    lastService: "2024-01-10",
    totalServices: 3,
    totalSpent: 850.00,
    lastContact: "2024-01-12",
    contactMethod: "E-mail",
    birthDate: "1990-07-22",
    company: "",
    notes: "Gosta de ser informada sobre promoções",
    tags: ["Promoções"],
    rating: 4,
    satisfaction: 85,
    source: "Site"
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    phone: "(11) 77777-7777",
    address: "Rua Augusta, 789 - São Paulo, SP",
    cep: "01305-000",
    city: "São Paulo",
    state: "SP",
    status: "Inativo",
    category: "Regular",
    lastService: "2023-12-20",
    totalServices: 1,
    totalSpent: 150.00,
    lastContact: "2023-12-20",
    contactMethod: "Telefone",
    birthDate: "1978-11-05",
    company: "Consultoria XYZ",
    notes: "",
    tags: [],
    rating: 3,
    satisfaction: 70,
    source: "Telefone"
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 66666-6666",
    address: "Rua Oscar Freire, 321 - São Paulo, SP",
    cep: "01426-001",
    city: "São Paulo",
    state: "SP",
    status: "Ativo",
    category: "VIP",
    lastService: "2024-01-18",
    totalServices: 8,
    totalSpent: 4200.00,
    lastContact: "2024-01-19",
    contactMethod: "WhatsApp",
    birthDate: "1982-05-30",
    company: "Empresa Premium S.A.",
    notes: "Cliente VIP - desconto especial",
    tags: ["VIP", "Desconto"],
    rating: 5,
    satisfaction: 98,
    source: "Indicação"
  },
  {
    id: 5,
    name: "Carlos Ferreira",
    email: "carlos.ferreira@email.com",
    phone: "(11) 55555-5555",
    address: "Rua da Consolação, 654 - São Paulo, SP",
    cep: "01302-001",
    city: "São Paulo",
    state: "SP",
    status: "Ativo",
    category: "Regular",
    lastService: "2024-01-12",
    totalServices: 2,
    totalSpent: 450.00,
    lastContact: "2024-01-14",
    contactMethod: "E-mail",
    birthDate: "1975-09-12",
    company: "",
    notes: "Cliente novo, potencial de crescimento",
    tags: ["Novo", "Potencial"],
    rating: 4,
    satisfaction: 80,
    source: "Google Ads"
  }
];

interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  cep: string;
  city: string;
  state: string;
  status: string;
  category: string;
  lastService: string;
  totalServices: number;
  totalSpent: number;
  lastContact: string;
  contactMethod: string;
  birthDate: string;
  company: string;
  notes: string;
  tags: string[];
  rating: number;
  satisfaction: number;
  source: string;
}

interface FilterOptions {
  status: string;
  category: string;
  source: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function Customers() {
  const isMobile = useIsMobile();
  const { isNativeApp } = useNativeApp();
  
  // All hooks must be called first - move conditional return after all hooks
  const { toast } = useToast();
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [activeTab, setActiveTab] = useState("overview");
  
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    category: "all", 
    source: "all",
    sortBy: "name",
    sortOrder: "asc"
  });

  const [formData, setFormData] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    address: "",
    cep: "",
    city: "",
    state: "",
    status: "Ativo",
    category: "Regular",
    company: "",
    birthDate: "",
    notes: "",
    tags: [],
    contactMethod: "WhatsApp",
    source: "Site",
    lastService: "",
    totalServices: 0,
    totalSpent: 0,
    lastContact: "",
    rating: 0,
    satisfaction: 0
  });

  // Computação dos dados filtrados e estatísticas
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm) ||
                           customer.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === "all" || customer.status === filters.status;
      const matchesCategory = filters.category === "all" || customer.category === filters.category;
      const matchesSource = filters.source === "all" || customer.source === filters.source;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesSource;
    });

    // Ordenação
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof typeof a] || "";
      const bValue = b[filters.sortBy as keyof typeof b] || "";
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [customers, searchTerm, filters]);

  const statistics = useMemo(() => {
    const active = customers.filter(c => c.status === "Ativo").length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const avgSatisfaction = customers.reduce((sum, c) => sum + (c.satisfaction || 0), 0) / customers.length;
    const newThisMonth = customers.filter(c => {
      const lastService = new Date(c.lastService);
      const now = new Date();
      return lastService.getMonth() === now.getMonth() && lastService.getFullYear() === now.getFullYear();
    }).length;

    return {
      total: customers.length,
      active,
      inactive: customers.length - active,
      totalRevenue,
      avgSatisfaction: Math.round(avgSatisfaction),
      newThisMonth,
      vipClients: customers.filter(c => c.category === "VIP").length,
      totalServices: customers.reduce((sum, c) => sum + c.totalServices, 0)
    };
  }, [customers]);

  // Now that all hooks are called, we can do conditional rendering
  if (isMobile || isNativeApp) {
    return <CustomersMobile />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCustomer) {
      setCustomers(prev => prev.map(customer => 
        customer.id === editingCustomer.id 
          ? { ...customer, ...formData }
          : customer
      ));
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
    } else {
      const newCustomer = {
        ...formData,
        id: Math.max(...customers.map(c => c.id)) + 1,
        lastService: new Date().toISOString().split('T')[0],
        totalServices: 0,
        totalSpent: 0,
        lastContact: new Date().toISOString().split('T')[0],
        rating: 0,
        satisfaction: 0
      };
      setCustomers(prev => [...prev, newCustomer]);
      toast({
        title: "Cliente cadastrado",
        description: "Novo cliente adicionado com sucesso.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      cep: "",
      city: "",
      state: "",
      status: "Ativo",
      category: "Regular",
      company: "",
      birthDate: "",
      notes: "",
      tags: [],
      contactMethod: "WhatsApp",
      source: "Site",
      lastService: "",
      totalServices: 0,
      totalSpent: 0,
      lastContact: "",
      rating: 0,
      satisfaction: 0
    });
    setEditingCustomer(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (customer: typeof mockCustomers[0]) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      cep: customer.cep || "",
      city: customer.city || "",
      state: customer.state || "",
      status: customer.status,
      category: customer.category || "Regular",
      company: customer.company || "",
      birthDate: customer.birthDate || "",
      notes: customer.notes,
      tags: customer.tags || [],
      contactMethod: customer.contactMethod || "WhatsApp",
      source: customer.source || "Site",
      lastService: customer.lastService,
      totalServices: customer.totalServices,
      totalSpent: customer.totalSpent,
      lastContact: customer.lastContact,
      rating: customer.rating,
      satisfaction: customer.satisfaction
    });
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    toast({
      title: "Cliente removido",
      description: "Cliente removido com sucesso.",
      variant: "destructive"
    });
  };

  const handleViewDetails = (customer: typeof mockCustomers[0]) => {
    setSelectedCustomer(customer);
    setIsDetailDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "VIP": return "bg-purple-100 text-purple-800";
      case "Premium": return "bg-blue-100 text-blue-800"; 
      case "Regular": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "default" : "secondary";
  };

  const exportCustomers = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Nome,Email,Telefone,Endereço,Status,Categoria,Empresa,Total Gasto\n" +
      filteredAndSortedCustomers.map(c => 
        `"${c.name}","${c.email}","${c.phone}","${c.address}","${c.status}","${c.category}","${c.company}","R$ ${c.totalSpent?.toFixed(2)}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clientes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Lista de clientes exportada com sucesso.",
    });
  };

  const handleBulkImport = (importedCustomers: any[]) => {
    const newCustomers = importedCustomers.map((customer, index) => ({
      ...customer,
      id: Math.max(...customers.map(c => c.id)) + index + 1,
      status: customer.status === 'valid' || customer.status === 'warning' ? 'Ativo' : 'Inativo',
      category: 'Regular',
      lastService: new Date().toISOString().split('T')[0],
      totalServices: 0,
      totalSpent: 0,
      lastContact: new Date().toISOString().split('T')[0],
      contactMethod: 'WhatsApp',
      source: 'Importação',
      birthDate: '',
      notes: '',
      tags: ['Importado'],
      rating: 0,
      satisfaction: 0,
      cep: ''
    }));

    setCustomers(prev => [...prev, ...newCustomers]);
    
    toast({
      title: "Importação concluída",
      description: `${newCustomers.length} clientes importados com sucesso.`,
    });
  };

  return (
    <PageContainer 
      title="Gestão de Clientes" 
      description="Gerencie sua base de clientes com análises detalhadas"
      action={
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCustomers}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={() => setIsBulkImportOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}>
            {viewMode === "table" ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:shadow-glow transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCustomer ? "Editar Cliente" : "Novo Cliente"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="birthDate">Data de Nascimento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Endereço Completo</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={formData.cep}
                        onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                        placeholder="00000-000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="SP"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Configurações */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Configurações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="contactMethod">Método de Contato Preferido</Label>
                      <Select value={formData.contactMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, contactMethod: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="E-mail">E-mail</SelectItem>
                          <SelectItem value="Telefone">Telefone</SelectItem>
                          <SelectItem value="SMS">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="source">Origem</Label>
                      <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Site">Site</SelectItem>
                          <SelectItem value="Indicação">Indicação</SelectItem>
                          <SelectItem value="Google Ads">Google Ads</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Telefone">Telefone</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    placeholder="Adicione observações importantes sobre o cliente..."
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCustomer ? "Salvar Alterações" : "Cadastrar Cliente"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="list">Lista de Clientes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="segments">Segmentação</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Estatísticas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Clientes</p>
                    <p className="text-2xl font-bold">{statistics.total}</p>
                    <p className="text-xs text-green-600">+{statistics.newThisMonth} este mês</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                    <p className="text-2xl font-bold">{statistics.active}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((statistics.active / statistics.total) * 100)}% do total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clientes VIP</p>
                    <p className="text-2xl font-bold">{statistics.vipClients}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((statistics.vipClients / statistics.total) * 100)}% do total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Receita Total</p>
                    <p className="text-2xl font-bold">R$ {statistics.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      Média: R$ {Math.round(statistics.totalRevenue / statistics.total)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Satisfação Média
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-green-600">{statistics.avgSatisfaction}%</div>
                  <Progress value={statistics.avgSatisfaction} className="flex-1" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Baseado em {statistics.total} avaliações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Serviços Realizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics.totalServices}</div>
                <p className="text-sm text-muted-foreground">
                  Média de {Math.round(statistics.totalServices / statistics.total)} por cliente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Novos Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{statistics.newThisMonth}</div>
                <p className="text-sm text-muted-foreground">Este mês</p>
                <div className="text-xs text-green-600 mt-1">
                  +15% vs mês anterior
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Últimas Atividades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Últimas Atividades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.slice(0, 5).map((customer) => (
                  <div key={customer.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <Avatar>
                      <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Último contato: {new Date(customer.lastContact).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{customer.contactMethod}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* Filtros e Busca */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nome, email, telefone ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="totalSpent">Valor Gasto</SelectItem>
                  <SelectItem value="lastService">Último Serviço</SelectItem>
                  <SelectItem value="satisfaction">Satisfação</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                }))}
              >
                {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Lista de Clientes */}
          {viewMode === "table" ? (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Valor Gasto</TableHead>
                    <TableHead>Satisfação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                            {customer.company && (
                              <p className="text-xs text-muted-foreground">{customer.company}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {customer.city}, {customer.state}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(customer.category || "Regular")}`}>
                          {customer.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">R$ {customer.totalSpent?.toLocaleString()}</span>
                          <p className="text-xs text-muted-foreground">{customer.totalServices} serviços</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={customer.satisfaction} className="w-16 h-2" />
                          <span className="text-sm">{customer.satisfaction}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(customer)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Enviar Mensagem
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              Nova OS
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(customer.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="text-lg">
                            {getInitials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{customer.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getStatusColor(customer.status)}>
                              {customer.status}
                            </Badge>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(customer.category || "Regular")}`}>
                              {customer.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(customer)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">{customer.city}, {customer.state}</span>
                      </div>
                      {customer.company && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate">{customer.company}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Gasto</p>
                        <p className="font-semibold text-green-600">
                          R$ {customer.totalSpent?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Serviços</p>
                        <p className="font-semibold">{customer.totalServices}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Satisfação</span>
                        <span className="font-medium">{customer.satisfaction}%</span>
                      </div>
                      <Progress value={customer.satisfaction} className="h-2" />
                    </div>

                    {customer.tags && customer.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewDetails(customer)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detalhes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contatar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredAndSortedCustomers.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum cliente encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros ou adicionar um novo cliente.
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Cliente
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Alert>
            <BarChart3 className="w-4 h-4" />
            <AlertDescription>
              Dashboard de analytics em desenvolvimento. Em breve você terá gráficos detalhados de performance dos clientes.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Alert>
            <Users className="w-4 h-4" />
            <AlertDescription>
              Funcionalidade de segmentação em desenvolvimento. Em breve você poderá criar segmentos personalizados de clientes.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Dialog de Detalhes do Cliente */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {getInitials(selectedCustomer.name)}
                    </AvatarFallback>
                  </Avatar>
                  {selectedCustomer.name}
                  <Badge variant={getStatusColor(selectedCustomer.status)}>
                    {selectedCustomer.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informações Principais */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações Pessoais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">E-mail</Label>
                          <p>{selectedCustomer.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                          <p>{selectedCustomer.phone}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Data de Nascimento</Label>
                          <p>{selectedCustomer.birthDate ? new Date(selectedCustomer.birthDate).toLocaleDateString() : 'Não informado'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Empresa</Label>
                          <p>{selectedCustomer.company || 'Não informado'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Endereço</Label>
                        <p>{selectedCustomer.address}</p>
                      </div>
                      
                      {selectedCustomer.notes && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                          <p className="text-sm">{selectedCustomer.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Histórico de Serviços</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-muted-foreground py-8">
                        Histórico de serviços em desenvolvimento
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar com Métricas */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Métricas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Total Gasto</Label>
                        <p className="text-2xl font-bold text-green-600">
                          R$ {selectedCustomer.totalSpent?.toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Serviços Realizados</Label>
                        <p className="text-2xl font-bold">{selectedCustomer.totalServices}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Satisfação</Label>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedCustomer.satisfaction} className="flex-1" />
                          <span className="text-sm font-medium">{selectedCustomer.satisfaction}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Avaliação</Label>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < (selectedCustomer.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="ml-2 text-sm">({selectedCustomer.rating}/5)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Preferências</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Método de Contato</Label>
                        <p>{selectedCustomer.contactMethod}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Categoria</Label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedCustomer.category || "Regular")}`}>
                          {selectedCustomer.category}
                        </span>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Origem</Label>
                        <p>{selectedCustomer.source}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Último Contato</Label>
                        <p>{new Date(selectedCustomer.lastContact).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Tags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedCustomer.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Import Component */}
      <BulkImport 
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        onImportComplete={handleBulkImport}
      />
    </PageContainer>
  );
}