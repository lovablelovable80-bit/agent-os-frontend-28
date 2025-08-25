import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calculator, 
  Plus, 
  Edit, 
  Trash2,
  Award,
  Target,
  Percent
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Commission {
  id: string;
  funcionario: string;
  tipo: 'tecnico' | 'vendedor';
  percentual: number;
  vendasMes: number;
  servicosMes: number;
  valorComissao: number;
  meta: number;
  status: 'ativo' | 'inativo';
}

interface CommissionRule {
  id: string;
  tipo: 'tecnico' | 'vendedor';
  categoria: string;
  percentual: number;
  valorMinimo: number;
  ativo: boolean;
}

const mockCommissions: Commission[] = [
  {
    id: '1',
    funcionario: 'João Silva',
    tipo: 'tecnico',
    percentual: 5,
    vendasMes: 0,
    servicosMes: 12,
    valorComissao: 450.00,
    meta: 15,
    status: 'ativo'
  },
  {
    id: '2',
    funcionario: 'Ana Costa',
    tipo: 'vendedor',
    percentual: 8,
    vendasMes: 25,
    servicosMes: 0,
    valorComissao: 1200.00,
    meta: 30,
    status: 'ativo'
  },
  {
    id: '3',
    funcionario: 'Carlos Oliveira',
    tipo: 'tecnico',
    percentual: 4.5,
    vendasMes: 0,
    servicosMes: 8,
    valorComissao: 320.00,
    meta: 12,
    status: 'ativo'
  }
];

const mockRules: CommissionRule[] = [
  {
    id: '1',
    tipo: 'tecnico',
    categoria: 'Conserto Smartphone',
    percentual: 5,
    valorMinimo: 50,
    ativo: true
  },
  {
    id: '2',
    tipo: 'vendedor',
    categoria: 'Venda Produto',
    percentual: 8,
    valorMinimo: 100,
    ativo: true
  },
  {
    id: '3',
    tipo: 'tecnico',
    categoria: 'Troca de Tela',
    percentual: 6,
    valorMinimo: 80,
    ativo: true
  }
];

export default function CommissionSystem() {
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);
  const [rules, setRules] = useState<CommissionRule[]>(mockRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const { toast } = useToast();

  const totalComissoes = commissions.reduce((sum, c) => sum + c.valorComissao, 0);
  const tecnicosAtivos = commissions.filter(c => c.tipo === 'tecnico' && c.status === 'ativo').length;
  const vendedoresAtivos = commissions.filter(c => c.tipo === 'vendedor' && c.status === 'ativo').length;

  const handleSaveCommission = () => {
    toast({
      title: "Comissão salva",
      description: "As informações de comissão foram atualizadas com sucesso.",
    });
    setIsDialogOpen(false);
  };

  const handleSaveRule = () => {
    toast({
      title: "Regra salva",
      description: "A regra de comissionamento foi configurada com sucesso.",
    });
    setIsRuleDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary" />
            Sistema de Comissionamento
          </h2>
          <p className="text-muted-foreground">Gerencie comissões de técnicos e vendedores</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Configurar Regras
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configurar Regra de Comissão</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipo-regra">Tipo de Funcionário</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria de Serviço</Label>
                  <Input placeholder="Ex: Conserto de Smartphone" />
                </div>
                <div>
                  <Label htmlFor="percentual">Percentual (%)</Label>
                  <Input type="number" placeholder="5.0" step="0.1" />
                </div>
                <div>
                  <Label htmlFor="valor-minimo">Valor Mínimo (R$)</Label>
                  <Input type="number" placeholder="50.00" step="0.01" />
                </div>
                <Button onClick={handleSaveRule} className="w-full">
                  Salvar Regra
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Cadastrar Funcionário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Funcionário</Label>
                  <Input placeholder="Digite o nome completo" />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo de Funcionário</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="percentual">Percentual Base (%)</Label>
                  <Input type="number" placeholder="5.0" step="0.1" />
                </div>
                <div>
                  <Label htmlFor="meta">Meta Mensal</Label>
                  <Input type="number" placeholder="15" />
                </div>
                <Button onClick={handleSaveCommission} className="w-full">
                  Salvar Funcionário
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Comissões</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Técnicos Ativos</p>
                <p className="text-2xl font-bold text-blue-600">{tecnicosAtivos}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendedores Ativos</p>
                <p className="text-2xl font-bold text-purple-600">{vendedoresAtivos}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Média Comissão</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {(totalComissoes / commissions.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="funcionarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="funcionarios" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="regras" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Regras de Comissão
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funcionarios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Funcionários e Comissões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Percentual</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Meta</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell className="font-medium">{commission.funcionario}</TableCell>
                      <TableCell>
                        <Badge variant={commission.tipo === 'tecnico' ? 'default' : 'secondary'}>
                          {commission.tipo === 'tecnico' ? 'Técnico' : 'Vendedor'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          {commission.percentual}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {commission.tipo === 'tecnico' ? (
                            <span className="text-sm">{commission.servicosMes} serviços</span>
                          ) : (
                            <span className="text-sm">{commission.vendasMes} vendas</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {commission.meta}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        R$ {commission.valorComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={commission.status === 'ativo' ? 'default' : 'destructive'}>
                          {commission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regras">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Regras de Comissionamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Percentual</TableHead>
                    <TableHead>Valor Mínimo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <Badge variant={rule.tipo === 'tecnico' ? 'default' : 'secondary'}>
                          {rule.tipo === 'tecnico' ? 'Técnico' : 'Vendedor'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{rule.categoria}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          {rule.percentual}%
                        </div>
                      </TableCell>
                      <TableCell>
                        R$ {rule.valorMinimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.ativo ? 'default' : 'destructive'}>
                          {rule.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}