import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNativeApp } from "@/hooks/useNativeApp";
import CRMMobile from "./CRMMobile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, Phone, Mail, Calendar, TrendingUp, Target, DollarSign } from "lucide-react";

// Mock data
const dashboardStats = [
  { title: "Total de Leads", value: "147", icon: Users, change: "+12%" },
  { title: "Conversão", value: "23%", icon: Target, change: "+5%" },
  { title: "Vendas do Mês", value: "R$ 45.2k", icon: DollarSign, change: "+18%" },
  { title: "Follow-ups", value: "32", icon: Calendar, change: "-3%" }
];

const leads = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-9999",
    status: "Novo",
    value: "R$ 2.500",
    source: "Website",
    lastContact: "2024-01-20"
  },
  {
    id: 2,
    name: "João Santos",
    email: "joao@email.com",
    phone: "(11) 88888-8888",
    status: "Qualificado",
    value: "R$ 5.000",
    source: "Indicação",
    lastContact: "2024-01-19"
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 77777-7777",
    status: "Proposta",
    value: "R$ 3.200",
    source: "Redes Sociais",
    lastContact: "2024-01-18"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Novo": return "bg-blue-100 text-blue-800";
    case "Qualificado": return "bg-yellow-100 text-yellow-800";
    case "Proposta": return "bg-purple-100 text-purple-800";
    case "Ganho": return "bg-green-100 text-green-800";
    case "Perdido": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function CRM() {
  const isMobile = useIsMobile();
  const { isNativeApp } = useNativeApp();
  
  // Use versão mobile para dispositivos móveis
  if (isMobile || isNativeApp) {
    return <CRMMobile />;
  }
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [leadsList, setLeadsList] = useState(leads);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    value: "",
    source: "",
    status: "Novo",
    notes: ""
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newLead = {
      id: leadsList.length + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      value: formData.value || "R$ 0",
      source: formData.source || "Manual",
      lastContact: new Date().toISOString().split('T')[0]
    };

    setLeadsList(prev => [newLead, ...prev]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      value: "",
      source: "",
      status: "Novo",
      notes: ""
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Sucesso!",
      description: "Lead adicionado com sucesso.",
    });
  };

  return (
    <PageContainer 
      title="CRM - Relacionamento" 
      description="Gestão de relacionamento com clientes"
      action={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Lead</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo lead para adicionar ao seu CRM.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Valor Potencial</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Fonte</Label>
                  <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a fonte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Indicação">Indicação</SelectItem>
                      <SelectItem value="Redes Sociais">Redes Sociais</SelectItem>
                      <SelectItem value="Telefone">Telefone</SelectItem>
                      <SelectItem value="E-mail">E-mail</SelectItem>
                      <SelectItem value="Evento">Evento</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Novo">Novo</SelectItem>
                      <SelectItem value="Qualificado">Qualificado</SelectItem>
                      <SelectItem value="Proposta">Proposta</SelectItem>
                      <SelectItem value="Negociação">Negociação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Informações adicionais sobre o lead..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Adicionar Lead
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={stat.change.startsWith('+') ? "text-green-600" : "text-red-600"}>
                      {stat.change}
                    </span>
                    {" "}em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Últimas interações com leads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadsList.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Leads</CardTitle>
              <CardDescription>Gerencie todos os seus leads e contatos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadsList.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{lead.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{lead.value}</p>
                        <p className="text-sm text-muted-foreground">{lead.source}</p>
                      </div>
                      <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["Novo", "Qualificado", "Proposta", "Negociação"].map((stage) => (
              <Card key={stage}>
                <CardHeader>
                  <CardTitle className="text-sm">{stage}</CardTitle>
                  <CardDescription>
                    {leadsList.filter(lead => lead.status === stage).length} leads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {leadsList.filter(lead => lead.status === stage).map((lead) => (
                    <div key={lead.id} className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Performance</CardTitle>
              <CardDescription>Análise detalhada do desempenho das vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Relatórios em desenvolvimento...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}