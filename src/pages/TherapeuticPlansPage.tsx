import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useABA } from '@/contexts/ABAContext';
import { TherapeuticPlanForm } from '@/components/plans/TherapeuticPlanForm';
import { TherapeuticPlan } from '@/types/aba';
import { Plus, FileText, Edit, Trash2, CheckCircle2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusLabels = {
  draft: 'Rascunho',
  active: 'Ativo',
  completed: 'Concluído',
};

const statusColors = {
  draft: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  active: 'bg-green-500/10 text-green-600 border-green-500/20',
  completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

export default function TherapeuticPlansPage() {
  const { therapeuticPlans, patients, deleteTherapeuticPlan, getPatientById } = useABA();
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TherapeuticPlan | undefined>();

  const handleEdit = (plan: TherapeuticPlan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este plano terapêutico?')) {
      deleteTherapeuticPlan(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Planos Terapêuticos</h1>
            <p className="text-muted-foreground mt-1">Gerencie os planos terapêuticos dos pacientes</p>
          </div>
          <Button onClick={() => { setSelectedPlan(undefined); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Plano
          </Button>
        </div>

        {therapeuticPlans.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Nenhum plano cadastrado</h3>
              <p className="text-muted-foreground text-center mt-1">
                Crie seu primeiro plano terapêutico
              </p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Plano
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {therapeuticPlans.map((plan) => {
              const patient = getPatientById(plan.patientId);
              
              return (
                <Card key={plan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{patient?.name || 'Paciente não encontrado'}</p>
                      </div>
                      <Badge variant="outline" className={statusColors[plan.status]}>
                        {statusLabels[plan.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(plan.startDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                      {plan.endDate && (
                        <>
                          <span>→</span>
                          <span>{format(new Date(plan.endDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        </>
                      )}
                    </div>

                    {plan.goals.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Metas ({plan.goals.length})</p>
                        <ul className="space-y-1">
                          {plan.goals.slice(0, 3).map((goal, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span className="text-muted-foreground line-clamp-1">{goal}</span>
                            </li>
                          ))}
                          {plan.goals.length > 3 && (
                            <li className="text-xs text-muted-foreground pl-6">
                              +{plan.goals.length - 3} mais metas...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(plan)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(plan.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPlan ? 'Editar Plano' : 'Novo Plano Terapêutico'}</DialogTitle>
            </DialogHeader>
            <TherapeuticPlanForm plan={selectedPlan} onClose={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
