import { useState } from 'react';
import { useABA } from '@/contexts/ABAContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { TherapistForm } from '@/components/therapists/TherapistForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, UserCircle, Mail, Phone, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { Therapist } from '@/types/aba';

export default function TherapistsPage() {
  const { therapists, deleteTherapist, patients } = useABA();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (therapist: Therapist) => {
    setEditingTherapist(therapist);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const hasPatients = patients.some(p => p.therapistId === id);
    if (hasPatients) {
      toast.error('Não é possível excluir. Existem pacientes vinculados a este terapeuta.');
      return;
    }
    deleteTherapist(id);
    setDeletingId(null);
    toast.success('Terapeuta excluído com sucesso!');
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTherapist(undefined);
  };

  const getPatientCount = (therapistId: string) => {
    return patients.filter(p => p.therapistId === therapistId).length;
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Terapeutas</h1>
            <p className="text-muted-foreground mt-1">Gerencie os profissionais da clínica</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Terapeuta
          </Button>
        </div>

        {therapists.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UserCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Nenhum terapeuta cadastrado</h3>
              <p className="text-muted-foreground text-center mt-1">
                Comece cadastrando o primeiro terapeuta do sistema
              </p>
              <Button onClick={() => setIsFormOpen(true)} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Cadastrar Terapeuta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {therapists.map((therapist) => (
              <Card key={therapist.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCircle className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{therapist.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {getPatientCount(therapist.id)} paciente(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(therapist)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(therapist.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {therapist.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{therapist.email}</span>
                    </div>
                  )}
                  {therapist.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{therapist.phone}</span>
                    </div>
                  )}
                  {therapist.specialty && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{therapist.specialty}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTherapist ? 'Editar Terapeuta' : 'Novo Terapeuta'}
              </DialogTitle>
            </DialogHeader>
            <TherapistForm therapist={editingTherapist} onClose={handleCloseForm} />
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este terapeuta? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingId && handleDelete(deletingId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}