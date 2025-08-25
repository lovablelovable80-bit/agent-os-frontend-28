import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[calc(100vh-16rem)] overflow-auto">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="hover:shadow-md transition-all duration-smooth cursor-pointer group"
          onClick={() => onAddToCart(product)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      product.category === "Serviços" 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : "bg-accent/10 text-accent border-accent/20"
                    }`}
                  >
                    {product.category}
                  </Badge>
                </div>
                <Badge 
                  variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {product.stock > 999 ? "∞" : product.stock}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-primary mt-1">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
              
              <Button 
                size="sm" 
                className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {products.length === 0 && (
        <div className="col-span-full flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <Package className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <p className="text-muted-foreground font-medium">
                Nenhum produto encontrado
              </p>
              <p className="text-xs text-muted-foreground">
                Tente ajustar os filtros ou termo de busca
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}