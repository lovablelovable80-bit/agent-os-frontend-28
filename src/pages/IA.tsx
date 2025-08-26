import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  MessageSquare, 
  Database, 
  Settings, 
  Zap, 
  Phone, 
  Brain,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  Activity,
  BarChart3,
  TrendingUp,
  Shield,
  Key,
  Lightbulb,
  BookOpen
} from "lucide-react";
import { TrainingSystem } from "@/components/ia/TrainingSystem";

interface IAConfig {
  nome_assistente: string;
  prompt_sistema: string;
  temperatura: number;
  max_tokens: number;
  ativo: boolean;
  usar_dados_empresa: boolean;
  tabelas_autorizadas: string[];
  conhecimento_personalizado: string;
}

interface WhatsAppConfig {
  numero_whatsapp: string;
  api_token: string;
  relatorios_diarios: boolean;
  notificacoes_sistema: boolean;
  horario_relatorio: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const IA = () => {
  const { toast } = useToast();
  const [iaConfig, setIaConfig] = useState<IAConfig>({
    nome_assistente: "Assistente IA",
    prompt_sistema: "Você é um assistente IA especializado em gestão empresarial para uma empresa de assistência técnica. Você tem acesso aos dados do sistema e pode ajudar com análises, relatórios e automações.",
    temperatura: 0.7,
    max_tokens: 1500,
    ativo: true,
    usar_dados_empresa: true,
    tabelas_autorizadas: ['clientes', 'produtos', 'servicos', 'oportunidades'],
    conhecimento_personalizado: ""
  });

  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    numero_whatsapp: "",
    api_token: "",
    relatorios_diarios: false,
    notificacoes_sistema: false,
    horario_relatorio: "08:00"
  });

  const [loading, setLoading] = useState(false);
  const [testando, setTestando] = useState(false);
  const [configuracaoExiste, setConfiguracaoExiste] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [enviandoMensagem, setEnviandoMensagem] = useState(false);
  const [statusIA, setStatusIA] = useState<'offline' | 'online' | 'configurando'>('offline');

  const tabelasDisponiveis = [
    { name: 'clientes', label: 'Clientes', description: 'Dados dos clientes da empresa' },
    { name: 'produtos', label: 'Produtos', description: 'Catálogo de produtos' },
    { name: 'servicos', label: 'Serviços', description: 'Serviços oferecidos' },
    { name: 'oportunidades', label: 'Oportunidades', description: 'Pipeline de vendas' },
    { name: 'atividades', label: 'Atividades', description: 'Tarefas e atividades' },
    { name: 'financeiro', label: 'Financeiro', description: 'Dados financeiros' },
    { name: 'documentos', label: 'Documentos', description: 'Arquivos e documentos' },
    { name: 'usuarios', label: 'Usuários', description: 'Usuários do sistema' }
  ];

  const templatePrompts = [
    {
      name: "Assistente Geral",
      prompt: "Você é um assistente IA especializado em gestão empresarial para uma empresa de assistência técnica. Você tem acesso aos dados do sistema e pode ajudar com análises, relatórios e automações."
    },
    {
      name: "Analista de Vendas",
      prompt: "Você é um analista de vendas especializado. Foque em análises de oportunidades, relatórios de vendas, identificação de trends e sugestões para aumentar conversões."
    },
    {
      name: "Gerente Financeiro",
      prompt: "Você é um consultor financeiro. Analise dados financeiros, gere relatórios de receitas/despesas, identifique oportunidades de economia e monitore a saúde financeira."
    },
    {
      name: "Suporte ao Cliente",
      prompt: "Você é um especialista em atendimento ao cliente. Ajude com análises de satisfação, geração de relatórios de atendimento e sugestões para melhorar a experiência do cliente."
    }
  ];

  const automacoesPredefinidas = [
    {
      name: "Relatório Diário de Vendas",
      description: "Gera automaticamente um relatório diário com o resumo das vendas",
      icon: BarChart3,
      active: false
    },
    {
      name: "Notificação de Oportunidades Perdidas",
      description: "Alerta quando oportunidades ficam muito tempo sem atualização",
      icon: AlertCircle,
      active: false
    },
    {
      name: "Análise Semanal de Performance",
      description: "Análise semanal do desempenho da empresa",
      icon: TrendingUp,
      active: false
    },
    {
      name: "Lembrete de Follow-up",
      description: "Lembra de fazer follow-up com clientes",
      icon: Clock,
      active: false
    }
  ];

  useEffect(() => {
    carregarConfiguracoes();
    verificarStatusIA();
  }, []);

  const verificarStatusIA = () => {
    if (iaConfig.ativo && configuracaoExiste) {
      setStatusIA('online');
    } else if (configuracaoExiste) {
      setStatusIA('configurando');
    } else {
      setStatusIA('offline');
    }
  };

  useEffect(() => {
    verificarStatusIA();
  }, [iaConfig.ativo, configuracaoExiste]);

  const carregarConfiguracoes = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_assistants')
        .select('*')
        .maybeSingle();

      if (data && !error) {
        setConfiguracaoExiste(true);
        setIaConfig({
          nome_assistente: data.nome_assistente,
          prompt_sistema: data.prompt_sistema,
          temperatura: data.temperatura,
          max_tokens: data.max_tokens,
          ativo: data.ativo,
          usar_dados_empresa: data.usar_dados_empresa,
          tabelas_autorizadas: data.tabelas_autorizadas || [],
          conhecimento_personalizado: data.conhecimento_personalizado || ""
        });
      } else if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar configurações:', error);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const salvarConfiguracoes = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Get user's company_id from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      if (!profile?.company_id) {
        throw new Error('Empresa não identificada');
      }

      const { error } = await supabase
        .from('ai_assistants')
        .upsert({
          ...iaConfig,
          company_id: profile.company_id,
          created_by: user.id
        });

      if (error) throw error;

      setConfiguracaoExiste(true);
      toast({
        title: "✅ Configurações salvas",
        description: "As configurações da IA foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Erro ao salvar configurações da IA.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testarIA = async () => {
    setTestando(true);
    
    // Verificar se a configuração existe primeiro
    if (!configuracaoExiste) {
      toast({
        title: "⚠ Configuração necessária",
        description: "Salve as configurações primeiro antes de testar a IA.",
        variant: "destructive",
      });
      setTestando(false);
      return;
    }

    try {
      console.log('Iniciando teste da IA...');
      console.log('Configuração:', iaConfig);
      
      const { data, error } = await supabase.functions.invoke('ia-assistant', {
        body: { 
          message: "Olá! Por favor, me diga sobre o status atual da empresa e faça um breve resumo dos dados disponíveis. Este é um teste de funcionamento.",
          config: iaConfig
        }
      });

      console.log('Resposta da Edge Function:', { data, error });

      if (error) {
        console.error('Erro da Edge Function:', error);
        throw error;
      }

      toast({
        title: "✅ Teste realizado com sucesso",
        description: "A IA está funcionando corretamente!",
      });

      // Adicionar mensagem ao chat de teste
      setChatMessages(prev => [
        ...prev,
        {
          role: 'user',
          content: "Teste de funcionamento da IA",
          timestamp: new Date()
        },
        {
          role: 'assistant',
          content: data?.response || "IA funcionando corretamente!",
          timestamp: new Date()
        }
      ]);
      
    } catch (error: any) {
      console.error('Erro completo no teste:', error);
      
      let errorMessage = "Erro ao testar a IA.";
      
      if (error.message?.includes('OPENAI_API_KEY')) {
        errorMessage = "Chave da OpenAI não configurada. Configure no painel do Supabase.";
      } else if (error.message?.includes('Failed to fetch')) {
        errorMessage = "Erro de conexão com a IA. Verifique sua internet.";
      } else if (error.details) {
        errorMessage = `Erro: ${error.details}`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "❌ Erro no teste",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTestando(false);
    }
  };

  const enviarMensagem = async () => {
    if (!currentMessage.trim() || enviandoMensagem) return;

    setEnviandoMensagem(true);
    const mensagem = currentMessage;
    setCurrentMessage("");

    // Adicionar mensagem do usuário
    setChatMessages(prev => [...prev, {
      role: 'user',
      content: mensagem,
      timestamp: new Date()
    }]);

    try {
      const { data, error } = await supabase.functions.invoke('ia-assistant', {
        body: { 
          message: mensagem,
          config: iaConfig
        }
      });

      if (error) throw error;

      // Adicionar resposta da IA
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || "Desculpe, não consegui processar sua solicitação.",
        timestamp: new Date()
      }]);
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: "Erro ao processar sua solicitação. Verifique se a IA está configurada corretamente.",
        timestamp: new Date()
      }]);
    } finally {
      setEnviandoMensagem(false);
    }
  };

  const toggleTabela = (tabela: string) => {
    setIaConfig(prev => ({
      ...prev,
      tabelas_autorizadas: prev.tabelas_autorizadas.includes(tabela)
        ? prev.tabelas_autorizadas.filter(t => t !== tabela)
        : [...prev.tabelas_autorizadas, tabela]
    }));
  };

  const aplicarTemplate = (template: typeof templatePrompts[0]) => {
    setIaConfig(prev => ({
      ...prev,
      prompt_sistema: template.prompt
    }));
    toast({
      title: "Template aplicado",
      description: `Prompt "${template.name}" aplicado com sucesso.`,
    });
  };

  return (
    <PageContainer
      title="Inteligência Artificial"
      description="Configure e treine sua IA para automação e relatórios"
      action={
        <div className="flex items-center gap-2">
          <Badge 
            variant={statusIA === 'online' ? 'default' : statusIA === 'configurando' ? 'secondary' : 'destructive'}
            className="flex items-center gap-1"
          >
            <div className={`w-2 h-2 rounded-full ${
              statusIA === 'online' ? 'bg-green-500' : 
              statusIA === 'configurando' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            {statusIA === 'online' ? 'Online' : statusIA === 'configurando' ? 'Configurando' : 'Offline'}
          </Badge>
        </div>
      }
    >
      <Tabs defaultValue="configuracao" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="configuracao" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuração
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat de Teste
          </TabsTrigger>
          <TabsTrigger value="treinamento" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Treinamento
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="automacao" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuracao" className="space-y-6">
          {!configuracaoExiste && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Configure sua IA pela primeira vez. Defina como ela deve se comportar e quais dados pode acessar.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Configurações Básicas */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Configurações Básicas
                </CardTitle>
                <CardDescription>
                  Configure o comportamento e personalidade da sua IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Assistente</Label>
                  <Input
                    id="nome"
                    value={iaConfig.nome_assistente}
                    onChange={(e) => setIaConfig(prev => ({ ...prev, nome_assistente: e.target.value }))}
                    placeholder="Ex: Assistente Virtual"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prompt">Prompt do Sistema</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        toast({
                          title: "Templates disponíveis",
                          description: "Escolha um template na lista abaixo",
                        });
                      }}
                    >
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Templates
                    </Button>
                  </div>
                  <Textarea
                    id="prompt"
                    value={iaConfig.prompt_sistema}
                    onChange={(e) => setIaConfig(prev => ({ ...prev, prompt_sistema: e.target.value }))}
                    placeholder="Defina como a IA deve se comportar..."
                    rows={8}
                  />
                  
                  {/* Templates de prompt */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {templatePrompts.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => aplicarTemplate(template)}
                        className="text-xs h-auto py-2"
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperatura">
                      Temperatura: {iaConfig.temperatura}
                      <span className="text-sm text-muted-foreground block">
                        {iaConfig.temperatura < 0.3 ? 'Muito conservador' : 
                         iaConfig.temperatura < 0.7 ? 'Equilibrado' : 
                         iaConfig.temperatura < 1.2 ? 'Criativo' : 'Muito criativo'}
                      </span>
                    </Label>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={iaConfig.temperatura}
                        onChange={(e) => setIaConfig(prev => ({ ...prev, temperatura: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tokens">Max Tokens</Label>
                    <Select 
                      value={iaConfig.max_tokens.toString()} 
                      onValueChange={(value) => setIaConfig(prev => ({ ...prev, max_tokens: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500">500 (Respostas curtas)</SelectItem>
                        <SelectItem value="1000">1000 (Respostas médias)</SelectItem>
                        <SelectItem value="1500">1500 (Respostas longas)</SelectItem>
                        <SelectItem value="2000">2000 (Respostas muito longas)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="ativo" className="text-base">IA Ativa</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativar ou desativar o assistente IA
                    </p>
                  </div>
                  <Switch
                    id="ativo"
                    checked={iaConfig.ativo}
                    onCheckedChange={(checked) => setIaConfig(prev => ({ ...prev, ativo: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status e Conhecimento */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Status da IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${
                      statusIA === 'online' ? 'bg-green-500' : 
                      statusIA === 'configurando' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium">
                      {statusIA === 'online' ? 'Online e Funcionando' : 
                       statusIA === 'configurando' ? 'Aguardando Configuração' : 'Offline'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Configuração:</span>
                      <span className={configuracaoExiste ? 'text-green-600' : 'text-red-600'}>
                        {configuracaoExiste ? '✓ Completa' : '✗ Pendente'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dados Conectados:</span>
                      <span className={iaConfig.usar_dados_empresa ? 'text-green-600' : 'text-yellow-600'}>
                        {iaConfig.usar_dados_empresa ? '✓ Sim' : '⚠ Não'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tabelas Autorizadas:</span>
                      <span className="text-blue-600">
                        {iaConfig.tabelas_autorizadas.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conhecimento Personalizado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Conhecimento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="conhecimento">Conhecimento Personalizado</Label>
                    <Textarea
                      id="conhecimento"
                      value={iaConfig.conhecimento_personalizado}
                      onChange={(e) => setIaConfig(prev => ({ ...prev, conhecimento_personalizado: e.target.value }))}
                      placeholder="Adicione informações específicas sobre sua empresa, processos, políticas, etc..."
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Acesso aos Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Acesso aos Dados
              </CardTitle>
              <CardDescription>
                Configure quais dados do sistema a IA pode acessar para análises e relatórios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="usar_dados" className="text-base">Usar Dados da Empresa</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que a IA acesse dados do sistema para análises
                  </p>
                </div>
                <Switch
                  id="usar_dados"
                  checked={iaConfig.usar_dados_empresa}
                  onCheckedChange={(checked) => setIaConfig(prev => ({ ...prev, usar_dados_empresa: checked }))}
                />
              </div>

              {iaConfig.usar_dados_empresa && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <Label className="text-sm font-medium">Tabelas Autorizadas</Label>
                    <Badge variant="secondary" className="text-xs">
                      {iaConfig.tabelas_autorizadas.length} selecionadas
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {tabelasDisponiveis.map((tabela) => (
                      <div
                        key={tabela.name}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          iaConfig.tabelas_autorizadas.includes(tabela.name)
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => toggleTabela(tabela.name)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-sm">{tabela.label}</span>
                          {iaConfig.tabelas_autorizadas.includes(tabela.name) && (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{tabela.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configurações Avançadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Avançadas
              </CardTitle>
              <CardDescription>
                Opções avançadas de integração e comportamento da IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base">Chat Flutuante Ativo</Label>
                      <p className="text-sm text-muted-foreground">
                        Exibir o chat flutuante da IA em todas as páginas
                      </p>
                    </div>
                    <Switch
                      checked={true}
                      disabled
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base">Aprendizado Contínuo</Label>
                      <p className="text-sm text-muted-foreground">
                        IA aprende com as interações para melhorar respostas
                      </p>
                    </div>
                    <Switch
                      checked={true}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base">Modo Debug</Label>
                      <p className="text-sm text-muted-foreground">
                        Mostrar informações técnicas nas respostas
                      </p>
                    </div>
                    <Switch
                      checked={false}
                      disabled
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base">Cache de Respostas</Label>
                      <p className="text-sm text-muted-foreground">
                        Acelerar respostas usando cache inteligente
                      </p>
                    </div>
                    <Switch
                      checked={true}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Funcionalidades avançadas em desenvolvimento. Configurações serão habilitadas em versões futuras.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Button onClick={salvarConfiguracoes} disabled={loading} className="flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={testarIA} 
                disabled={testando}
                className="flex items-center gap-2"
              >
                {testando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                    Testando IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Testar IA
                  </>
                )}
              </Button>
            </div>

            {!configuracaoExiste && (
              <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                ⚠ Salve as configurações primeiro para poder testar a IA
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Métricas Principais */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Conversas</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +12% desde último mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3s</div>
                <p className="text-xs text-muted-foreground">
                  -0.2s desde ontem
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.5%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% desde última semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tokens Utilizados</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156.2K</div>
                <p className="text-xs text-muted-foreground">
                  +5.1% desde ontem
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Uso */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Uso da IA nos Últimos 7 Dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Gráfico de uso em desenvolvimento</p>
                    <p className="text-sm mt-2">Em breve você verá estatísticas detalhadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Comandos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Comandos Mais Utilizados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { comando: "Gerar relatório de vendas", usos: 156, percentual: 32 },
                  { comando: "Buscar cliente", usos: 98, percentual: 20 },
                  { comando: "Criar ordem de serviço", usos: 87, percentual: 18 },
                  { comando: "Análise financeira", usos: 72, percentual: 15 },
                  { comando: "Outros comandos", usos: 67, percentual: 15 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.comando}</span>
                      <span className="text-muted-foreground">{item.usos} usos</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${item.percentual}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Performance da IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance e Saúde da IA
              </CardTitle>
              <CardDescription>
                Métricas técnicas e indicadores de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Disponibilidade</span>
                    <span className="text-sm text-green-600">99.8%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-[99.8%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Precisão das Respostas</span>
                    <span className="text-sm text-blue-600">94.5%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[94.5%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Velocidade Média</span>
                    <span className="text-sm text-purple-600">2.3s</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-[85%]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico de Conversas
              </CardTitle>
              <CardDescription>
                Visualize todas as interações com a IA para análise e melhoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="periodo">Período:</Label>
                  <Select defaultValue="7dias">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hoje">Hoje</SelectItem>
                      <SelectItem value="7dias">7 dias</SelectItem>
                      <SelectItem value="30dias">30 dias</SelectItem>
                      <SelectItem value="todos">Todos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="tipo">Tipo:</Label>
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="comandos">Comandos</SelectItem>
                      <SelectItem value="perguntas">Perguntas</SelectItem>
                      <SelectItem value="erros">Erros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>

              {/* Lista de Conversas */}
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    data: "2024-01-20 14:30",
                    usuario: "João Silva",
                    pergunta: "Gerar relatório de vendas do último mês",
                    resposta: "Relatório gerado com sucesso. Total de vendas: R$ 45.230,00...",
                    status: "sucesso",
                    tokens: 245
                  },
                  {
                    id: 2,
                    data: "2024-01-20 13:15",
                    usuario: "Maria Santos",
                    pergunta: "Buscar cliente João da Silva",
                    resposta: "Encontrados 3 clientes com esse nome. Mostrando resultados...",
                    status: "sucesso",
                    tokens: 156
                  },
                  {
                    id: 3,
                    data: "2024-01-20 12:45",
                    usuario: "Pedro Costa",
                    pergunta: "Criar ordem de serviço para cliente ABC",
                    resposta: "Erro: Cliente ABC não encontrado no sistema.",
                    status: "erro",
                    tokens: 89
                  },
                  {
                    id: 4,
                    data: "2024-01-20 11:20",
                    usuario: "Ana Lima",
                    pergunta: "Análise financeira do trimestre",
                    resposta: "Análise financeira completa gerada. Receita: R$ 156.780,00...",
                    status: "sucesso",
                    tokens: 423
                  }
                ].map((conversa) => (
                  <Card key={conversa.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={conversa.status === 'sucesso' ? 'default' : 'destructive'}>
                            {conversa.status === 'sucesso' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {conversa.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{conversa.data}</span>
                          <span className="text-sm font-medium">{conversa.usuario}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm"><strong>Pergunta:</strong> {conversa.pergunta}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm"><strong>Resposta:</strong> {conversa.resposta}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {conversa.tokens} tokens
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Mostrando 4 de 156 conversas
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm">
                    Próximo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat de Teste com IA
              </CardTitle>
              <CardDescription>
                Teste e converse com sua IA para verificar o funcionamento
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Área de mensagens */}
              <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg mb-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Inicie uma conversa com sua IA</p>
                    <p className="text-sm mt-2">Experimente perguntar sobre dados da empresa ou pedir relatórios</p>
                  </div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-white border'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {enviandoMensagem && (
                  <div className="flex justify-start">
                    <div className="bg-white border p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                        <span className="text-sm">IA está pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input de mensagem */}
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                  disabled={enviandoMensagem || !configuracaoExiste || !iaConfig.ativo}
                />
                <Button 
                  onClick={enviarMensagem}
                  disabled={!currentMessage.trim() || enviandoMensagem || !configuracaoExiste || !iaConfig.ativo}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {(!configuracaoExiste || !iaConfig.ativo) && (
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {!configuracaoExiste 
                      ? "Configure a IA primeiro na aba 'Configuração'"
                      : "Ative a IA nas configurações para usar o chat"
                    }
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treinamento" className="space-y-6">
          <TrainingSystem />
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Configuração WhatsApp
              </CardTitle>
              <CardDescription>
                Configure relatórios e notificações automáticas via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  Para usar WhatsApp Business API, você precisa de uma conta verificada e token de acesso.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número WhatsApp</Label>
                  <Input
                    id="numero"
                    value={whatsappConfig.numero_whatsapp}
                    onChange={(e) => setWhatsappConfig(prev => ({ ...prev, numero_whatsapp: e.target.value }))}
                    placeholder="Ex: +5511999999999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token">Token da API</Label>
                  <Input
                    id="token"
                    type="password"
                    value={whatsappConfig.api_token}
                    onChange={(e) => setWhatsappConfig(prev => ({ ...prev, api_token: e.target.value }))}
                    placeholder="Token da API do WhatsApp Business"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base">Relatórios Diários</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba relatórios automáticos todos os dias com resumo das atividades
                    </p>
                  </div>
                  <Switch
                    checked={whatsappConfig.relatorios_diarios}
                    onCheckedChange={(checked) => setWhatsappConfig(prev => ({ ...prev, relatorios_diarios: checked }))}
                  />
                </div>

                {whatsappConfig.relatorios_diarios && (
                  <div className="ml-4 space-y-4 border-l-2 border-primary/20 pl-4">
                    <div className="space-y-2">
                      <Label htmlFor="horario">Horário do Relatório</Label>
                      <Input
                        id="horario"
                        type="time"
                        value={whatsappConfig.horario_relatorio}
                        onChange={(e) => setWhatsappConfig(prev => ({ ...prev, horario_relatorio: e.target.value }))}
                        className="w-32"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base">Notificações do Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações sobre eventos importantes do sistema
                    </p>
                  </div>
                  <Switch
                    checked={whatsappConfig.notificacoes_sistema}
                    onCheckedChange={(checked) => setWhatsappConfig(prev => ({ ...prev, notificacoes_sistema: checked }))}
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Funcionalidade em desenvolvimento. Em breve você poderá receber relatórios e notificações via WhatsApp.
                </AlertDescription>
              </Alert>

              <Button disabled className="w-full">
                Salvar Configurações WhatsApp
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automacao" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {automacoesPredefinidas.map((automacao, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <automacao.icon className="h-5 w-5" />
                    {automacao.name}
                  </CardTitle>
                  <CardDescription>
                    {automacao.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={automacao.active ? "default" : "secondary"}>
                        {automacao.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              As automações estão em desenvolvimento. Em breve você poderá configurar automações personalizadas para sua IA executar tarefas automaticamente.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default IA;