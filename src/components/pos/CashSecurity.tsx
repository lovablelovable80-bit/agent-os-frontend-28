import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Lock, 
  AlertTriangle,
  Key,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CashSecurityProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (isAuthenticated: boolean) => void;
  action: 'open' | 'close' | 'withdraw' | 'supply';
  actionDescription: string;
}

export function CashSecurity({ 
  isOpen, 
  onClose, 
  onAuthenticate, 
  action,
  actionDescription 
}: CashSecurityProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const { toast } = useToast();

  // Senha padrão (em produção seria configurável)
  const DEFAULT_PASSWORD = "1234";
  const MAX_ATTEMPTS = 3;

  const handleAuth = () => {
    if (isBlocked) {
      toast({
        title: "Acesso Bloqueado",
        description: "Muitas tentativas incorretas. Aguarde antes de tentar novamente.",
        variant: "destructive"
      });
      return;
    }

    if (password === DEFAULT_PASSWORD) {
      onAuthenticate(true);
      setPassword("");
      setAttempts(0);
      onClose();
      
      toast({
        title: "Autenticação realizada",
        description: "Acesso autorizado com sucesso"
      });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        setTimeout(() => {
          setIsBlocked(false);
          setAttempts(0);
        }, 30000); // 30 segundos de bloqueio
        
        toast({
          title: "Acesso Bloqueado",
          description: "Muitas tentativas incorretas. Tente novamente em 30 segundos.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Senha Incorreta",
          description: `Tentativa ${newAttempts} de ${MAX_ATTEMPTS}`,
          variant: "destructive"
        });
      }
      
      setPassword("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAuth();
    }
  };

  const getSecurityLevel = () => {
    switch (action) {
      case 'open':
      case 'close':
        return 'high';
      case 'withdraw':
        return 'high';
      case 'supply':
        return 'medium';
      default:
        return 'medium';
    }
  };

  const securityLevel = getSecurityLevel();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Autenticação Necessária
          </DialogTitle>
          <DialogDescription>
            {actionDescription}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className={`border-l-4 ${
            securityLevel === 'high' 
              ? 'border-l-destructive bg-destructive/5' 
              : 'border-l-warning bg-warning/5'
          }`}>
            <AlertTriangle className={`w-4 h-4 ${
              securityLevel === 'high' ? 'text-destructive' : 'text-warning'
            }`} />
            <AlertDescription>
              {securityLevel === 'high' 
                ? 'Esta operação requer autenticação de supervisor'
                : 'Digite a senha para continuar'
              }
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="password">Senha do Supervisor</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isBlocked}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {attempts > 0 && !isBlocked && (
            <Alert className="border-l-4 border-l-warning bg-warning/5">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <AlertDescription>
                {MAX_ATTEMPTS - attempts} tentativa(s) restante(s)
              </AlertDescription>
            </Alert>
          )}

          {isBlocked && (
            <Alert className="border-l-4 border-l-destructive bg-destructive/5">
              <Lock className="w-4 h-4 text-destructive" />
              <AlertDescription>
                Acesso temporariamente bloqueado. Aguarde 30 segundos.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAuth}
              disabled={!password || isBlocked}
              className="flex-1"
            >
              <Key className="w-4 h-4 mr-2" />
              Autenticar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}