import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2 } from "lucide-react";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { CartItem } from "@/components/pos/CartItem";
import { PaymentSection } from "@/components/pos/PaymentSection";
import { SearchBar } from "@/components/pos/SearchBar";
import { CashControl } from "@/components/pos/CashControl";
import { CashMovements, CashMovement } from "@/components/pos/CashMovements";
import { useToast } from "@/hooks/use-toast";

// Mock data para produtos/serviços
const mockProducts = [
  { id: 1, name: "Troca de Tela", category: "Serviços", price: 250.00, stock: 999 },
  { id: 2, name: "Troca de Bateria", category: "Serviços", price: 120.00, stock: 999 },
  { id: 3, name: "Limpeza Interna", category: "Serviços", price: 80.00, stock: 999 },
  { id: 4, name: "Película Comum", category: "Produtos", price: 25.00, stock: 15 },
  { id: 5, name: "Película Premium", category: "Produtos", price: 45.00, stock: 8 },
  { id: 6, name: "Capinha Silicone", category: "Produtos", price: 35.00, stock: 12 },
  { id: 7, name: "Carregador Original", category: "Produtos", price: 80.00, stock: 6 },
  { id: 8, name: "Fone Bluetooth", category: "Produtos", price: 150.00, stock: 4 },
];

interface CartItemData {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function POS() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItemData[]>([]);
  const [discount, setDiscount] = useState(0);
  
  // Cash control states
  const [isCashOpen, setIsCashOpen] = useState(false);
  const [cashBalance, setCashBalance] = useState(0);
  const [dailySales, setDailySales] = useState(0);
  const [cashMovements, setCashMovements] = useState<CashMovement[]>([]);
  const [openingAmount, setOpeningAmount] = useState(0);
  
  const { toast } = useToast();

  const categories = [...new Set(mockProducts.map(p => p.category))];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategory || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: typeof mockProducts[0]) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1 
      }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  // Cash control functions
  const handleOpenCash = (initialAmount: number) => {
    setIsCashOpen(true);
    setCashBalance(initialAmount);
    setOpeningAmount(initialAmount);
    setDailySales(0);
    
    const movement: CashMovement = {
      id: Date.now().toString(),
      type: 'opening',
      amount: initialAmount,
      description: 'Abertura do caixa',
      timestamp: new Date()
    };
    
    setCashMovements([movement]);
  };

  const handleCloseCash = () => {
    setIsCashOpen(false);
    
    const movement: CashMovement = {
      id: Date.now().toString(),
      type: 'closing',
      amount: cashBalance,
      description: 'Fechamento do caixa',
      timestamp: new Date()
    };
    
    setCashMovements(prev => [...prev, movement]);
  };

  const handleSupplyCash = (amount: number) => {
    setCashBalance(prev => prev + amount);
    
    const movement: CashMovement = {
      id: Date.now().toString(),
      type: 'supply',
      amount,
      description: 'Suprimento de caixa',
      timestamp: new Date()
    };
    
    setCashMovements(prev => [...prev, movement]);
  };

  const handleWithdrawCash = (amount: number, reason: string) => {
    setCashBalance(prev => prev - amount);
    
    const movement: CashMovement = {
      id: Date.now().toString(),
      type: 'withdraw',
      amount,
      description: `Sangria: ${reason}`,
      timestamp: new Date()
    };
    
    setCashMovements(prev => [...prev, movement]);
  };

  const handlePayment = (method: string) => {
    if (!isCashOpen) {
      toast({
        title: "Erro",
        description: "Caixa fechado! Abra o caixa para realizar vendas.",
        variant: "destructive"
      });
      return;
    }

    // Add to daily sales and cash balance (only for cash payments)
    const saleAmount = total;
    setDailySales(prev => prev + saleAmount);
    
    if (method === "money") {
      setCashBalance(prev => prev + saleAmount);
    }
    
    // Record the sale movement
    const paymentMethodLabels: Record<string, string> = {
      money: "Dinheiro",
      credit: "Cartão de Crédito", 
      debit: "Cartão de Débito",
      pix: "PIX"
    };
    
    const movement: CashMovement = {
      id: Date.now().toString(),
      type: 'sale',
      amount: saleAmount,
      description: `Venda #${Date.now().toString().slice(-6)}`,
      timestamp: new Date(),
      paymentMethod: paymentMethodLabels[method] || method
    };
    
    setCashMovements(prev => [...prev, movement]);
    
    // Reset cart and discount after payment
    setCart([]);
    setDiscount(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);

  return (
    <PageContainer className="p-4">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
        {/* Produtos */}
        <div className="xl:col-span-2 space-y-4">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categories={categories}
          />

          <ProductGrid
            products={filteredProducts}
            onAddToCart={addToCart}
          />
        </div>

        {/* Carrinho */}
        <div className="space-y-4">
          <Card className="h-full flex flex-col shadow-lg border-2">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Carrinho
                {cart.length > 0 && (
                  <Badge className="ml-auto bg-primary">{cart.length}</Badge>
                )}
              </CardTitle>
              {cart.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="w-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Carrinho
                </Button>
              )}
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-4">
              {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="space-y-4">
                    <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Carrinho vazio
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Adicione produtos para começar
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Itens do Carrinho */}
                  <div className="flex-1 space-y-4 overflow-auto max-h-[40vh] pr-2">
                    {cart.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </div>

                  {/* Totais e Pagamento */}
                  <PaymentSection
                    subtotal={subtotal}
                    discount={discount}
                    total={total}
                    onDiscountChange={setDiscount}
                    onPayment={handlePayment}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Controle de Caixa */}
        <div className="space-y-4">
          <CashControl
            isOpen={isCashOpen}
            onOpenCash={handleOpenCash}
            onCloseCash={handleCloseCash}
            cashBalance={cashBalance}
            dailySales={dailySales}
            onSupplyCash={handleSupplyCash}
            onWithdrawCash={handleWithdrawCash}
            movements={cashMovements}
            openingAmount={openingAmount}
          />
          
          <CashMovements movements={cashMovements} />
        </div>
      </div>
    </PageContainer>
  );
}