import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Session } from '@/types/aba';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PerformanceChartProps {
  sessions: Session[];
  programName: string;
}

export function PerformanceChart({ sessions, programName }: PerformanceChartProps) {
  const chartData = sessions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(session => ({
      date: format(new Date(session.date), 'dd/MM', { locale: ptBR }),
      successRate: Math.round((session.successes / session.trials) * 100),
      trials: session.trials,
      successes: session.successes,
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Nenhuma sessão registrada
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            domain={[0, 100]} 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: number, name: string) => {
              if (name === 'successRate') return [`${value}%`, 'Taxa de Sucesso'];
              return [value, name];
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="successRate" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
            activeDot={{ r: 8 }}
            name="Taxa de Sucesso"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
