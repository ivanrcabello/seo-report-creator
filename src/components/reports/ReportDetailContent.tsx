
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ClientReport } from "@/types/client";
import { Client } from "@/types/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileText, User, Calendar, Link as LinkIcon, Edit, Trash } from "lucide-react";

interface ReportDetailContentProps {
  report: ClientReport;
  client: Client;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (value: boolean) => void;
  handleDeleteReport: () => void;
}

export const ReportDetailContent = ({
  report,
  client,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteReport,
}: ReportDetailContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{report.title}</CardTitle>
            <CardDescription className="text-base mt-2">
              Informe de {report.type} para {client.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Detalles del Cliente</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{client.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{format(new Date(report.date), "d MMMM yyyy", { locale: es })}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Información del Informe</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>Tipo: {report.type}</span>
                  </div>
                  {report.url && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-gray-500" />
                      <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Ver Documento
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Notas Adicionales</h3>
              <p className="text-gray-600">{report.notes || "No hay notas adicionales para este informe."}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <div>
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-1 text-destructive border-destructive hover:bg-destructive/10">
                    <Trash className="h-4 w-4" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente este informe.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteReport} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/reports/edit/${report.id}`)} className="gap-1">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
              <p className="font-medium">{client.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p>{client.email}</p>
            </div>
            {client.phone && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                <p>{client.phone}</p>
              </div>
            )}
            <div className="pt-2">
              <Link to={`/clients/${client.id}`}>
                <Button variant="outline" className="w-full">
                  Ver Perfil del Cliente
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
