import { NavLink, useLocation } from 'react-router-dom';
import { 
  Users, 
  UserCircle, 
  ClipboardList, 
  BarChart3, 
  FileText, 
  TrendingUp,
  Home,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/therapists', icon: UserCircle, label: 'Terapeutas' },
  { to: '/patients', icon: Users, label: 'Pacientes' },
  { to: '/programs', icon: ClipboardList, label: 'Programas' },
  { to: '/performance', icon: BarChart3, label: 'Desempenho' },
  { to: '/evolution', icon: TrendingUp, label: 'Evolução' },
  { to: '/therapeutic-plans', icon: FileText, label: 'Planos Terapêuticos' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40 transform transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-display font-bold text-primary">
              ABA+
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sistema de Gestão Terapêutica
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-muted",
                    isActive 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              © 2024 ABA+ Sistema
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}