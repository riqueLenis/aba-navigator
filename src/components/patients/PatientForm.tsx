import { useState } from 'react';
import { useABA } from '@/contexts/ABAContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Patient } from '@/types/aba';

interface PatientFormProps {
  patient?: Patient;
  onClose: () => void;
}

export function PatientForm({ patient, onClose }: PatientFormProps) {
  const { addPatient, updatePatient, therapists } = useABA();
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    dateOfBirth: patient?.dateOfBirth || '',
    guardianName: patient?.guardianName || '',
    guardianPhone: patient?.guardianPhone || '',
    therapistId: patient?.therapistId || '',
    diagnosis: patient?.diagnosis || '',
    notes: patient?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Nome do paciente é obrigatório');
      return;
    }

    if (!formData.therapistId) {
      toast.error('Selecione um terapeuta responsável');
      return;
    }

    if (patient) {
      updatePatient(patient.id, formData);
      toast.success('Paciente atualizado com sucesso!');
    } else {
      addPatient(formData);
      toast.success('Paciente cadastrado com sucesso!');
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Paciente *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Nome completo"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="therapist">Terapeuta Responsável *</Label>
        <Select
          value={formData.therapistId}
          onValueChange={(value) => setFormData(prev => ({ ...prev, therapistId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um terapeuta" />
          </SelectTrigger>
          <SelectContent>
            {therapists.map((therapist) => (
              <SelectItem key={therapist.id} value={therapist.id}>
                {therapist.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {therapists.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Cadastre um terapeuta primeiro
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="guardianName">Nome do Responsável</Label>
        <Input
          id="guardianName"
          value={formData.guardianName}
          onChange={(e) => setFormData(prev => ({ ...prev, guardianName: e.target.value }))}
          placeholder="Nome do responsável legal"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="guardianPhone">Telefone do Responsável</Label>
        <Input
          id="guardianPhone"
          value={formData.guardianPhone}
          onChange={(e) => setFormData(prev => ({ ...prev, guardianPhone: e.target.value }))}
          placeholder="(00) 00000-0000"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnóstico</Label>
        <Input
          id="diagnosis"
          value={formData.diagnosis}
          onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
          placeholder="Ex: TEA, TDAH, etc."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Informações adicionais sobre o paciente"
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          {patient ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
}