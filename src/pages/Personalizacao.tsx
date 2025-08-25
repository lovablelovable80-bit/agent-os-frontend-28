import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Palette, 
  Monitor, 
  Settings, 
  Bell, 
  Layout, 
  Eye, 
  Volume2, 
  Moon, 
  Sun,
  Smartphone,
  Save,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePersonalization } from "@/hooks/usePersonalization";

export default function Personalizacao() {
  const { toast } = useToast();
  const { settings, updateSetting, resetSettings } = usePersonalization();

  const colorOptions = [
    { value: "blue", label: "Azul", color: "hsl(221, 83%, 53%)" },
    { value: "green", label: "Verde", color: "hsl(142, 76%, 36%)" },
    { value: "purple", label: "Roxo", color: "hsl(262, 83%, 58%)" },
    { value: "orange", label: "Laranja", color: "hsl(25, 95%, 53%)" },
    { value: "red", label: "Vermelho", color: "hsl(0, 84%, 60%)" },
    { value: "teal", label: "Azul-verde", color: "hsl(173, 58%, 39%)" },
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas personalizações foram aplicadas com sucesso.",
    });
  };

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: "Configurações resetadas",
      description: "Todas as personalizações foram restauradas para o padrão.",
    });
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Personalização</h1>
            <p className="text-muted-foreground">
              Configure a aparência e funcionalidades do sistema conforme suas preferências
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleResetSettings}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>

        <Tabs defaultValue="aparencia" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="aparencia" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="interface" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Interface
            </TabsTrigger>
            <TabsTrigger value="funcionalidades" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Funcionalidades
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
          </TabsList>

          {/* Aba Aparência */}
          <TabsContent value="aparencia" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tema */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Tema do Sistema
                  </CardTitle>
                  <CardDescription>
                    Escolha entre tema claro ou escuro
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sun className="w-4 h-4" />
                      <Label htmlFor="dark-mode">Modo Escuro</Label>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 border rounded-lg bg-white text-black">
                      <div className="h-6 bg-gray-100 rounded mb-2"></div>
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-200 rounded"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <Badge variant="outline" className="mt-2 text-xs">Claro</Badge>
                    </div>
                    
                    <div className="p-3 border rounded-lg bg-gray-900 text-white">
                      <div className="h-6 bg-gray-800 rounded mb-2"></div>
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-700 rounded"></div>
                        <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                      </div>
                      <Badge variant="outline" className="mt-2 text-xs border-gray-600">Escuro</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Cor Primária
                  </CardTitle>
                  <CardDescription>
                    Personalize a cor principal do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateSetting('primaryColor', color.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          settings.primaryColor === color.value
                            ? "border-primary shadow-md"
                            : "border-muted hover:border-muted-foreground"
                        }`}
                      >
                        <div 
                          className="w-full h-8 rounded-md mb-2"
                          style={{ backgroundColor: color.color }}
                        ></div>
                        <p className="text-sm font-medium">{color.label}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tamanho da Fonte */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Tamanho da Fonte
                  </CardTitle>
                  <CardDescription>
                    Ajuste o tamanho do texto para melhor legibilidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Tamanho: {settings.fontSize[0]}px</Label>
                      <Badge variant="outline">
                        {settings.fontSize[0] <= 12 ? "Pequeno" : settings.fontSize[0] <= 14 ? "Normal" : "Grande"}
                      </Badge>
                    </div>
                    <Slider
                      value={settings.fontSize}
                      onValueChange={(value) => updateSetting('fontSize', value)}
                      max={18}
                      min={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p style={{ fontSize: `${settings.fontSize[0]}px` }}>
                      Este é um exemplo de texto com o tamanho selecionado.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Idioma */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Idioma
                  </CardTitle>
                  <CardDescription>
                    Escolha o idioma da interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => updateSetting('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Interface */}
          <TabsContent value="interface" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Layout e Navegação</CardTitle>
                  <CardDescription>
                    Configure como você prefere navegar pelo sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sidebar Recolhida por Padrão</Label>
                      <p className="text-sm text-muted-foreground">Inicia com menu lateral minimizado</p>
                    </div>
                    <Switch 
                      checked={settings.sidebarCollapsed} 
                      onCheckedChange={(checked) => updateSetting('sidebarCollapsed', checked)} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo Compacto</Label>
                      <p className="text-sm text-muted-foreground">Interface mais condensada</p>
                    </div>
                    <Switch 
                      checked={settings.compactMode} 
                      onCheckedChange={(checked) => updateSetting('compactMode', checked)} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Animações</Label>
                      <p className="text-sm text-muted-foreground">Transições e efeitos visuais</p>
                    </div>
                    <Switch 
                      checked={settings.animations} 
                      onCheckedChange={(checked) => updateSetting('animations', checked)} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Exibição</CardTitle>
                  <CardDescription>
                    Personalize como as informações são apresentadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Densidade da Informação</Label>
                    <Select defaultValue="normal">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compacta">Compacta</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="confortavel">Confortável</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Formato de Data</Label>
                    <Select defaultValue="dd/mm/yyyy">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                        <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Formato de Moeda</Label>
                    <Select defaultValue="brl">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brl">Real (R$)</SelectItem>
                        <SelectItem value="usd">Dólar ($)</SelectItem>
                        <SelectItem value="eur">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Funcionalidades */}
          <TabsContent value="funcionalidades" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recursos do Sistema</CardTitle>
                  <CardDescription>
                    Ative ou desative funcionalidades conforme necessário
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Salvamento Automático</Label>
                      <p className="text-sm text-muted-foreground">Salva alterações automaticamente</p>
                    </div>
                    <Switch 
                      checked={settings.autoSave} 
                      onCheckedChange={(checked) => updateSetting('autoSave', checked)} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Chat AI Flutuante</Label>
                      <p className="text-sm text-muted-foreground">Assistente AI sempre disponível</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo Offline</Label>
                      <p className="text-sm text-muted-foreground">Funciona sem conexão com internet</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Backup Automático</Label>
                      <p className="text-sm text-muted-foreground">Backup diário dos dados</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Segurança e Privacidade</CardTitle>
                  <CardDescription>
                    Configure opções de segurança do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Timeout de Sessão</Label>
                    <Select defaultValue="30">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                        <SelectItem value="never">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-muted-foreground">Segurança adicional no login</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Log de Atividades</Label>
                      <p className="text-sm text-muted-foreground">Registra todas as ações do usuário</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Notificações */}
          <TabsContent value="notificacoes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificações do Sistema
                  </CardTitle>
                  <CardDescription>
                    Configure quando e como receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações Ativas</Label>
                      <p className="text-sm text-muted-foreground">Receber todas as notificações</p>
                    </div>
                    <Switch 
                      checked={settings.notifications} 
                      onCheckedChange={(checked) => updateSetting('notifications', checked)} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Novos Clientes</Label>
                      <p className="text-sm text-muted-foreground">Quando um novo cliente se cadastra</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Serviços Concluídos</Label>
                      <p className="text-sm text-muted-foreground">Quando um serviço é finalizado</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Vendas no PDV</Label>
                      <p className="text-sm text-muted-foreground">Para cada venda realizada</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Lembretes de Pagamento</Label>
                      <p className="text-sm text-muted-foreground">Cobranças e vencimentos</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Sons e Alertas
                  </CardTitle>
                  <CardDescription>
                    Configure efeitos sonoros e alertas visuais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Efeitos Sonoros</Label>
                      <p className="text-sm text-muted-foreground">Sons para ações e notificações</p>
                    </div>
                    <Switch 
                      checked={settings.soundEffects} 
                      onCheckedChange={(checked) => updateSetting('soundEffects', checked)} 
                    />
                  </div>
                  
                  <div>
                    <Label>Volume dos Alertas</Label>
                    <Slider defaultValue={[50]} max={100} min={0} step={10} className="mt-2" />
                  </div>
                  
                  <div>
                    <Label>Tipo de Alerta</Label>
                    <Select defaultValue="toast">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toast">Toast (Discreto)</SelectItem>
                        <SelectItem value="modal">Modal (Destaque)</SelectItem>
                        <SelectItem value="banner">Banner (Topo da Tela)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Vibração (Mobile)</Label>
                      <p className="text-sm text-muted-foreground">Vibrar em dispositivos móveis</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}