
import React, { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Check, Plus, Edit, Archive } from "lucide-react";
import { Navigate } from 'react-router-dom';

export default function Packages() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  
  // This page is only for admins, redirect others to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Paquetes SEO</h1>
          <p className="text-gray-500">Gestiona los paquetes y planes disponibles para ofertar a clientes</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Paquete
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="archived">Archivados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Package Card */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">Plan Básico</CardTitle>
                  <Package className="h-6 w-6 text-blue-500" />
                </div>
                <CardDescription>Servicios SEO esenciales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">€99<span className="text-sm text-gray-500">/mes</span></p>
                  <ul className="space-y-2 mt-4">
                    {['Análisis SEO básico', 'Optimización On-Page', 'Informes mensuales'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 border-t">
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="ghost" className="gap-2 text-gray-500">
                  <Archive className="h-4 w-4" />
                  Archivar
                </Button>
              </CardFooter>
            </Card>
            
            {/* Sample Package Card */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">Plan Estándar</CardTitle>
                  <Package className="h-6 w-6 text-purple-500" />
                </div>
                <CardDescription>Servicios SEO completos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">€199<span className="text-sm text-gray-500">/mes</span></p>
                  <ul className="space-y-2 mt-4">
                    {['Todo del Plan Básico', 'Link Building', 'Contenido SEO', 'Análisis de competencia'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 border-t">
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="ghost" className="gap-2 text-gray-500">
                  <Archive className="h-4 w-4" />
                  Archivar
                </Button>
              </CardFooter>
            </Card>
            
            {/* Sample Package Card */}
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">Plan Premium</CardTitle>
                  <Package className="h-6 w-6 text-amber-500" />
                </div>
                <CardDescription>Servicios SEO avanzados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">€349<span className="text-sm text-gray-500">/mes</span></p>
                  <ul className="space-y-2 mt-4">
                    {['Todo del Plan Estándar', 'SEO técnico avanzado', 'Estrategia de keywords', 'Consultoría personalizada'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 border-t">
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="ghost" className="gap-2 text-gray-500">
                  <Archive className="h-4 w-4" />
                  Archivar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="archived">
          <div className="bg-gray-50 rounded-lg p-10 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No hay paquetes archivados</h3>
            <p className="text-gray-500 mb-6">Cuando archives un paquete, aparecerá en esta sección</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
