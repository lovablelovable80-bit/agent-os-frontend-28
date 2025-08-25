import { useState } from "react";
import { Store, Settings, ExternalLink, Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MarketplaceConfigModal } from "./MarketplaceConfigModal";

interface MarketplaceStatus {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  status: "active" | "error" | "pending";
}

const marketplaces: MarketplaceStatus[] = [
  {
    id: "mercadolivre",
    name: "Mercado Livre",
    icon: "🛒",
    connected: true,
    status: "active"
  },
  {
    id: "amazon",
    name: "Amazon",
    icon: "📦",
    connected: false,
    status: "pending"
  },
  {
    id: "shopee",
    name: "Shopee",
    icon: "🛍️",
    connected: true,
    status: "error"
  },
  {
    id: "magazineluiza",
    name: "Magazine Luiza",
    icon: "🏪",
    connected: false,
    status: "pending"
  }
];

export function MarketplaceIntegration() {
  const [selectedMarketplace, setSelectedMarketplace] = useState<MarketplaceStatus | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Check className="w-3 h-3 text-emerald-500" />;
      case "error":
        return <X className="w-3 h-3 text-destructive" />;
      case "pending":
        return <AlertCircle className="w-3 h-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (marketplace: MarketplaceStatus) => {
    if (!marketplace.connected) {
      return <Badge variant="outline" className="text-xs">Não conectado</Badge>;
    }
    
    switch (marketplace.status) {
      case "active":
        return <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Ativo</Badge>;
      case "error":
        return <Badge variant="destructive" className="text-xs">Erro</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      default:
        return null;
    }
  };

  const connectedCount = marketplaces.filter(m => m.connected).length;

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Store className="w-4 h-4" />
            {connectedCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary">
                {connectedCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b border-border">
            <h4 className="font-medium text-sm">Integrações Marketplace</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {connectedCount} de {marketplaces.length} conectados
            </p>
          </div>
          
          <div className="p-2">
            {marketplaces.map((marketplace) => (
              <div
                key={marketplace.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{marketplace.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{marketplace.name}</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(marketplace.status)}
                      {getStatusBadge(marketplace)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedMarketplace(marketplace);
                      setIsConfigModalOpen(true);
                    }}
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-border">
            <Button variant="outline" size="sm" className="w-full">
              Adicionar Nova Integração
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <MarketplaceConfigModal
        marketplace={selectedMarketplace}
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setSelectedMarketplace(null);
        }}
      />
    </>
  );
}