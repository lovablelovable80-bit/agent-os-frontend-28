import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  DollarSign,
  FileText,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Invoice {
  id: string;
  number: string;
  customer: string;
  customerDoc: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: "pending" | "sent" | "paid" | "cancelled" | "overdue";
  type: "nfe" | "nfse" | "nfce";
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    number: "000000001",
    customer: "João Silva",
    customerDoc: "123.456.789-00",
    amount: 350.00,
    issueDate: "2024-01-15",
    dueDate: "2024-01-30",
    status: "paid",
    type: "nfe",
    items: [
      { id: "1", description: "Troca de tela iPhone 12", quantity: 1, unitPrice: 350.00, total: 350.00 }
    ]
  },
  {
    id: "2",
    number: "000000002",
    customer: "Maria Santos",
    customerDoc: "987.654.321-00",
    amount: 250.00,
    issueDate: "2024-01-16",
    dueDate: "2024-01-31",
    status: "sent",
    type: "nfse",
    items: [
      { id: "1", description: "Reparo de placa Samsung A30", quantity: 1, unitPrice: 250.00, total: 250.00 }
    ]
  },
  {
    id: "3",
    number: "000000003",
    customer: "Pedro Costa",
    customerDoc: "456.789.123-00",
    amount: 180.00,
    issueDate: "2024-01-17",
    dueDate: "2024-02-01",
    status: "pending",
    type: "nfce",
    items: [
      { id: "1", description: "Película protetora", quantity: 2, unitPrice: 40.00, total: 80.00 },
      { id: "2", description: "Capinha iPhone", quantity: 1, unitPrice: 100.00, total: 100.00 }
    ]
  },
  {
    id: "4",
    number: "000000004",
    customer: "Ana Oliveira",
    customerDoc: "789.123.456-00",
    amount: 420.00,
    issueDate: "2024-01-10",
    dueDate: "2024-01-25",
    status: "overdue",
    type: "nfe",
    items: [
      { id: "1", description: "Formatação completa", quantity: 1, unitPrice: 420.00, total: 420.00 }
    ]
  }
];

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    const matchesType = typeFilter === "all" || invoice.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800", icon: Clock },
      sent: { label: "Enviada", className: "bg-blue-100 text-blue-800", icon: Send },
      paid: { label: "Paga", className: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { label: "Cancelada", className: "bg-red-100 text-red-800", icon: XCircle },
      overdue: { label: "Vencida", className: "bg-orange-100 text-orange-800", icon: Clock }
    };

    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge variant="secondary" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const configs = {
      nfe: { label: "NF-e", className: "bg-purple-100 text-purple-800" },
      nfse: { label: "NFS-e", className: "bg-indigo-100 text-indigo-800" },
      nfce: { label: "NFC-e", className: "bg-teal-100 text-teal-800" }
    };

    const config = configs[type as keyof typeof configs] || configs.nfe;

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(i => i.status === "paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === "pending").reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === "overdue").reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <PageContainer
      title="Notas Fiscais"
      description="Gerencie e acompanhe suas notas fiscais eletrônicas"
      action={
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Nota Fiscal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Nota Fiscal</DialogTitle>
              <DialogDescription>
                Preencha os dados para gerar uma nova nota fiscal
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="customer">Cliente</TabsTrigger>
                <TabsTrigger value="items">Itens</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Nome/Razão Social</Label>
                    <Input id="customer-name" placeholder="Nome do cliente" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-doc">CPF/CNPJ</Label>
                    <Input id="customer-doc" placeholder="000.000.000-00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <Input id="customer-email" type="email" placeholder="cliente@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">Telefone</Label>
                    <Input id="customer-phone" placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-address">Endereço</Label>
                  <Textarea id="customer-address" placeholder="Endereço completo" />
                </div>
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Itens da Nota</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Valor Unit.</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Input placeholder="Descrição do produto/serviço" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" placeholder="1" className="w-20" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" placeholder="0,00" className="w-24" />
                      </TableCell>
                      <TableCell>R$ 0,00</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Remover</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-type">Tipo de Nota</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nfe">NF-e (Nota Fiscal Eletrônica)</SelectItem>
                        <SelectItem value="nfse">NFS-e (Nota Fiscal de Serviço)</SelectItem>
                        <SelectItem value="nfce">NFC-e (Nota Fiscal do Consumidor)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Data de Vencimento</Label>
                    <Input id="due-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observations">Observações</Label>
                  <Textarea id="observations" placeholder="Observações adicionais" />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Gerar Nota Fiscal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faturado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recebido</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {paidAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {overdueAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Cliente ou número da nota..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="sent">Enviada</SelectItem>
                    <SelectItem value="paid">Paga</SelectItem>
                    <SelectItem value="overdue">Vencida</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type-filter">Tipo</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="nfe">NF-e</SelectItem>
                    <SelectItem value="nfse">NFS-e</SelectItem>
                    <SelectItem value="nfce">NFC-e</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Notas Fiscais */}
        <Card>
          <CardHeader>
            <CardTitle>Notas Fiscais</CardTitle>
            <CardDescription>
              Lista de todas as notas fiscais emitidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Emissão</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.customer}</div>
                        <div className="text-sm text-muted-foreground">{invoice.customerDoc}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(invoice.type)}</TableCell>
                    <TableCell className="font-medium">
                      {invoice.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.issueDate), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.dueDate), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}