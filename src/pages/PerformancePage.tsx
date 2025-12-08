import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function PerformancePage() {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Desempenho</h1>
          <p className="text-muted-foreground mt-1">Acompanhe o desempenho dos programas</p>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Em desenvolvimento</h3>
            <p className="text-muted-foreground text-center mt-1">
              Esta funcionalidade será implementada em breve
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}