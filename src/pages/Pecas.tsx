import { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Printer, 
  Package,
  DollarSign,
  Save,
  X,
  TrendingUp,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  MoreVertical,
  Trash2,
  Eye,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpDown,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  Target,
  Package2,
  Truck,
  Calendar,
  User,
  MapPin
} from "lucide-react";

// Mock data para peças
const mockPecas = [
  {
    id: "PC001",
    codigo: "TELA-IPH14-BLK",
    nome: "Tela LCD iPhone 14 Preta",
    categoria: "smartphone",
    fabricante: "Apple",
    modelo: "iPhone 14",
    descricao: "Tela LCD original com touch screen para iPhone 14, cor preta",
    estoque: 8,
    estoqueMinimo: 5,
    custoCompra: 380.00,
    precoVenda: 450.00,
    fornecedor: "iRepair Distribuidora",
    localizacao: "A1-B2",
    dataEntrada: "2024-01-10",
    ultimaVenda: "2024-01-18",
    status: "Disponível",
    peso: "0.15",
    dimensoes: "15.5 x 7.5 x 0.8 cm",
    garantia: "90 dias"
  },
  {
    id: "PC002",
    codigo: "BAT-S23-ORI",
    nome: "Bateria Samsung Galaxy S23",
    categoria: "smartphone",
    fabricante: "Samsung",
    modelo: "Galaxy S23",
    descricao: "Bateria original Samsung Galaxy S23 3900mAh",
    estoque: 12,
    estoqueMinimo: 8,
    custoCompra: 220.00,
    precoVenda: 280.00,
    fornecedor: "Samsung Parts",
    localizacao: "B2-C1",
    dataEntrada: "2024-01-12",
    ultimaVenda: "2024-01-17",
    status: "Disponível",
    peso: "0.08",
    dimensoes: "7.5 x 4.5 x 0.4 cm",
    garantia: "180 dias"
  },
  {
    id: "PC003",
    codigo: "CON-USBC-UNI",
    nome: "Conector USB-C Universal",
    categoria: "smartphone",
    fabricante: "Generic",
    modelo: "Universal",
    descricao: "Conector USB-C compatível com diversos modelos",
    estoque: 3,
    estoqueMinimo: 10,
    custoCompra: 95.00,
    precoVenda: 150.00,
    fornecedor: "Tech Parts",
    localizacao: "C1-A3",
    dataEntrada: "2024-01-08",
    ultimaVenda: "2024-01-16",
    status: "Estoque Baixo",
    peso: "0.02",
    dimensoes: "2.0 x 1.5 x 0.5 cm",
    garantia: "60 dias"
  },
  {
    id: "PC004",
    codigo: "TEC-MBP-M1",
    nome: "Teclado MacBook Pro M1",
    categoria: "laptop",
    fabricante: "Apple",
    modelo: "MacBook Pro M1",
    descricao: "Teclado completo com backlight para MacBook Pro M1",
    estoque: 2,
    estoqueMinimo: 3,
    custoCompra: 520.00,
    precoVenda: 680.00,
    fornecedor: "Mac Parts Pro",
    localizacao: "D1-A1",
    dataEntrada: "2024-01-05",
    ultimaVenda: "2024-01-15",
    status: "Estoque Baixo",
    peso: "0.35",
    dimensoes: "28.0 x 12.0 x 0.5 cm",
    garantia: "120 dias"
  },
  {
    id: "PC005",
    codigo: "TEL-IPAD-BLK",
    nome: "Tela iPad Pro 12.9",
    categoria: "tablet",
    fabricante: "Apple",
    modelo: "iPad Pro 12.9",
    descricao: "Tela LCD com digitizer para iPad Pro 12.9 polegadas",
    estoque: 0,
    estoqueMinimo: 2,
    custoCompra: 420.00,
    precoVenda: 520.00,
    fornecedor: "Tablet Parts",
    localizacao: "E1-B1",
    dataEntrada: "2024-01-03",
    ultimaVenda: "2024-01-18",
    status: "Sem Estoque",
    peso: "0.25",
    dimensoes: "28.0 x 21.0 x 0.3 cm",
    garantia: "90 dias"
  }
];

const statusColors = {
  "Disponível": "bg-success/10 text-success border-success/20",
  "Estoque Baixo": "bg-warning/10 text-warning border-warning/20",
  "Sem Estoque": "bg-destructive/10 text-destructive border-destructive/20",
  "Reservado": "bg-accent/10 text-accent border-accent/20"
};

const categoryIcons = {
  "smartphone": Smartphone,
  "laptop": Laptop,
  "tablet": Tablet,
  "watch": Watch,
  "headphone": Headphones
};

export default function Pecas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fornecedorFilter, setFornecedorFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"nome" | "estoque" | "precoVenda" | "dataEntrada">("nome");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedPecas, setSelectedPecas] = useState<string[]>([]);
  const [isNewPecaOpen, setIsNewPecaOpen] = useState(false);
  const [isViewPecaOpen, setIsViewPecaOpen] = useState(false);
  const [isEditPecaOpen, setIsEditPecaOpen] = useState(false);
  const [selectedPeca, setSelectedPeca] = useState<any>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    fabricante: "",
    modelo: "",
    descricao: "",
    estoque: "",
    estoqueMinimo: "",
    custoCompra: "",
    precoVenda: "",
    fornecedor: "",
    localizacao: "",
    peso: "",
    dimensoes: "",
    garantia: ""
  });
  const { toast } = useToast();

  // Filtros e ordenação
  const filteredAndSortedPecas = useMemo(() => {
    let filtered = mockPecas.filter(peca => {
      const matchesSearch = peca.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           peca.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           peca.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           peca.modelo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || peca.categoria === categoryFilter;
      const matchesStatus = statusFilter === "all" || peca.status === statusFilter;
      const matchesFornecedor = fornecedorFilter === "all" || peca.fornecedor === fornecedorFilter;
      return matchesSearch && matchesCategory && matchesStatus && matchesFornecedor;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "estoque":
          aValue = a.estoque;
          bValue = b.estoque;
          break;
        case "precoVenda":
          aValue = a.precoVenda;
          bValue = b.precoVenda;
          break;
        case "dataEntrada":
          aValue = new Date(a.dataEntrada).getTime();
          bValue = new Date(b.dataEntrada).getTime();
          break;
        case "nome":
        default:
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    return filtered;
  }, [searchTerm, categoryFilter, statusFilter, fornecedorFilter, sortBy, sortOrder]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = mockPecas.length;
    const disponivel = mockPecas.filter(p => p.status === "Disponível").length;
    const estoqueBaixo = mockPecas.filter(p => p.status === "Estoque Baixo").length;
    const semEstoque = mockPecas.filter(p => p.status === "Sem Estoque").length;
    const valorTotalEstoque = mockPecas.reduce((acc, p) => acc + (p.estoque * p.custoCompra), 0);
    const valorPotencialVenda = mockPecas.reduce((acc, p) => acc + (p.estoque * p.precoVenda), 0);
    const itensAbaixoMinimo = mockPecas.filter(p => p.estoque <= p.estoqueMinimo).length;
    
    return {
      total,
      disponivel,
      estoqueBaixo,
      semEstoque,
      valorTotalEstoque,
      valorPotencialVenda,
      itensAbaixoMinimo,
      margemMedia: valorTotalEstoque > 0 ? ((valorPotencialVenda - valorTotalEstoque) / valorTotalEstoque) * 100 : 0
    };
  }, []);

  const getCategoryIcon = (categoria: string) => {
    const IconComponent = categoryIcons[categoria as keyof typeof categoryIcons] || Package;
    return <IconComponent className="w-4 h-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Disponível": return <CheckCircle className="w-4 h-4" />;
      case "Estoque Baixo": return <AlertTriangle className="w-4 h-4" />;
      case "Sem Estoque": return <X className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  // Funções
  const handleSelectPeca = (pecaId: string) => {
    setSelectedPecas(prev => 
      prev.includes(pecaId) 
        ? prev.filter(id => id !== pecaId)
        : [...prev, pecaId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPecas.length === filteredAndSortedPecas.length) {
      setSelectedPecas([]);
    } else {
      setSelectedPecas(filteredAndSortedPecas.map(p => p.id));
    }
  };

  const handleViewPeca = (peca: any) => {
    setSelectedPeca(peca);
    setIsViewPecaOpen(true);
  };

  const handleEditPeca = (peca: any) => {
    setSelectedPeca(peca);
    setFormData({
      codigo: peca.codigo,
      nome: peca.nome,
      categoria: peca.categoria,
      fabricante: peca.fabricante,
      modelo: peca.modelo,
      descricao: peca.descricao,
      estoque: peca.estoque.toString(),
      estoqueMinimo: peca.estoqueMinimo.toString(),
      custoCompra: peca.custoCompra.toString(),
      precoVenda: peca.precoVenda.toString(),
      fornecedor: peca.fornecedor,
      localizacao: peca.localizacao,
      peso: peca.peso,
      dimensoes: peca.dimensoes,
      garantia: peca.garantia
    });
    setIsEditPecaOpen(true);
  };

  const handleCreatePeca = () => {
    if (!formData.nome || !formData.codigo || !formData.categoria) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Peça Cadastrada",
      description: `${formData.nome} foi adicionada ao estoque!`,
    });

    resetForm();
    setIsNewPecaOpen(false);
  };

  const resetForm = () => {
    setFormData({
      codigo: "",
      nome: "",
      categoria: "",
      fabricante: "",
      modelo: "",
      descricao: "",
      estoque: "",
      estoqueMinimo: "",
      custoCompra: "",
      precoVenda: "",
      fornecedor: "",
      localizacao: "",
      peso: "",
      dimensoes: "",
      garantia: ""
    });
  };

  return (
    <PageContainer 
      title="Gestão de Peças" 
      description="Controle completo do estoque de peças e componentes"
      action={
        <div className="flex gap-2">
          {/* Analytics Dashboard */}
          <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Relatórios de Estoque</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-primary">{stats.total}</h3>
                      <p className="text-sm text-muted-foreground">Total de Itens</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-success">R$ {stats.valorTotalEstoque.toFixed(0)}</h3>
                      <p className="text-sm text-muted-foreground">Valor em Estoque</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-accent">{stats.margemMedia.toFixed(1)}%</h3>
                      <p className="text-sm text-muted-foreground">Margem Média</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewPecaOpen} onOpenChange={setIsNewPecaOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:shadow-glow transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Nova Peça
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Peça</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Informações Básicas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codigo">Código da Peça *</Label>
                      <Input 
                        id="codigo" 
                        placeholder="Ex: TELA-IPH14-BLK"
                        value={formData.codigo}
                        onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome da Peça *</Label>
                      <Input 
                        id="nome" 
                        placeholder="Ex: Tela LCD iPhone 14"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria *</Label>
                      <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smartphone">Smartphone</SelectItem>
                          <SelectItem value="laptop">Laptop</SelectItem>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="watch">Smartwatch</SelectItem>
                          <SelectItem value="headphone">Fones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fabricante">Fabricante</Label>
                      <Input 
                        id="fabricante" 
                        placeholder="Ex: Apple, Samsung"
                        value={formData.fabricante}
                        onChange={(e) => setFormData({...formData, fabricante: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modelo">Modelo</Label>
                      <Input 
                        id="modelo" 
                        placeholder="Ex: iPhone 14, Galaxy S23"
                        value={formData.modelo}
                        onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea 
                      id="descricao" 
                      placeholder="Descrição detalhada da peça..."
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    />
                  </div>
                </div>

                <Separator />

                {/* Estoque e Preços */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Estoque e Preços
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estoque">Quantidade em Estoque</Label>
                      <Input 
                        id="estoque" 
                        type="number"
                        placeholder="0"
                        value={formData.estoque}
                        onChange={(e) => setFormData({...formData, estoque: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                      <Input 
                        id="estoqueMinimo" 
                        type="number"
                        placeholder="5"
                        value={formData.estoqueMinimo}
                        onChange={(e) => setFormData({...formData, estoqueMinimo: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custoCompra">Custo de Compra (R$)</Label>
                      <Input 
                        id="custoCompra" 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.custoCompra}
                        onChange={(e) => setFormData({...formData, custoCompra: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="precoVenda">Preço de Venda (R$)</Label>
                      <Input 
                        id="precoVenda" 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.precoVenda}
                        onChange={(e) => setFormData({...formData, precoVenda: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Informações Adicionais */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Informações Adicionais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fornecedor">Fornecedor</Label>
                      <Input 
                        id="fornecedor" 
                        placeholder="Nome do fornecedor"
                        value={formData.fornecedor}
                        onChange={(e) => setFormData({...formData, fornecedor: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="localizacao">Localização</Label>
                      <Input 
                        id="localizacao" 
                        placeholder="Ex: A1-B2"
                        value={formData.localizacao}
                        onChange={(e) => setFormData({...formData, localizacao: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="garantia">Garantia</Label>
                      <Input 
                        id="garantia" 
                        placeholder="Ex: 90 dias"
                        value={formData.garantia}
                        onChange={(e) => setFormData({...formData, garantia: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="peso">Peso</Label>
                      <Input 
                        id="peso" 
                        placeholder="Ex: 0.15 kg"
                        value={formData.peso}
                        onChange={(e) => setFormData({...formData, peso: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dimensoes">Dimensões</Label>
                      <Input 
                        id="dimensoes" 
                        placeholder="Ex: 15.5 x 7.5 x 0.8 cm"
                        value={formData.dimensoes}
                        onChange={(e) => setFormData({...formData, dimensoes: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => {setIsNewPecaOpen(false); resetForm();}}>
                    Cancelar
                  </Button>
                  <Button className="bg-gradient-primary" onClick={handleCreatePeca}>
                    <Save className="w-4 h-4 mr-2" />
                    Cadastrar Peça
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {/* Dashboard de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total de Itens</p>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-success/5 to-success/10 border border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-success to-success/80 rounded-xl">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Disponível</p>
                <p className="text-2xl font-bold text-success">{stats.disponivel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-warning/5 to-warning/10 border border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-warning to-warning/80 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Estoque Baixo</p>
                <p className="text-2xl font-bold text-warning">{stats.itensAbaixoMinimo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-accent to-accent/80 rounded-xl">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Valor Estoque</p>
                <p className="text-lg font-bold text-accent">R$ {stats.valorTotalEstoque.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardContent className="p-4">
          {/* Seleção múltipla */}
          {selectedPecas.length > 0 && (
            <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={selectedPecas.length === filteredAndSortedPecas.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    {selectedPecas.length} item(s) selecionado(s)
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir Etiquetas
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedPecas([])}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, código, fabricante ou modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="smartphone">Smartphone</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="watch">Smartwatch</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Estoque Baixo">Estoque Baixo</SelectItem>
                  <SelectItem value="Sem Estoque">Sem Estoque</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={() => {setSortBy("nome"); setSortOrder("asc")}}>
                    <Package className="w-4 h-4 mr-2" />
                    Nome A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {setSortBy("estoque"); setSortOrder("asc")}}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Menor Estoque
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {setSortBy("precoVenda"); setSortOrder("desc")}}>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Maior Preço
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Peças */}
      <div className="space-y-4">
        {filteredAndSortedPecas.map((peca) => (
          <Card key={peca.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Checkbox 
                  checked={selectedPecas.includes(peca.id)}
                  onCheckedChange={() => handleSelectPeca(peca.id)}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getCategoryIcon(peca.categoria)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{peca.nome}</h3>
                          <Badge variant="outline" className="text-xs">
                            {peca.codigo}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {peca.fabricante} • {peca.modelo}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={`${statusColors[peca.status as keyof typeof statusColors]} border text-xs`}>
                        {getStatusIcon(peca.status)}
                        <span className="ml-1">{peca.status}</span>
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewPeca(peca)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditPeca(peca)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Adicionar ao Carrinho
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimir Etiqueta
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Estoque</p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{peca.estoque} un.</span>
                        {peca.estoque <= peca.estoqueMinimo && (
                          <Badge variant="destructive" className="text-xs">
                            Baixo
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Preço de Venda</p>
                      <p className="font-semibold text-success">R$ {peca.precoVenda.toFixed(2)}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Localização</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{peca.localizacao}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Fornecedor</p>
                      <p className="text-sm">{peca.fornecedor}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Visualização */}
      <Dialog open={isViewPecaOpen} onOpenChange={setIsViewPecaOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Peça</DialogTitle>
          </DialogHeader>
          {selectedPeca && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  {getCategoryIcon(selectedPeca.categoria)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedPeca.nome}</h3>
                  <p className="text-muted-foreground">{selectedPeca.codigo}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fabricante</p>
                  <p className="font-medium">{selectedPeca.fabricante}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modelo</p>
                  <p className="font-medium">{selectedPeca.modelo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estoque Atual</p>
                  <p className="font-medium">{selectedPeca.estoque} unidades</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estoque Mínimo</p>
                  <p className="font-medium">{selectedPeca.estoqueMinimo} unidades</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preço de Venda</p>
                  <p className="font-medium text-success">R$ {selectedPeca.precoVenda.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Localização</p>
                  <p className="font-medium">{selectedPeca.localizacao}</p>
                </div>
              </div>
              
              {selectedPeca.descricao && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                  <p className="text-sm">{selectedPeca.descricao}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}