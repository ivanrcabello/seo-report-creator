
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ClientDocument } from "@/types/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export function DocumentCenter() {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Only fetch documents for the current client
        const { data, error } = await supabase
          .from('client_documents')
          .select('*')
          .eq('client_id', user.id)
          .limit(5);
        
        if (error) {
          console.error("Error fetching documents:", error);
          return;
        }
        
        // Map database fields to client type fields
        const mappedDocuments: ClientDocument[] = data ? data.map(doc => ({
          id: doc.id,
          clientId: doc.client_id,
          name: doc.name,
          type: doc.type as "pdf" | "doc" | "image" | "text",
          url: doc.url,
          uploadDate: doc.upload_date,
          analyzedStatus: doc.analyzed_status as "pending" | "analyzed" | "processed" | "error" | "failed",
          content: doc.content
        })) : [];
        
        setDocuments(mappedDocuments);
      } catch (error) {
        console.error("Exception fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mis Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Mis Documentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No hay documentos disponibles</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {doc.url && (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:inline-block">Ver</span>
                      </Button>
                    </a>
                  )}
                  {doc.url && (
                    <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only sm:inline-block">Descargar</span>
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))}
            <div className="text-center pt-4">
              <Link to={`/clients/${user?.id}?tab=documents`}>
                <Button variant="secondary">Ver todos los documentos</Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
