import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useABA } from '@/contexts/ABAContext';
import { CriteriaEvolutionForm } from '@/components/evolution/CriteriaEvolutionForm';
import { Program } from '@/types/aba';
import { TrendingUp, ArrowRight, Plus, History } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EvolutionPage() {
  const { patients, programs, criteriaEvolutions, getPatientById, getProgramsByPatient } = useABA();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | undefined>();

  const patientPrograms = selectedPatientId ? getProgramsByPatient(selectedPatientId) : [];

  const getEvolutionsForProgram = (programId: string) => {
    return criteriaEvolutions
      .filter(e => e.programId === programId)
      .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
  };

  const handleEvolve = (program: Program) => {
    setSelectedProgram(program);
    setShowForm(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Evolução de Critério</h1>
          <p className="text-muted-foreground mt-1">Acompanhe a evolução dos critérios dos programas</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecione um Paciente</label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger className="w-full md:w-80">
                  <SelectValue placeholder="Escolha um paciente para ver as evoluções" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {!selectedPatientId ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Selecione um paciente</h3>
              <p className="text-muted-foreground text-center mt-1">
                Escolha um paciente para visualizar as evoluções de critério
              </p>
            </CardContent>
          </Card>
        ) : patientPrograms.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Nenhum programa encontrado</h3>
              <p className="text-muted-foreground text-center mt-1">
                Este paciente não possui programas cadastrados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {patientPrograms.map((program) => {
              const evolutions = getEvolutionsForProgram(program.id);

              return (
                <Card key={program.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Critério atual: <span className="font-medium text-foreground">{program.currentCriteria}</span>
                        </p>
                      </div>
                      <Button size="sm" onClick={() => handleEvolve(program)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Evoluir Critério
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {evolutions.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma evolução registrada</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <History className="h-4 w-4" />
                          Histórico de Evoluções ({evolutions.length})
                        </p>
                        <div className="space-y-2">
                          {evolutions.map((evolution, index) => (
                            <div key={evolution.id} className="p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-2 text-sm mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {format(new Date(evolution.changedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground line-through">{evolution.previousCriteria}</span>
                                <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                                <span className="font-medium text-primary">{evolution.newCriteria}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                <span className="font-medium">Motivo:</span> {evolution.reason}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Evoluir Critério</DialogTitle>
            </DialogHeader>
            {selectedProgram && (
              <CriteriaEvolutionForm program={selectedProgram} onClose={() => setShowForm(false)} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
