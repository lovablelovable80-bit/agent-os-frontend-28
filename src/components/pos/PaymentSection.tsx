import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Receipt,
  Percent,
  Calculator
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentSectionProps {
  subtotal: number;
  discount: number;
  total: number;
  onDiscountChange: (discount: number) => void;
  onPayment: (method: string) => void;
}

export function PaymentSection({ 
  subtotal, 
  discount, 
  total, 
  onDiscountChange, 
  onPayment 
}: PaymentSectionProps) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const { toast } = useToast();

  const paymentMethods = [
    { value: "money", label: "Dinheiro", icon: Banknote },
    { value: "credit", label: "Cartão de Crédito", icon: CreditCard },
    { value: "debit", label: "Cartão de Débito", icon: CreditCard },
    { value: "pix", label: "PIX", icon: Smartphone },
  ];

  const handlePayment = () => {
    if (!paymentMethod) {
      toast({
        title: "Erro",
        description: "Selecione uma forma de pagamento",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === "money" && !receivedAmount) {
      toast({
        title: "Erro", 
        description: "Informe o valor recebido",
        variant: "destructive"
      });
      return;
    }

    const received = paymentMethod === "money" ? parseFloat(receivedAmount) : total;
    const change = received - total;

    onPayment(paymentMethod);
    setIsPaymentOpen(false);
    
    toast({
      title: "Venda finalizada!",
      description: paymentMethod === "money" && change > 0 
        ? `Troco: R$ ${change.toFixed(2).replace('.', ',')}`
        : "Pagamento processado com sucesso",
    });

    // Reset form
    setPaymentMethod("");
    setReceivedAmount("");
  };

  const handleDiscountChange = (value: string) => {
    const discountValue = parseFloat(value) || 0;
    onDiscountChange(Math.min(discountValue, subtotal));
  };

  return (
    <div className="space-y-4 pt-4 border-t border-border/50">
      {/* Discount Section */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          <Percent className="w-3 h-3" />
          Desconto
        </Label>
        <Input
          type="number"
          placeholder="0,00"
          value={discount > 0 ? discount.toFixed(2) : ""}
          onChange={(e) => handleDiscountChange(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal:</span>
          <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Desconto:</span>
            <span className="text-destructive">-R$ {discount.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      {/* Payment Button */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full h-12 text-lg font-medium" 
            disabled={total <= 0}
          >
            <Receipt className="w-5 h-5 mr-2" />
            Finalizar Venda
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Venda</DialogTitle>
            <DialogDescription>
              Total: R$ {total.toFixed(2).replace('.', ',')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {method.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            {paymentMethod === "money" && (
              <div className="space-y-2">
                <Label>Valor Recebido</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  step="0.01"
                />
                {receivedAmount && parseFloat(receivedAmount) >= total && (
                  <div className="p-2 bg-success/10 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-success font-medium">Troco:</span>
                      <span className="text-success font-bold">
                        R$ {(parseFloat(receivedAmount) - total).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-muted/30 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Desconto:</span>
                  <span className="text-destructive">-R$ {discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            
            <Button onClick={handlePayment} className="w-full">
              <Calculator className="w-4 h-4 mr-2" />
              Confirmar Pagamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}