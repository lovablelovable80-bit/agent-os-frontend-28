import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Printer, 
  Download,
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Smartphone
} from "lucide-react";
import { CashMovement } from "./CashMovements";
import { useToast } from "@/hooks/use-toast";

interface CashReportProps {
  isOpen: boolean;
  movements: CashMovement[];
  openingAmount: number;
  closingAmount: number;
  dailySales: number;
  onGenerateReport: () => void;
}

interface PaymentSummary {
  money: number;
  credit: number;
  debit: number;
  pix: number;
}

export function CashReport({ 
  isOpen, 
  movements, 
  openingAmount, 
  closingAmount, 
  dailySales,
  onGenerateReport 
}: CashReportProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { toast } = useToast();

  // Calculate payment method summary
  const paymentSummary = movements
    .filter(m => m.type === 'sale')
    .reduce((acc: PaymentSummary, movement) => {
      switch (movement.paymentMethod) {
        case 'Dinheiro':
          acc.money += movement.amount;
          break;
        case 'Cartão de Crédito':
          acc.credit += movement.amount;
          break;
        case 'Cartão de Débito':
          acc.debit += movement.amount;
          break;
        case 'PIX':
          acc.pix += movement.amount;
          break;
      }
      return acc;
    }, { money: 0, credit: 0, debit: 0, pix: 0 });

  // Calculate totals
  const totalSupplies = movements
    .filter(m => m.type === 'supply')
    .reduce((sum, m) => sum + m.amount, 0);

  const totalWithdrawals = movements
    .filter(m => m.type === 'withdraw')
    .reduce((sum, m) => sum + m.amount, 0);

  const expectedCashBalance = openingAmount + paymentSummary.money + totalSupplies - totalWithdrawals;
  const discrepancy = closingAmount - expectedCashBalance;

  const handlePrintReport = () => {
    window.print();
    toast({
      title: "Relatório enviado para impressão",
      description: "O relatório de fechamento foi enviado para a impressora"
    });
  };

  const handleExportReport = () => {
    const reportData = {
      date: new Date().toISOString(),
      openingAmount,
      closingAmount,
      dailySales,
      paymentSummary,
      totalSupplies,
      totalWithdrawals,
      expectedCashBalance,
      discrepancy,
      movements
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `relatorio-caixa-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Relatório exportado",
      description: "Os dados do caixa foram salvos em arquivo JSON"
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileText className="w-4 h-4 mr-2" />
          Relatório Detalhado
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Relatório de Fechamento de Caixa
          </DialogTitle>
          <DialogDescription>
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 p-4">
            {/* Resumo Geral */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo Geral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Abertura:</span>
                      <span className="font-medium">R$ {openingAmount.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vendas Totais:</span>
                      <span className="font-medium text-success">R$ {dailySales.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Suprimentos:</span>
                      <span className="font-medium text-success">R$ {totalSupplies.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sangrias:</span>
                      <span className="font-medium text-destructive">R$ {totalWithdrawals.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saldo Esperado:</span>
                      <span className="font-medium">R$ {expectedCashBalance.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saldo Real:</span>
                      <span className="font-bold">R$ {closingAmount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Diferença:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={discrepancy === 0 ? "default" : discrepancy > 0 ? "default" : "destructive"}>
                      {discrepancy === 0 ? "Confere" : discrepancy > 0 ? "Sobra" : "Falta"}
                    </Badge>
                    <span className={`text-lg font-bold ${
                      discrepancy === 0 ? "text-success" : 
                      discrepancy > 0 ? "text-success" : "text-destructive"
                    }`}>
                      R$ {Math.abs(discrepancy).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo por Forma de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendas por Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-success" />
                        <span>Dinheiro:</span>
                      </div>
                      <span className="font-medium">R$ {paymentSummary.money.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span>Cartão de Crédito:</span>
                      </div>
                      <span className="font-medium">R$ {paymentSummary.credit.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                        <span>Cartão de Débito:</span>
                      </div>
                      <span className="font-medium">R$ {paymentSummary.debit.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-orange-500" />
                        <span>PIX:</span>
                      </div>
                      <span className="font-medium">R$ {paymentSummary.pix.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Movimentações Detalhadas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Movimentações do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-auto">
                  {movements.map((movement) => (
                    <div key={movement.id} className="flex justify-between items-center p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {movement.timestamp.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="text-sm">{movement.description}</span>
                        {movement.paymentMethod && (
                          <Badge variant="outline" className="text-xs">
                            {movement.paymentMethod}
                          </Badge>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        movement.type === 'withdraw' ? 'text-destructive' : 'text-success'
                      }`}>
                        {movement.type === 'withdraw' ? '-' : '+'}R$ {movement.amount.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handlePrintReport} variant="outline" className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={handleExportReport} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={onGenerateReport} className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Finalizar Relatório
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}