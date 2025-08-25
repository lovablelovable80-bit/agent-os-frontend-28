import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  Lock, 
  Unlock,
  TrendingDown,
  TrendingUp,
  Receipt,
  AlertTriangle,
  FileText,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CashSecurity } from "./CashSecurity";
import { CashReport } from "./CashReport";
import { CashMovement } from "./CashMovements";

interface CashControlProps {
  isOpen: boolean;
  onOpenCash: (initialAmount: number) => void;
  onCloseCash: () => void;
  cashBalance: number;
  dailySales: number;
  onSupplyCash: (amount: number) => void;
  onWithdrawCash: (amount: number, reason: string) => void;
  movements: CashMovement[];
  openingAmount: number;
}

export function CashControl({
  isOpen,
  onOpenCash,
  onCloseCash,
  cashBalance,
  dailySales,
  onSupplyCash,
  onWithdrawCash,
  movements,
  openingAmount
}: CashControlProps) {
  const [openAmount, setOpenAmount] = useState("");
  const [supplyAmount, setSupplyAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawReason, setWithdrawReason] = useState("");
  const [isOpenDialogOpen, setIsOpenDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [isSupplyDialogOpen, setIsSupplyDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [securityDialog, setSecurityDialog] = useState<{
    open: boolean;
    action: 'open' | 'close' | 'withdraw' | 'supply';
    description: string;
    callback: () => void;
  }>({ open: false, action: 'open', description: '', callback: () => {} });
  const { toast } = useToast();

  const handleOpenCash = () => {
    const amount = parseFloat(openAmount);
    if (isNaN(amount) || amount < 0) {
      toast({
        title: "Erro",
        description: "Valor inválido para abertura do caixa",
        variant: "destructive"
      });
      return;
    }

    onOpenCash(amount);
    setOpenAmount("");
    setIsOpenDialogOpen(false);
    
    toast({
      title: "Caixa Aberto",
      description: `Caixa aberto com R$ ${amount.toFixed(2).replace('.', ',')}`,
    });
  };

  const handleCloseCash = () => {
    onCloseCash();
    setIsCloseDialogOpen(false);
    
    toast({
      title: "Caixa Fechado",
      description: `Vendas do dia: R$ ${dailySales.toFixed(2).replace('.', ',')}`,
    });
  };

  const handleSupply = () => {
    const amount = parseFloat(supplyAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erro",
        description: "Valor inválido para suprimento",
        variant: "destructive"
      });
      return;
    }

    onSupplyCash(amount);
    setSupplyAmount("");
    setIsSupplyDialogOpen(false);
    
    toast({
      title: "Suprimento Realizado",
      description: `R$ ${amount.toFixed(2).replace('.', ',')} adicionado ao caixa`,
    });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erro",
        description: "Valor inválido para sangria",
        variant: "destructive"
      });
      return;
    }

    if (amount > cashBalance) {
      toast({
        title: "Erro",
        description: "Valor superior ao saldo disponível",
        variant: "destructive"
      });
      return;
    }

    if (!withdrawReason.trim()) {
      toast({
        title: "Erro",
        description: "Motivo da sangria é obrigatório",
        variant: "destructive"
      });
      return;
    }

    onWithdrawCash(amount, withdrawReason);
    setWithdrawAmount("");
    setWithdrawReason("");
    setIsWithdrawDialogOpen(false);
    
    toast({
      title: "Sangria Realizada",
      description: `R$ ${amount.toFixed(2).replace('.', ',')} retirado do caixa`,
    });
  };

  const requestSecurity = (action: 'open' | 'close' | 'withdraw' | 'supply', description: string, callback: () => void) => {
    setSecurityDialog({
      open: true,
      action,
      description,
      callback
    });
  };

  const handleSecurityAuth = (isAuthenticated: boolean) => {
    if (isAuthenticated) {
      securityDialog.callback();
    }
    setSecurityDialog(prev => ({ ...prev, open: false }));
  };

  const securedOpenCash = () => {
    requestSecurity('open', 'Autorizar abertura do caixa', handleOpenCash);
  };

  const securedCloseCash = () => {
    requestSecurity('close', 'Autorizar fechamento do caixa', handleCloseCash);
  };

  const securedSupply = () => {
    requestSecurity('supply', 'Autorizar suprimento do caixa', handleSupply);
  };

  const securedWithdraw = () => {
    requestSecurity('withdraw', 'Autorizar sangria do caixa', handleWithdraw);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Relatório Gerado",
      description: "Relatório de fechamento processado com sucesso"
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          {isOpen ? (
            <Unlock className="w-5 h-5 text-success" />
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
          Controle de Caixa
          <Badge variant={isOpen ? "default" : "secondary"} className="ml-auto">
            {isOpen ? "Aberto" : "Fechado"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status do Caixa */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Saldo em Caixa:</span>
            <span className="font-bold text-lg">
              R$ {cashBalance.toFixed(2).replace('.', ',')}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Vendas do Dia:</span>
            <span className="font-medium text-success">
              R$ {dailySales.toFixed(2).replace('.', ',')}
            </span>
          </div>
          
          <Separator />
        </div>

        {/* Ações do Caixa */}
        <div className="grid grid-cols-2 gap-2">
          {!isOpen ? (
            <Dialog open={isOpenDialogOpen} onOpenChange={setIsOpenDialogOpen}>
              <DialogTrigger asChild>
                <Button className="col-span-2">
                  <Unlock className="w-4 h-4 mr-2" />
                  Abrir Caixa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Abrir Caixa</DialogTitle>
                  <DialogDescription>
                    Informe o valor inicial para abertura do caixa
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Valor Inicial</Label>
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={openAmount}
                      onChange={(e) => setOpenAmount(e.target.value)}
                      step="0.01"
                    />
                  </div>
                  <Button onClick={handleOpenCash} className="w-full">
                    Confirmar Abertura
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <>
              <Dialog open={isSupplyDialogOpen} onOpenChange={setIsSupplyDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Suprimento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Suprimento de Caixa</DialogTitle>
                    <DialogDescription>
                      Adicionar dinheiro ao caixa
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Valor</Label>
                      <Input
                        type="number"
                        placeholder="0,00"
                        value={supplyAmount}
                        onChange={(e) => setSupplyAmount(e.target.value)}
                        step="0.01"
                      />
                    </div>
                    <Button onClick={handleSupply} className="w-full">
                      Confirmar Suprimento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Sangria
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sangria de Caixa</DialogTitle>
                    <DialogDescription>
                      Retirar dinheiro do caixa
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Valor</Label>
                      <Input
                        type="number"
                        placeholder="0,00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Motivo</Label>
                      <Input
                        placeholder="Ex: Pagamento de fornecedor"
                        value={withdrawReason}
                        onChange={(e) => setWithdrawReason(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleWithdraw} className="w-full" variant="destructive">
                      Confirmar Sangria
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="col-span-2 mt-2">
                    <Lock className="w-4 h-4 mr-2" />
                    Fechar Caixa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Fechar Caixa</DialogTitle>
                    <DialogDescription>
                      Confirme o fechamento do caixa
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Saldo Final:</span>
                        <span className="font-bold">R$ {cashBalance.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vendas do Dia:</span>
                        <span className="text-success">R$ {dailySales.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="text-sm text-warning">
                        Esta ação não pode ser desfeita
                      </span>
                    </div>
                    
                    <Button onClick={handleCloseCash} variant="destructive" className="w-full">
                      <Receipt className="w-4 h-4 mr-2" />
                      Confirmar Fechamento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        {/* Relatório e Segurança */}
        {isOpen && (
          <>
            <Separator />
            <div className="space-y-2">
              <CashReport
                isOpen={isOpen}
                movements={movements}
                openingAmount={openingAmount}
                closingAmount={cashBalance}
                dailySales={dailySales}
                onGenerateReport={handleGenerateReport}
              />
              
              {cashBalance > 1000 && (
                <Alert className="border-l-4 border-l-warning bg-warning/5">
                  <Shield className="w-4 h-4 text-warning" />
                  <AlertDescription className="text-xs">
                    Saldo alto detectado. Considere fazer uma sangria por segurança.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        )}
      </CardContent>

      {/* Componente de Segurança */}
      <CashSecurity
        isOpen={securityDialog.open}
        onClose={() => setSecurityDialog(prev => ({ ...prev, open: false }))}
        onAuthenticate={handleSecurityAuth}
        action={securityDialog.action}
        actionDescription={securityDialog.description}
      />
    </Card>
  );
}