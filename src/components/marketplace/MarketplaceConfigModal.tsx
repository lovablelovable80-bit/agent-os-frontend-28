import { useState } from "react";
import { Settings, Key, Globe, Save, TestTube, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface MarketplaceStatus {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  status: "active" | "error" | "pending";
}

interface MarketplaceConfigModalProps {
  marketplace: MarketplaceStatus | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MarketplaceConfigModal({ marketplace, isOpen, onClose }: MarketplaceConfigModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    apiKey: "",
    secretKey: "",
    userId: "",
    environment: "production"
  });

  const [settings, setSettings] = useState({
    autoSync: true,
    syncInventory: true,
    syncPrices: true,
    syncOrders: true,
    notifyNewOrders: true
  });

  if (!marketplace) return null;

  const handleSave = async () => {
    setIsLoading(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onClose();
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    // Simular teste de conexão
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{marketplace.icon}</span>
            <div>
              <h3 className="text-lg font-semibold">{marketplace.name}</h3>
              <p className="text-sm text-muted-foreground">Configuração da integração</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="credentials">
              <Key className="w-4 h-4 mr-2" />
              Credenciais
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="sync">
              <Globe className="w-4 h-4 mr-2" />
              Sincronização
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credentials" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={credentials.apiKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Insira sua API Key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input
                  id="secretKey"
                  type="password"
                  value={credentials.secretKey}
                  onChange={(e) => setCredentials(prev => ({ ...prev, secretKey: e.target.value }))}
                  placeholder="Insira sua Secret Key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={credentials.userId}
                  onChange={(e) => setCredentials(prev => ({ ...prev, userId: e.target.value }))}
                  placeholder="Insira seu User ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="environment">Ambiente</Label>
                <select 
                  id="environment"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={credentials.environment}
                  onChange={(e) => setCredentials(prev => ({ ...prev, environment: e.target.value }))}
                >
                  <option value="sandbox">Sandbox (Teste)</option>
                  <option value="production">Produção</option>
                </select>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleTestConnection}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Testar Conexão
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sincronização Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Sincronizar dados automaticamente a cada hora
                  </p>
                </div>
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSync: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificar Novos Pedidos</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações quando houver novos pedidos
                  </p>
                </div>
                <Switch
                  checked={settings.notifyNewOrders}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifyNewOrders: checked }))}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-sm">Dados para Sincronizar</h4>
                
                <div className="flex items-center justify-between">
                  <Label>Estoque</Label>
                  <Switch
                    checked={settings.syncInventory}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, syncInventory: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Preços</Label>
                  <Switch
                    checked={settings.syncPrices}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, syncPrices: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Pedidos</Label>
                  <Switch
                    checked={settings.syncOrders}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, syncOrders: checked }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook URL (Opcional)</Label>
                <Input
                  id="webhook"
                  placeholder="https://sua-api.com/webhook"
                />
                <p className="text-xs text-muted-foreground">
                  URL para receber notificações em tempo real
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sync" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Status da Última Sincronização
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Data:</span>
                    <p>2024-01-15 14:30:00</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="ml-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                      Sucesso
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Produtos:</span>
                    <p>1.234 sincronizados</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pedidos:</span>
                    <p>56 novos</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Ações de Sincronização</h4>
                
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start">
                    Sincronizar Produtos
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Sincronizar Estoque
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Sincronizar Preços
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Buscar Novos Pedidos
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="syncLog">Log de Sincronização</Label>
                <Textarea
                  id="syncLog"
                  className="h-32 font-mono text-xs"
                  readOnly
                  value={`[2024-01-15 14:30:01] Iniciando sincronização...
[2024-01-15 14:30:05] Conectando ao ${marketplace.name}...
[2024-01-15 14:30:08] Sincronizando produtos... (1234 itens)
[2024-01-15 14:30:45] Sincronizando estoque...
[2024-01-15 14:30:52] Sincronização concluída com sucesso!`}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}