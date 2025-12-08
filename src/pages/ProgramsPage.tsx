import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useABA } from '@/contexts/ABAContext';
import { ProgramForm } from '@/components/programs/ProgramForm';
import { SessionForm } from '@/components/programs/SessionForm';
import { Program, ProgramCategory } from '@/types/aba';
import { Plus, ClipboardList, Play, Edit, Trash2, PlayCircle } from 'lucide-react';

const categoryLabels: Record<ProgramCategory, string> = {
  communication: 'Comunicação',
  motor_skills: 'Habilidades Motoras',
  social_skills: 'Habilidades Sociais',
  daily_living: 'Vida Diária',
  play: 'Brincar',
  academic: 'Acadêmico',
};

const statusLabels = {
  active: 'Ativo',
  paused: 'Pausado',
  completed: 'Concluído',
};

const statusColors = {
  active: 'bg-green-500/10 text-green-600 border-green-500/20',
  paused: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

export default function ProgramsPage() {
  const { programs, patients, sessions, deleteProgram, getPatientById, getSessionsByProgram } = useABA();
  const [showForm, setShowForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | undefined>();

  const handleEdit = (program: Program) => {
    setSelectedProgram(program);
    setShowForm(true);
  };

  const handleNewSession = (program: Program) => {
    setSelectedProgram(program);
    setShowSessionForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este programa?')) {
      deleteProgram(id);
    }
  };

  const getLastSessionRate = (programId: string) => {
    const programSessions = getSessionsByProgram(programId);
    if (programSessions.length === 0) return null;
    const lastSession = programSessions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    return Math.round((lastSession.successes / lastSession.trials) * 100);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Programas</h1>
            <p className="text-muted-foreground mt-1">Gerencie os programas comportamentais</p>
          </div>
          <Button onClick={() => { setSelectedProgram(undefined); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Programa
          </Button>
        </div>

        {programs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Nenhum programa cadastrado</h3>
              <p className="text-muted-foreground text-center mt-1">
                Crie seu primeiro programa comportamental
              </p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Programa
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => {
              const patient = getPatientById(program.patientId);
              const sessionCount = getSessionsByProgram(program.id).length;
              const lastRate = getLastSessionRate(program.id);
              
              return (
                <Card key={program.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{patient?.name || 'Paciente não encontrado'}</p>
                      </div>
                      <Badge variant="outline" className={statusColors[program.status]}>
                        {statusLabels[program.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{categoryLabels[program.category]}</Badge>
                      <span className="text-xs text-muted-foreground">{sessionCount} sessões</span>
                    </div>
                    
                    {program.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Critério:</span> {program.currentCriteria}
                    </div>

                    {lastRate !== null && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Última sessão:</span>
                        <Badge variant={lastRate >= 80 ? "default" : "secondary"}>
                          {lastRate}%
                        </Badge>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleNewSession(program)}
                      >
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Nova Sessão
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(program)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(program.id)}>
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
              <DialogTitle>{selectedProgram ? 'Editar Programa' : 'Novo Programa'}</DialogTitle>
            </DialogHeader>
            <ProgramForm program={selectedProgram} onClose={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={showSessionForm} onOpenChange={setShowSessionForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Sessão</DialogTitle>
            </DialogHeader>
            {selectedProgram && (
              <SessionForm program={selectedProgram} onClose={() => setShowSessionForm(false)} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
