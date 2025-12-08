import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useABA } from '@/contexts/ABAContext';
import { Program } from '@/types/aba';

interface SessionFormProps {
  program: Program;
  onClose: () => void;
}

export function SessionForm({ program, onClose }: SessionFormProps) {
  const { therapists, addSession } = useABA();
  const [formData, setFormData] = useState({
    therapistId: '',
    date: new Date().toISOString().split('T')[0],
    trials: 10,
    successes: 0,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSession({
      ...formData,
      programId: program.id,
      patientId: program.patientId,
    });
    onClose();
  };

  const successRate = formData.trials > 0 ? Math.round((formData.successes / formData.trials) * 100) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm font-medium">{program.name}</p>
        <p className="text-xs text-muted-foreground">Critério: {program.currentCriteria}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="therapistId">Terapeuta *</Label>
        <Select value={formData.therapistId} onValueChange={(value) => setFormData(prev => ({ ...prev, therapistId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o terapeuta" />
          </SelectTrigger>
          <SelectContent>
            {therapists.map((therapist) => (
              <SelectItem key={therapist.id} value={therapist.id}>{therapist.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data da Sessão *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trials">Total de Tentativas *</Label>
          <Input
            id="trials"
            type="number"
            min="1"
            value={formData.trials}
            onChange={(e) => setFormData(prev => ({ ...prev, trials: parseInt(e.target.value) || 0 }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="successes">Acertos *</Label>
          <Input
            id="successes"
            type="number"
            min="0"
            max={formData.trials}
            value={formData.successes}
            onChange={(e) => setFormData(prev => ({ ...prev, successes: parseInt(e.target.value) || 0 }))}
            required
          />
        </div>
      </div>

      <div className="p-3 bg-primary/10 rounded-lg text-center">
        <p className="text-2xl font-bold text-primary">{successRate}%</p>
        <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Anotações sobre a sessão..."
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Registrar Sessão
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
