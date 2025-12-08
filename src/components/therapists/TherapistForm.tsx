import { useState } from 'react';
import { useABA } from '@/contexts/ABAContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Therapist } from '@/types/aba';

interface TherapistFormProps {
  therapist?: Therapist;
  onClose: () => void;
}

export function TherapistForm({ therapist, onClose }: TherapistFormProps) {
  const { addTherapist, updateTherapist } = useABA();
  const [formData, setFormData] = useState({
    name: therapist?.name || '',
    email: therapist?.email || '',
    phone: therapist?.phone || '',
    specialty: therapist?.specialty || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (therapist) {
      updateTherapist(therapist.id, formData);
      toast.success('Terapeuta atualizado com sucesso!');
    } else {
      addTherapist(formData);
      toast.success('Terapeuta cadastrado com sucesso!');
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Nome completo"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="email@exemplo.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="(00) 00000-0000"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialty">Especialidade</Label>
        <Input
          id="specialty"
          value={formData.specialty}
          onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
          placeholder="Ex: TEA, TDAH, etc."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          {therapist ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
}