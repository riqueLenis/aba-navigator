import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useABA } from '@/contexts/ABAContext';
import { Program, ProgramCategory } from '@/types/aba';

interface ProgramFormProps {
  program?: Program;
  onClose: () => void;
}

const categoryLabels: Record<ProgramCategory, string> = {
  communication: 'Comunicação',
  motor_skills: 'Habilidades Motoras',
  social_skills: 'Habilidades Sociais',
  daily_living: 'Vida Diária',
  play: 'Brincar',
  academic: 'Acadêmico',
};

const programTemplates = [
  { name: 'Levantar a Mão', category: 'communication' as ProgramCategory, description: 'Ensinar a criança a levantar a mão para pedir atenção ou fazer perguntas' },
  { name: 'Brincar Funcional', category: 'play' as ProgramCategory, description: 'Desenvolver habilidades de brincar de forma apropriada com brinquedos' },
  { name: 'Fazer Pedidos', category: 'communication' as ProgramCategory, description: 'Ensinar a criança a fazer pedidos verbais ou através de gestos' },
  { name: 'Contato Visual', category: 'social_skills' as ProgramCategory, description: 'Desenvolver e manter contato visual durante interações' },
  { name: 'Seguir Instruções', category: 'daily_living' as ProgramCategory, description: 'Ensinar a criança a seguir instruções simples e complexas' },
  { name: 'Imitação Motora', category: 'motor_skills' as ProgramCategory, description: 'Desenvolver habilidades de imitação de movimentos' },
];

export function ProgramForm({ program, onClose }: ProgramFormProps) {
  const { patients, addProgram, updateProgram } = useABA();
  const [formData, setFormData] = useState({
    patientId: program?.patientId || '',
    name: program?.name || '',
    description: program?.description || '',
    category: program?.category || 'communication' as ProgramCategory,
    targetBehavior: program?.targetBehavior || '',
    currentCriteria: program?.currentCriteria || '80% de acertos em 3 sessões consecutivas',
    status: program?.status || 'active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (program) {
      updateProgram(program.id, formData);
    } else {
      addProgram(formData);
    }
    onClose();
  };

  const applyTemplate = (template: typeof programTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      name: template.name,
      category: template.category,
      description: template.description,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!program && (
        <div className="space-y-2">
          <Label>Modelos Rápidos</Label>
          <div className="flex flex-wrap gap-2">
            {programTemplates.map((template) => (
              <Button
                key={template.name}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyTemplate(template)}
                className="text-xs"
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="patientId">Paciente *</Label>
        <Select value={formData.patientId} onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o paciente" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome do Programa *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ProgramCategory }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetBehavior">Comportamento Alvo</Label>
        <Textarea
          id="targetBehavior"
          value={formData.targetBehavior}
          onChange={(e) => setFormData(prev => ({ ...prev, targetBehavior: e.target.value }))}
          placeholder="Descreva o comportamento esperado..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentCriteria">Critério Atual</Label>
        <Input
          id="currentCriteria"
          value={formData.currentCriteria}
          onChange={(e) => setFormData(prev => ({ ...prev, currentCriteria: e.target.value }))}
          placeholder="Ex: 80% de acertos em 3 sessões consecutivas"
        />
      </div>

      {program && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'paused' | 'completed' }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="paused">Pausado</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {program ? 'Salvar Alterações' : 'Criar Programa'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
