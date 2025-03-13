
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProposal, sendProposal, acceptProposal, rejectProposal, deleteProposal } from "@/services/proposalService";
import { getClient } from "@/services/clientService";
import { getSeoPack } from "@/services/packService";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  ArrowLeft,
  Edit,
  Trash,
  Send,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Building,
  Calendar,
  MailOpen,
  Package,
  Euro,
  Clock,
  AlertTriangle
} from "lucide-react";
import { format, isAfter } from "date-fns";
import { es } from "date-fns/locale";

const ProposalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Obtener la propuesta
  const { data: proposal, isLoading: isLoadingProposal } = useQuery({
    queryKey: ["proposal", id],
    queryFn: () => getProposal(id!),
    enabled: !!id
  });

  // Obtener el cliente
  const { data: client, isLoading: isLoadingClient } = useQuery({
    queryKey: ["client", proposal?.clientId],
    queryFn: () => getClient(proposal!.clientId),
    enabled: !!proposal
  });

  // Obtener el paquete
  const { data: pack, isLoading: isLoadingPack } = useQuery({
    queryKey: ["pack", proposal?.packId],
    queryFn: () => getSeoPack(proposal!.packId),
    enabled: !!proposal
  });

  // Función para comprobar si la propuesta ha expirado
  const isExpired = (proposal: any): boolean => {
    if (!proposal.expiresAt) return false;
    return isAfter(new Date(), new Date(proposal.expiresAt));
  };

  // Mutación para enviar una propuesta
  const sendProposalMutation = useMutation({
    mutationFn: () => sendProposal(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Propuesta enviada correctamente");
    },
    onError: (error) => {
      toast.error("Error al enviar la propuesta");
      console.error(error);
    }
  });

  // Mutación para aceptar una propuesta
  const acceptProposalMutation = useMutation({
    mutationFn: () => acceptProposal(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Propuesta marcada como aceptada");
    },
    onError: (error) => {
      toast.error("Error al aceptar la propuesta");
      console.error(error);
    }
  });

  // Mutación para rechazar una propuesta
  const rejectProposalMutation = useMutation({
    mutationFn: () => rejectProposal(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Propuesta marcada como rechazada");
    },
    onError: (error) => {
      toast.error("Error al rechazar la propuesta");
      console.error(error);
    }
  });

  // Mutación para eliminar una propuesta
  const deleteProposalMutation = useMutation({
    mutationFn: () => deleteProposal(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Propuesta eliminada correctamente");
      navigate("/proposals");
    },
    onError: (error) => {
      toast.error("Error al eliminar la propuesta");
      console.error(error);
    }
  });

  // Manejar el envío de la propuesta
  const handleSendProposal = () => {
    sendProposalMutation.mutate();
  };

  // Manejar la aceptación de la propuesta
  const handleAcceptProposal = () => {
    acceptProposalMutation.mutate();
  };

  // Manejar el rechazo de la propuesta
  const handleRejectProposal = () => {
    rejectProposalMutation.mutate();
  };

  // Manejar la eliminación de la propuesta
  const handleDeleteProposal = () => {
    deleteProposalMutation.mutate();
    setIsDeleteDialogOpen(false);
  };

  // Función para obtener información del estado
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "draft":
        return { 
          badge: "bg-gray-100 text-gray-800 border-gray-200", 
          icon: <FileText className="h-4 w-4" />,
          text: "Borrador" 
        };
      case "sent":
        return { 
          badge: "bg-blue-100 text-blue-800 border-blue-200", 
          icon: <Send className="h-4 w-4" />,
          text: "Enviada" 
        };
      case "accepted":
        return { 
          badge: "bg-green-100 text-green-800 border-green-200", 
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Aceptada" 
        };
      case "rejected":
        return { 
          badge: "bg-red-100 text-red-800 border-red-200", 
          icon: <XCircle className="h-4 w-4" />,
          text: "Rechazada" 
        };
      default:
        return { 
          badge: "bg-gray-100 text-gray-800", 
          icon: <FileText className="h-4 w-4" />,
          text: status 
        };
    }
  };

  // Carga de la página
  const isLoading = isLoadingProposal || isLoadingClient || isLoadingPack;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-100 rounded mb-4 max-w-md"></div>
          <div className="h-96 bg-gray-100 rounded mt-6"></div>
        </div>
      </div>
    );
  }

  if (!proposal || !client || !pack) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Propuesta no encontrada</h1>
          <p className="mb-4">La propuesta que estás buscando no existe o no está disponible.</p>
          <Button onClick={() => navigate("/proposals")} variant="outline">
            Volver a Propuestas
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(proposal.status);
  const proposalExpired = proposal.status === "sent" && isExpired(proposal);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/proposals")}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <Badge 
          variant="outline" 
          className={`font-normal gap-1 ${statusInfo.badge}`}
        >
          {statusInfo.icon}
          {statusInfo.text}
        </Badge>
        
        {proposalExpired && (
          <Badge 
            variant="outline" 
            className="font-normal gap-1 bg-amber-100 text-amber-800 border-amber-200"
          >
            <AlertTriangle className="h-4 w-4" />
            Expirada
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{proposal.title}</CardTitle>
              <CardDescription className="text-base mt-2">
                {proposal.description}
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
                      <Building className="h-4 w-4 text-gray-500" />
                      <span>{client.company || "Sin empresa"}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Detalles de la Propuesta</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Creada: {format(new Date(proposal.createdAt), "d MMMM yyyy", { locale: es })}</span>
                    </div>
                    {proposal.sentAt && (
                      <div className="flex items-center gap-2">
                        <MailOpen className="h-4 w-4 text-gray-500" />
                        <span>Enviada: {format(new Date(proposal.sentAt), "d MMMM yyyy", { locale: es })}</span>
                      </div>
                    )}
                    {proposal.expiresAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className={proposalExpired ? "text-red-600 font-medium" : ""}>
                          Expira: {format(new Date(proposal.expiresAt), "d MMMM yyyy", { locale: es })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Paquete: {pack.name}
                </h3>
                <p className="text-gray-600 mb-4">{pack.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Precio base:</span>
                    <span className="font-medium">{pack.price.toFixed(2)} €</span>
                    <span className="text-xs text-gray-500 ml-1">(IVA incluido)</span>
                  </div>
                  
                  {proposal.customPrice !== undefined && (
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 mr-2">Precio personalizado:</span>
                      <span className="font-bold text-xl text-purple-700">{proposal.customPrice.toFixed(2)} €</span>
                      <span className="text-xs text-gray-500 ml-1">(IVA incluido)</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Características incluidas:</h4>
                  <ul className="space-y-2">
                    {(proposal.customFeatures || pack.features).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div>
                {proposal.status === "draft" && (
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
                          Esta acción no se puede deshacer. Se eliminará permanentemente esta propuesta.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProposal} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              
              <div className="flex gap-2">
                {proposal.status === "draft" && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/proposals/edit/${proposal.id}`)}
                      className="gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button 
                      onClick={handleSendProposal}
                      className="gap-1"
                    >
                      <Send className="h-4 w-4" />
                      Enviar al Cliente
                    </Button>
                  </>
                )}
                
                {proposal.status === "sent" && !proposalExpired && (
                  <>
                    <Button 
                      variant="outline" 
                      className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={handleRejectProposal}
                    >
                      <XCircle className="h-4 w-4" />
                      Marcar como Rechazada
                    </Button>
                    <Button 
                      className="gap-1 bg-green-600 hover:bg-green-700"
                      onClick={handleAcceptProposal}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Marcar como Aceptada
                    </Button>
                  </>
                )}
                
                {proposalExpired && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/proposals/edit/${proposal.id}`)}
                    className="gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Renovar Propuesta
                  </Button>
                )}
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
              {client.company && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Empresa</h3>
                  <p>{client.company}</p>
                </div>
              )}
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
    </div>
  );
};

export default ProposalDetail;
