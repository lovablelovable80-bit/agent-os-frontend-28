import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUp, 
  TrendingDown, 
  Receipt,
  Unlock,
  Lock,
  DollarSign
} from "lucide-react";

export interface CashMovement {
  id: string;
  type: 'sale' | 'opening' | 'closing' | 'supply' | 'withdraw';
  amount: number;
  description: string;
  timestamp: Date;
  paymentMethod?: string;
}

interface CashMovementsProps {
  movements: CashMovement[];
}

export function CashMovements({ movements }: CashMovementsProps) {
  const getMovementIcon = (type: CashMovement['type']) => {
    switch (type) {
      case 'sale':
        return <Receipt className="w-4 h-4 text-success" />;
      case 'opening':
        return <Unlock className="w-4 h-4 text-primary" />;
      case 'closing':
        return <Lock className="w-4 h-4 text-muted-foreground" />;
      case 'supply':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'withdraw':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getMovementBadge = (type: CashMovement['type']) => {
    switch (type) {
      case 'sale':
        return <Badge variant="default" className="text-xs">Venda</Badge>;
      case 'opening':
        return <Badge variant="outline" className="text-xs">Abertura</Badge>;
      case 'closing':
        return <Badge variant="secondary" className="text-xs">Fechamento</Badge>;
      case 'supply':
        return <Badge variant="default" className="text-xs bg-success">Suprimento</Badge>;
      case 'withdraw':
        return <Badge variant="destructive" className="text-xs">Sangria</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Movimento</Badge>;
    }
  };

  const getAmountColor = (type: CashMovement['type'], amount: number) => {
    if (type === 'withdraw' || type === 'closing') {
      return 'text-destructive';
    }
    if (type === 'sale' || type === 'supply' || type === 'opening') {
      return 'text-success';
    }
    return 'text-foreground';
  };

  const formatAmount = (type: CashMovement['type'], amount: number) => {
    const prefix = type === 'withdraw' ? '-' : '+';
    const showPrefix = type !== 'closing' && type !== 'opening';
    return `${showPrefix ? prefix : ''}R$ ${amount.toFixed(2).replace('.', ',')}`;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Movimentações do Caixa
          <Badge variant="outline" className="ml-auto">
            {movements.length} movimentos
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {movements.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-center">
              <div className="space-y-2">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">
                  Nenhuma movimentação hoje
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {movements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getMovementIcon(movement.type)}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {movement.description}
                        </span>
                        {getMovementBadge(movement.type)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {movement.timestamp.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {movement.paymentMethod && (
                          <>
                            <span>•</span>
                            <span>{movement.paymentMethod}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <span className={`font-bold ${getAmountColor(movement.type, movement.amount)}`}>
                    {formatAmount(movement.type, movement.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}