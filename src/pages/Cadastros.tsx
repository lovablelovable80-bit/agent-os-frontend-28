import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Target, TrendingUp, Clock, Shield, DollarSign, BarChart3, Users, Package, Edit, Trash2, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schema de validação com Zod
const metaSchema = z.object({
  tempoOS: z.string().min(1, "Campo obrigatório").regex(/^\d*\.?\d+$/, "Deve ser um número válido"),
  vendas: z.string().min(1, "Campo obrigatório").regex(/^\d+$/, "Deve ser um número válido"),
  garantia: z.string().min(1, "Campo obrigatório").regex(/^([0-9]|[1-9][0-9]|100)$/, "Deve ser entre 0 e 100"),
  faturamento: z.string().min(1, "Campo obrigatório").regex(/^\d+$/, "Deve ser um número válido"),
  margemLucro: z.string().min(1, "Campo obrigatório").regex(/^([0-9]|[1-9][0-9]|100)$/, "Deve ser entre 0 e 100"),
  totalOS: z.string().min(1, "Campo obrigatório").regex(/^\d+$/, "Deve ser um número válido"),
  satisfacaoCliente: z.string().min(1, "Campo obrigatório").regex(/^([0-9]|[1-9][0-9]|100)$/, "Deve ser entre 0 e 100"),
  produtividade: z.string().min(1, "Campo obrigatório").regex(/^\d+$/, "Deve ser um número válido"),
  custosOperacionais: z.string().min(1, "Campo obrigatório").regex(/^([0-9]|[1-9][0-9]|100)$/, "Deve ser entre 0 e 100"),
  ticketMedio: z.string().min(1, "Campo obrigatório").regex(/^\d+$/, "Deve ser um número válido")
});

interface MetaFormData {
  tempoOS: string;
  vendas: string;
  garantia: string;
  faturamento: string;
  margemLucro: string;
  totalOS: string;
  satisfacaoCliente: string;
  produtividade: string;
  custosOperacionais: string;
  ticketMedio: string;
}

interface MetaSalva extends MetaFormData {
  id: string;
  dataCriacao: string;
  status: 'ativa' | 'pausada' | 'concluida';
  progresso?: number;
}

export default function Cadastros() {
  const { toast } = useToast();
  const [metasSalvas, setMetasSalvas] = useState<MetaSalva[]>([]);
  const [editandoMeta, setEditandoMeta] = useState<MetaSalva | null>(null);
  const [activeTab, setActiveTab] = useState("cadastro");

  const form = useForm<MetaFormData>({
    resolver: zodResolver(metaSchema),
    defaultValues: {
      tempoOS: "",
      vendas: "",
      garantia: "",
      faturamento: "",
      margemLucro: "",
      totalOS: "",
      satisfacaoCliente: "",
      produtividade: "",
      custosOperacionais: "",
      ticketMedio: ""
    }
  });

  // Carregar metas do localStorage
  useEffect(() => {
    const metasStorage = localStorage.getItem('metas-agentOS');
    if (metasStorage) {
      setMetasSalvas(JSON.parse(metasStorage));
    }
  }, []);

  // Salvar metas no localStorage
  const salvarMetasStorage = (metas: MetaSalva[]) => {
    localStorage.setItem('metas-agentOS', JSON.stringify(metas));
    setMetasSalvas(metas);
  };

  const onSubmit = (data: MetaFormData) => {
    const novaMeta: MetaSalva = {
      ...data,
      id: editandoMeta?.id || Date.now().toString(),
      dataCriacao: editandoMeta?.dataCriacao || new Date().toISOString(),
      status: 'ativa',
      progresso: Math.floor(Math.random() * 100) // Simulação de progresso
    };

    let metasAtualizadas: MetaSalva[];
    
    if (editandoMeta) {
      metasAtualizadas = metasSalvas.map(meta => 
        meta.id === editandoMeta.id ? novaMeta : meta
      );
      toast({
        title: "Meta atualizada com sucesso!",
        description: "As alterações foram salvas no sistema.",
      });
      setEditandoMeta(null);
    } else {
      metasAtualizadas = [...metasSalvas, novaMeta];
      toast({
        title: "Meta cadastrada com sucesso!",
        description: "Nova meta foi adicionada ao sistema.",
      });
    }

    salvarMetasStorage(metasAtualizadas);
    form.reset();
    setActiveTab("lista");
  };

  const editarMeta = (meta: MetaSalva) => {
    setEditandoMeta(meta);
    form.reset(meta);
    setActiveTab("cadastro");
  };

  const excluirMeta = (id: string) => {
    const metasAtualizadas = metasSalvas.filter(meta => meta.id !== id);
    salvarMetasStorage(metasAtualizadas);
    toast({
      title: "Meta excluída",
      description: "A meta foi removida do sistema.",
      variant: "destructive",
    });
  };

  const metricCards = [
    {
      title: "Metas Cadastradas",
      value: metasSalvas.length.toString(),
      description: "Total de metas no sistema",
      color: "text-green-500",
      icon: Target
    },
    {
      title: "Metas Ativas",
      value: metasSalvas.filter(m => m.status === 'ativa').length.toString(),
      description: "Metas em acompanhamento",
      color: "text-blue-500",
      icon: Clock
    },
    {
      title: "Metas Concluídas",
      value: metasSalvas.filter(m => m.status === 'concluida').length.toString(),
      description: "Objetivos alcançados",
      color: "text-emerald-500",
      icon: TrendingUp
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'text-green-500 bg-green-500/10';
      case 'pausada': return 'text-yellow-500 bg-yellow-500/10';
      case 'concluida': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            <Target className="w-10 h-10 text-primary" />
            CADASTRO DE METAS
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Configure metas e objetivos para acompanhamento dinâmico
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Sistema de Metas
        </Badge>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="transition-all duration-300 hover:scale-105 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">{metric.title}</div>
                  <IconComponent className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{metric.description}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sistema de Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
          <TabsTrigger value="cadastro" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {editandoMeta ? 'Editar Meta' : 'Cadastrar Metas'}
          </TabsTrigger>
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Metas Cadastradas ({metasSalvas.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab de Cadastro */}
        <TabsContent value="cadastro">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                🎯 {editandoMeta ? 'Editar Meta' : 'Configuração de Metas'}
                <Badge variant="outline">{editandoMeta ? 'Modo Edição' : 'Dados Dinâmicos'}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <Tabs defaultValue="operacionais" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-lg">
                      <TabsTrigger value="operacionais" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Metas Operacionais
                      </TabsTrigger>
                      <TabsTrigger value="financeiras" className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Metas Financeiras
                      </TabsTrigger>
                      <TabsTrigger value="estrategicas" className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Metas Estratégicas
                      </TabsTrigger>
                    </TabsList>

                    {/* Metas Operacionais */}
                    <TabsContent value="operacionais" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="tempoOS"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" />
                                Meta de Tempo por O.S (horas)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: 2.5" 
                                  type="number" 
                                  step="0.1"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="totalOS"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-purple-500" />
                                Meta Total de O.S (mensal)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: 200" 
                                  type="number"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="garantia"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-500" />
                                Meta de Garantia (%)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: 95" 
                                  type="number"
                                  max="100"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="produtividade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-orange-500" />
                                Meta de Produtividade (O.S/dia)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: 8" 
                                  type="number"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    {/* Metas Financeiras */}
                    <TabsContent value="financeiras" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="vendas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                Meta de Vendas (R$ mensal)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: 50000" 
                                  type="number"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="faturamento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-blue-500" />
                                Meta de Faturamento (R$ mensal)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: 100000" 
                                  type="number"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="margemLucro"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                Meta de Margem de Lucro (%)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: 25" 
                                  type="number"
                                  max="100"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="ticketMedio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-purple-500" />
                                Meta de Ticket Médio (R$)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: 250" 
                                  type="number"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    {/* Metas Estratégicas */}
                    <TabsContent value="estrategicas" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="satisfacaoCliente"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-pink-500" />
                                Meta de Satisfação do Cliente (%)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: 90" 
                                  type="number"
                                  max="100"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="custosOperacionais"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-red-500" />
                                Meta de Redução de Custos (%)
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: 10" 
                                  type="number"
                                  max="100"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Separator />

                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setEditandoMeta(null);
                      }}
                    >
                      {editandoMeta ? 'Cancelar Edição' : 'Limpar Formulário'}
                    </Button>
                    <Button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600">
                      <Save className="w-4 h-4" />
                      {editandoMeta ? 'Atualizar Meta' : 'Salvar Metas'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Lista */}
        <TabsContent value="lista">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                📋 Metas Cadastradas
                <Badge variant="outline">{metasSalvas.length} metas</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metasSalvas.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Nenhuma meta cadastrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Comece cadastrando suas primeiras metas para acompanhar o desempenho.
                  </p>
                  <Button onClick={() => setActiveTab("cadastro")}>
                    Cadastrar Primeira Meta
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo de Meta</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progresso</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metasSalvas.map((meta) => (
                        <TableRow key={meta.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">Tempo O.S: {meta.tempoOS}h</div>
                              <div className="text-sm text-muted-foreground">
                                Vendas: R${parseInt(meta.vendas).toLocaleString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div>Faturamento: R${parseInt(meta.faturamento).toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">
                                Margem: {meta.margemLucro}% | Garantia: {meta.garantia}%
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(meta.status)}>
                              {meta.status.charAt(0).toUpperCase() + meta.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-muted h-2 rounded-full">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all"
                                  style={{ width: `${meta.progresso || 0}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{meta.progresso || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(meta.dataCriacao).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => editarMeta(meta)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="icon">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => excluirMeta(meta.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dashboard de Performance das Metas */}
      {metasSalvas.length > 0 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              📊 Dashboard de Performance
              <Badge variant="secondary">Análise em Tempo Real</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {metasSalvas.slice(0, 4).map((meta, index) => (
                <div key={meta.id} className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Meta {index + 1}</div>
                    <Badge className={getStatusColor(meta.status)}>
                      {meta.status}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-blue-500 mb-1">
                    R$ {parseInt(meta.vendas).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">Vendas</div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progresso</span>
                      <span>{meta.progresso || 0}%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${meta.progresso || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Estatísticas Gerais */}
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    {metasSalvas.length > 0 ? Math.round(metasSalvas.reduce((acc, meta) => acc + (meta.progresso || 0), 0) / metasSalvas.length) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Progresso Médio</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">
                    R$ {metasSalvas.reduce((acc, meta) => acc + parseInt(meta.faturamento), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Meta Total Faturamento</div>
                </div>
                <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">
                    {metasSalvas.length > 0 ? Math.round(metasSalvas.reduce((acc, meta) => acc + parseInt(meta.margemLucro), 0) / metasSalvas.length) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Margem Média</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}