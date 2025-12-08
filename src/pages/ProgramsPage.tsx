import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function ProgramsPage() {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Programas</h1>
          <p className="text-muted-foreground mt-1">Gerencie os programas comportamentais</p>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-16 w-16 text-muted-foreground/50 mb-4" />
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