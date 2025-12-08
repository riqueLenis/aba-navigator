import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useABA } from '@/contexts/ABAContext';
import { Program } from '@/types/aba';

interface CriteriaEvolutionFormProps {
  program: Program;
  onClose: () => void;
}

export function CriteriaEvolutionForm({ program, onClose }: CriteriaEvolutionFormProps) {
  const { addCriteriaEvolution, updateProgram } = useABA();
  const [formData, setFormData] = useState({
    newCriteria: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addCriteriaEvolution({
      programId: program.id,
      previousCriteria: program.currentCriteria,
      newCriteria: formData.newCriteria,
      changedAt: new Date().toISOString(),
      reason: formData.reason,
    });

    updateProgram(program.id, { currentCriteria: formData.newCriteria });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm font-medium">{program.name}</p>
        <p className="text-xs text-muted-foreground mt-1">Critério atual: {program.currentCriteria}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newCriteria">Novo Critério *</Label>
        <Input
          id="newCriteria"
          value={formData.newCriteria}
          onChange={(e) => setFormData(prev => ({ ...prev, newCriteria: e.target.value }))}
          placeholder="Ex: 90% de acertos em 3 sessões consecutivas"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Motivo da Alteração *</Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          placeholder="Descreva o motivo da evolução do critério..."
          rows={3}
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Registrar Evolução
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
