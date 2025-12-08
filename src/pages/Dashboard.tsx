import { useABA } from '@/contexts/ABAContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCircle, ClipboardList, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { therapists, patients, programs, sessions } = useABA();

  const activePrograms = programs.filter(p => p.status === 'active').length;
  const totalSessions = sessions.length;

  const stats = [
    {
      title: 'Terapeutas',
      value: therapists.length,
      icon: UserCircle,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      link: '/therapists',
    },
    {
      title: 'Pacientes',
      value: patients.length,
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      link: '/patients',
    },
    {
      title: 'Programas Ativos',
      value: activePrograms,
      icon: ClipboardList,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      link: '/programs',
    },
    {
      title: 'Sessões Registradas',
      value: totalSessions,
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      link: '/performance',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do sistema ABA+</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Últimos Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              {patients.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum paciente cadastrado</p>
              ) : (
                <ul className="space-y-3">
                  {patients.slice(-5).reverse().map((patient) => {
                    const therapist = therapists.find(t => t.id === patient.therapistId);
                    return (
                      <li key={patient.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {therapist ? `Terapeuta: ${therapist.name}` : 'Sem terapeuta'}
                          </p>
                        </div>
                        {patient.diagnosis && (
                          <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded">
                            {patient.diagnosis}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link 
                to="/therapists" 
                className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <UserCircle className="h-5 w-5 text-primary" />
                <span>Gerenciar Terapeutas</span>
              </Link>
              <Link 
                to="/patients" 
                className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Users className="h-5 w-5 text-secondary" />
                <span>Gerenciar Pacientes</span>
              </Link>
              <Link 
                to="/programs" 
                className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <ClipboardList className="h-5 w-5 text-accent" />
                <span>Gerenciar Programas</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}