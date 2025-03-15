
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ClipboardCheck, Clock, CircleAlert } from "lucide-react";

interface TimelineItem {
  id: string;
  task_name: string;
  status: 'completed' | 'in_progress' | 'pending';
  order_number: number;
  details?: string;
}

export function ProjectTimeline() {
  const { user } = useAuth();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTimeline = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('project_timeline')
          .select('*')
          .eq('client_id', user.id)
          .order('order_number', { ascending: true });
        
        if (error) {
          console.error("Error fetching timeline:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setTimeline(data as TimelineItem[]);
        } else {
          // Set default timeline if none exists
          setTimeline([
            {
              id: '1',
              task_name: 'Auditoría inicial',
              status: 'completed',
              order_number: 1,
              details: 'Análisis completo de la web y oportunidades de mejora'
            },
            {
              id: '2',
              task_name: 'Investigación Keywords',
              status: 'completed',
              order_number: 2,
              details: 'Identificación de palabras clave estratégicas'
            },
            {
              id: '3',
              task_name: 'Optimización técnica',
              status: 'in_progress',
              order_number: 3,
              details: 'Mejoras en velocidad, estructura y SEO on-page'
            },
            {
              id: '4',
              task_name: 'Estrategia contenidos próximos meses',
              status: 'pending',
              order_number: 4,
              details: 'Plan editorial y desarrollo de contenidos optimizados'
            }
          ]);
        }
      } catch (error) {
        console.error("Error in timeline fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeline();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
            <ClipboardCheck className="h-3 w-3" />
            Completado
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En progreso
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-gray-500 flex items-center gap-1">
            <CircleAlert className="h-3 w-3" />
            Pendiente
          </Badge>
        );
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>;
      case 'in_progress':
        return <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">⟳</div>;
      case 'pending':
        return <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">○</div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-gray-200"></div>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cronograma del proyecto</CardTitle>
          <CardDescription>Cargando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cronograma del proyecto</CardTitle>
        <CardDescription>Haz clic en cada etapa para ver detalles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div key={item.id} className="relative flex">
              <div className="mr-4">
                {getStatusIcon(item.status)}
                {index < timeline.length - 1 && (
                  <div className="absolute top-8 bottom-0 left-4 w-0.5 -ml-px bg-gray-200"></div>
                )}
              </div>
              <div className="flex-1 pt-1 pb-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{item.task_name}</h3>
                  {getStatusBadge(item.status)}
                </div>
                {item.details && (
                  <p className="mt-2 text-sm text-gray-600">{item.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
