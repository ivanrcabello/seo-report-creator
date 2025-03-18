
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FilePlus, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Proposals() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching proposals for user:", user?.id, "isAdmin:", isAdmin);
        
        let query = supabase.from('proposals').select('*');
        
        // If not admin, only fetch user's proposals
        if (!isAdmin && user?.id) {
          query = query.eq('client_id', user.id);
        }
        
        const { data, error: supabaseError } = await query.order('created_at', { ascending: false });
        
        if (supabaseError) {
          console.error("Supabase error:", supabaseError);
          throw supabaseError;
        }
        
        console.log("Proposals data received:", data?.length);
        setProposals(data || []);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        setError("No se pudieron cargar las propuestas");
        toast.error("No se pudieron cargar las propuestas");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [isAdmin, user?.id]);

  const handleCreateProposal = () => {
    navigate("/proposals/new");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Propuestas</h1>
        {isAdmin && (
          <Button 
            onClick={handleCreateProposal}
            className="flex items-center gap-1"
          >
            <FilePlus className="h-4 w-4" />
            Nueva Propuesta
          </Button>
        )}
      </div>
      
      <Separator className="mb-6" />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
            <span className="text-lg">Cargando propuestas...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reintentar
          </Button>
        </div>
      ) : proposals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{proposal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {proposal.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                      proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {proposal.status === 'pending' ? 'Pendiente' :
                       proposal.status === 'approved' ? 'Aprobada' :
                       proposal.status === 'rejected' ? 'Rechazada' : 'Borrador'}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/proposals/${proposal.id}`)}
                  >
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-lg text-gray-500 mb-4">No hay propuestas disponibles</p>
          {isAdmin && (
            <Button onClick={handleCreateProposal}>
              <FilePlus className="h-4 w-4 mr-2" />
              Crear primera propuesta
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
