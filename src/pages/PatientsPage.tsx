import { useState } from 'react';
import { useABA } from '@/contexts/ABAContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { PatientForm } from '@/components/patients/PatientForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Users, Calendar, UserCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Patient } from '@/types/aba';
import { format, differenceInYears, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PatientsPage() {
  const { patients, deletePatient, getTherapistById, programs } = useABA();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const hasPrograms = programs.some(p => p.patientId === id);
    if (hasPrograms) {
      toast.error('Não é possível excluir. Existem programas vinculados a este paciente.');
      return;
    }
    deletePatient(id);
    setDeletingId(null);
    toast.success('Paciente excluído com sucesso!');
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPatient(undefined);
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    return differenceInYears(new Date(), parseISO(dateOfBirth));
  };

  const getProgramCount = (patientId: string) => {
    return programs.filter(p => p.patientId === patientId).length;
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Pacientes</h1>
            <p className="text-muted-foreground mt-1">Gerencie os pacientes da clínica</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Paciente
          </Button>
        </div>

        {patients.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Nenhum paciente cadastrado</h3>
              <p className="text-muted-foreground text-center mt-1">
                Comece cadastrando o primeiro paciente do sistema
              </p>
              <Button onClick={() => setIsFormOpen(true)} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Cadastrar Paciente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => {
              const therapist = getTherapistById(patient.therapistId);
              const age = calculateAge(patient.dateOfBirth);
              
              return (
                <Card key={patient.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-secondary/30 flex items-center justify-center">
                          <Users className="h-7 w-7 text-secondary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{patient.name}</CardTitle>
                          {age !== null && (
                            <p className="text-sm text-muted-foreground">
                              {age} anos
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(patient)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(patient.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {therapist && (
                      <div className="flex items-center gap-2 text-sm">
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Terapeuta:</span>
                        <span className="font-medium">{therapist.name}</span>
                      </div>
                    )}
                    
                    {patient.diagnosis && (
                      <Badge variant="secondary" className="text-xs">
                        {patient.diagnosis}
                      </Badge>
                    )}
                    
                    {patient.dateOfBirth && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(parseISO(patient.dateOfBirth), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    )}
                    
                    {patient.guardianPhone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{patient.guardianPhone}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        {getProgramCount(patient.id)} programa(s) ativo(s)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
              </DialogTitle>
            </DialogHeader>
            <PatientForm patient={editingPatient} onClose={handleCloseForm} />
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.
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