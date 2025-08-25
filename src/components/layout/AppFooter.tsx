export function AppFooter() {
  return (
    <footer className="border-t border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <p>© 2024 AGENT OS. Todos os direitos reservados.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span>Versão 1.0.0</span>
          <span>•</span>
          <a 
            href="#" 
            className="hover:text-foreground transition-colors"
          >
            Suporte
          </a>
          <span>•</span>
          <a 
            href="#" 
            className="hover:text-foreground transition-colors"
          >
            Documentação
          </a>
        </div>
      </div>
    </footer>
  );
}