import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModernCard, ModernSection } from "@/components/mobile/ModernCard";
import { ModernList, ModernListItem } from "@/components/mobile/ModernListItem";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNativeApp, usePlatformConfig } from "@/hooks/useNativeApp";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Upload,
  Smartphone,
  Settings2,
  Lock,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Clock,
  Database,
  Wifi,
  Battery,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronRight,
  Info,
  HelpCircle,
  LogOut,
  Trash2
} from "lucide-react";

const settingsCategories = [
  {
    title: "Conta e Perfil",
    icon: User,
    items: [
      { 
        id: "profile", 
        label: "Informações Pessoais", 
        description: "Nome, email, telefone", 
        icon: User,
        rightContent: "João Silva",
        action: "navigate",
        path: "/settings/profile"
      },
      { 
        id: "company", 
        label: "Dados da Empresa", 
        description: "CNPJ, endereço, contatos", 
        icon: Building,
        rightContent: "Tech Repair Store",
        action: "navigate",
        path: "/settings/company"
      },
      { 
        id: "security", 
        label: "Segurança", 
        description: "Senha, autenticação", 
        icon: Shield,
        rightContent: <Badge variant="outline">Ativa</Badge>,
        action: "navigate",
        path: "/settings/security"
      }
    ]
  },
  {
    title: "Notificações",
    icon: Bell,
    items: [
      { 
        id: "email-notifications", 
        label: "E-mail", 
        description: "Novas ordens, lembretes", 
        icon: Mail,
        rightContent: <Switch checked={true} />,
        action: "toggle"
      },
      { 
        id: "push-notifications", 
        label: "Push", 
        description: "Notificações em tempo real", 
        icon: Bell,
        rightContent: <Switch checked={true} />,
        action: "toggle"
      },
      { 
        id: "sms-notifications", 
        label: "SMS", 
        description: "Mensagens importantes", 
        icon: Phone,
        rightContent: <Switch checked={false} />,
        action: "toggle"
      },
      { 
        id: "sound", 
        label: "Som", 
        description: "Alertas sonoros", 
        icon: Volume2,
        rightContent: <Switch checked={true} />,
        action: "toggle"
      }
    ]
  },
  {
    title: "Aparência",
    icon: Palette,
    items: [
      { 
        id: "theme", 
        label: "Tema", 
        description: "Claro, escuro ou automático", 
        icon: Moon,
        rightContent: "Escuro",
        action: "navigate",
        path: "/settings/theme"
      },
      { 
        id: "language", 
        label: "Idioma", 
        description: "Português (Brasil)", 
        icon: Globe,
        rightContent: "PT-BR",
        action: "navigate",
        path: "/settings/language"
      }
    ]
  },
  {
    title: "Sistema",
    icon: Settings2,
    items: [
      { 
        id: "backup", 
        label: "Backup", 
        description: "Backup automático ativo", 
        icon: Database,
        rightContent: <Badge variant="default">Ativo</Badge>,
        action: "navigate",
        path: "/settings/backup"
      },
      { 
        id: "sync", 
        label: "Sincronização", 
        description: "Sincronizar dados", 
        icon: Wifi,
        rightContent: "Agora",
        action: "sync"
      },
      { 
        id: "storage", 
        label: "Armazenamento", 
        description: "512 MB usados de 2 GB", 
        icon: Database,
        rightContent: "25%",
        action: "navigate",
        path: "/settings/storage"
      }
    ]
  }
];

const supportItems = [
  {
    id: "help",
    label: "Central de Ajuda",
    description: "Tutoriais e FAQ",
    icon: HelpCircle,
    action: "navigate",
    path: "/help"
  },
  {
    id: "contact",
    label: "Contatar Suporte",
    description: "Fale conosco",
    icon: Mail,
    action: "contact"
  },
  {
    id: "about",
    label: "Sobre o App",
    description: "Versão 1.0.0",
    icon: Info,
    action: "navigate",
    path: "/about"
  }
];

export default function SettingsMobile() {
  const navigate = useNavigate();
  const { isNativeApp } = useNativeApp();
  const config = usePlatformConfig();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    sound: true
  });

  const handleSettingAction = (action: string, item: any) => {
    switch (action) {
      case "navigate":
        if (item.path) {
          navigate(item.path);
        }
        break;
      case "toggle":
        if (item.id.includes("notifications") || item.id === "sound") {
          const key = item.id.replace("-notifications", "").replace("-", "");
          setNotifications(prev => ({
            ...prev,
            [key]: !prev[key as keyof typeof prev]
          }));
          toast({
            title: "Configuração alterada",
            description: `${item.label} ${notifications[key as keyof typeof notifications] ? "desativado" : "ativado"}`,
          });
        }
        break;
      case "sync":
        toast({
          title: "Sincronizando",
          description: "Dados sincronizados com sucesso",
        });
        break;
      case "contact":
        window.open("mailto:suporte@agenteos.com", "_blank");
        break;
      default:
        toast({
          title: "Funcionalidade",
          description: "Em desenvolvimento",
        });
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logout",
      description: "Você foi desconectado",
      variant: "destructive"
    });
    // Implementar logout real aqui
  };

  return (
    <div className={config.containerPadding}>
      <div className="space-y-mobile">
        {/* Profile Header */}
        <ModernSection title="Minha Conta" icon={User}>
          <ModernCard variant="elevated">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg">JS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-mobile-lg font-semibold">João Silva</h3>
                <p className="text-mobile-sm text-muted-foreground">joao@empresa.com</p>
                <Badge variant="default" className="mt-2">Plano Premium</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/settings/profile")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </ModernCard>
        </ModernSection>

        {/* Settings Categories */}
        {settingsCategories.map((category) => {
          const CategoryIcon = category.icon;
          
          return (
            <ModernSection key={category.title} title={category.title} icon={CategoryIcon}>
              <ModernList variant="card">
                {category.items.map((item) => {
                  const ItemIcon = item.icon;
                  
                  return (
                    <ModernListItem
                      key={item.id}
                      title={item.label}
                      subtitle={item.description}
                      icon={ItemIcon}
                      onPress={() => handleSettingAction(item.action, item)}
                      rightContent={
                        <div className="flex items-center gap-2">
                          {item.rightContent}
                          {item.action === "navigate" && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      }
                    />
                  );
                })}
              </ModernList>
            </ModernSection>
          );
        })}

        {/* Native App Specific Settings */}
        {isNativeApp && (
          <ModernSection title="Configurações do App" icon={Smartphone}>
            <ModernList variant="card">
              <ModernListItem
                title="Modo Offline"
                subtitle="Trabalhar sem conexão"
                icon={Wifi}
                rightContent={<Switch checked={false} />}
                onPress={() => toast({ title: "Funcionalidade", description: "Em desenvolvimento" })}
              />
              <ModernListItem
                title="Economia de Bateria"
                subtitle="Reduzir consumo de energia"
                icon={Battery}
                rightContent={<Switch checked={true} />}
                onPress={() => toast({ title: "Funcionalidade", description: "Em desenvolvimento" })}
              />
            </ModernList>
          </ModernSection>
        )}

        {/* Support & Help */}
        <ModernSection title="Suporte" icon={HelpCircle}>
          <ModernList variant="card">
            {supportItems.map((item) => {
              const ItemIcon = item.icon;
              
              return (
                <ModernListItem
                  key={item.id}
                  title={item.label}
                  subtitle={item.description}
                  icon={ItemIcon}
                  onPress={() => handleSettingAction(item.action, item)}
                  rightContent={<ChevronRight className="w-4 h-4 text-muted-foreground" />}
                />
              );
            })}
          </ModernList>
        </ModernSection>

        {/* Quick Actions */}
        <ModernSection title="Ações">
          <div className="grid grid-cols-2 gap-mobile">
            <Button
              onClick={() => navigate("/settings/export")}
              variant="outline"
              className="h-16 flex-col gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="text-mobile-xs">Exportar Dados</span>
            </Button>
            <Button
              onClick={() => navigate("/settings/import")}
              variant="outline"
              className="h-16 flex-col gap-2"
            >
              <Upload className="w-5 h-5" />
              <span className="text-mobile-xs">Importar Dados</span>
            </Button>
          </div>
        </ModernSection>

        {/* Danger Zone */}
        <ModernSection title="Zona de Perigo">
          <ModernList variant="card">
            <ModernListItem
              title="Sair da Conta"
              subtitle="Fazer logout do aplicativo"
              icon={LogOut}
              onPress={handleLogout}
              rightContent={<ChevronRight className="w-4 h-4 text-destructive" />}
              className="text-destructive"
            />
            <ModernListItem
              title="Excluir Conta"
              subtitle="Remover permanentemente"
              icon={Trash2}
              onPress={() => toast({ title: "Funcionalidade", description: "Contate o suporte para exclusão de conta" })}
              rightContent={<ChevronRight className="w-4 h-4 text-destructive" />}
              className="text-destructive"
            />
          </ModernList>
        </ModernSection>

        {/* App Version Info */}
        <ModernCard variant="glass" className="text-center">
          <div className="text-mobile-sm text-muted-foreground">
            Agent OS ERP Mobile
          </div>
          <div className="text-mobile-xs text-muted-foreground mt-1">
            Versão 1.0.0 • Build 2024.01.20
          </div>
          {isNativeApp && (
            <div className="text-mobile-xs text-muted-foreground mt-1">
              Modo Nativo • {config.platform}
            </div>
          )}
        </ModernCard>
      </div>
    </div>
  );
}