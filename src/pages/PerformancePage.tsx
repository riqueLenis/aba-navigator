import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useABA } from '@/contexts/ABAContext';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { BarChart3, TrendingUp, Target, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PerformancePage() {
  const { patients, programs, sessions, getPatientById, getProgramsByPatient, getSessionsByProgram } = useABA();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const selectedPatient = selectedPatientId ? getPatientById(selectedPatientId) : null;
  const patientPrograms = selectedPatientId ? getProgramsByPatient(selectedPatientId) : [];

  const calculateStats = (programId: string) => {
    const programSessions = getSessionsByProgram(programId);
    if (programSessions.length === 0) return null;

    const totalTrials = programSessions.reduce((acc, s) => acc + s.trials, 0);
    const totalSuccesses = programSessions.reduce((acc, s) => acc + s.successes, 0);
    const overallRate = Math.round((totalSuccesses / totalTrials) * 100);

    const sortedSessions = programSessions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const lastSession = sortedSessions[0];
    const lastRate = Math.round((lastSession.successes / lastSession.trials) * 100);

    // Calculate trend (comparing last 3 sessions average with previous 3)
    let trend = 0;
    if (sortedSessions.length >= 6) {
      const recent3 = sortedSessions.slice(0, 3);
      const previous3 = sortedSessions.slice(3, 6);
      const recentAvg = recent3.reduce((acc, s) => acc + (s.successes / s.trials), 0) / 3;
      const previousAvg = previous3.reduce((acc, s) => acc + (s.successes / s.trials), 0) / 3;
      trend = Math.round((recentAvg - previousAvg) * 100);
    }

    return {
      totalSessions: programSessions.length,
      overallRate,
      lastRate,
      lastDate: lastSession.date,
      trend,
    };
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Desempenho</h1>
          <p className="text-muted-foreground mt-1">Acompanhe o desempenho dos programas</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecione um Paciente</label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger className="w-full md:w-80">
                  <SelectValue placeholder="Escolha um paciente para ver o desempenho" />
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
              <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Selecione um paciente</h3>
              <p className="text-muted-foreground text-center mt-1">
                Escolha um paciente para visualizar os gráficos de desempenho
              </p>
            </CardContent>
          </Card>
        ) : patientPrograms.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Nenhum programa encontrado</h3>
              <p className="text-muted-foreground text-center mt-1">
                Este paciente não possui programas cadastrados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{patientPrograms.length}</p>
                      <p className="text-sm text-muted-foreground">Programas Ativos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {patientPrograms.reduce((acc, p) => acc + getSessionsByProgram(p.id).length, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total de Sessões</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {(() => {
                          const allSessions = patientPrograms.flatMap(p => getSessionsByProgram(p.id));
                          if (allSessions.length === 0) return '0%';
                          const total = allSessions.reduce((acc, s) => acc + s.trials, 0);
                          const successes = allSessions.reduce((acc, s) => acc + s.successes, 0);
                          return `${Math.round((successes / total) * 100)}%`;
                        })()}
                      </p>
                      <p className="text-sm text-muted-foreground">Taxa Média de Sucesso</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts per Program */}
            {patientPrograms.map((program) => {
              const programSessions = getSessionsByProgram(program.id);
              const stats = calculateStats(program.id);

              return (
                <Card key={program.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{program.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{program.description}</p>
                      </div>
                      <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                        {program.status === 'active' ? 'Ativo' : program.status === 'paused' ? 'Pausado' : 'Concluído'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {stats ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold">{stats.totalSessions}</p>
                            <p className="text-xs text-muted-foreground">Sessões</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold">{stats.overallRate}%</p>
                            <p className="text-xs text-muted-foreground">Taxa Geral</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold">{stats.lastRate}%</p>
                            <p className="text-xs text-muted-foreground">Última Sessão</p>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className={`text-2xl font-bold ${stats.trend > 0 ? 'text-green-600' : stats.trend < 0 ? 'text-red-600' : ''}`}>
                              {stats.trend > 0 ? '+' : ''}{stats.trend}%
                            </p>
                            <p className="text-xs text-muted-foreground">Tendência</p>
                          </div>
                        </div>
                        <PerformanceChart sessions={programSessions} programName={program.name} />
                      </div>
                    ) : (
                      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        Nenhuma sessão registrada para este programa
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
