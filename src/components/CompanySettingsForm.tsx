
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CompanySettings } from "@/types/client";
import { getCompanySettings, updateCompanySettings, uploadCompanyLogo } from "@/services/settingsService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Building, Upload, Save, PaintBucket } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Schema de validación para los datos de la empresa
const companySettingsSchema = z.object({
  companyName: z.string().min(2, "El nombre es demasiado corto").max(100, "El nombre es demasiado largo"),
  taxId: z.string().min(5, "El CIF/NIF no es válido").max(20, "El CIF/NIF no es válido"),
  address: z.string().min(5, "La dirección es demasiado corta"),
  phone: z.string().optional(),
  email: z.string().email("El email no es válido").optional(),
  // Campos para estilos de documentos
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
});

type FormValues = z.infer<typeof companySettingsSchema>;

export const CompanySettingsForm = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const form = useForm<FormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      companyName: "",
      taxId: "",
      address: "",
      phone: "",
      email: "",
      primaryColor: "#1e40af", // Azul corporativo por defecto
      secondaryColor: "#7e22ce", // Morado corporativo por defecto
      accentColor: "#f3f4f6", // Gris claro por defecto
    },
  });

  // Cargar datos actuales de la empresa
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await getCompanySettings();
        if (data) {
          setSettings(data);
          form.reset({
            companyName: data.companyName,
            taxId: data.taxId,
            address: data.address,
            phone: data.phone || "",
            email: data.email || "",
            primaryColor: data.primaryColor || "#1e40af",
            secondaryColor: data.secondaryColor || "#7e22ce",
            accentColor: data.accentColor || "#f3f4f6",
          });
          setLogoPreview(data.logoUrl || null);
        }
      } catch (error) {
        console.error("Error loading company settings:", error);
        toast.error("No se pudieron cargar los datos de la empresa");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [form]);

  // Manejo de carga de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setLogoFile(file);
      
      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Envío del formulario
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      let logoUrl = settings?.logoUrl;
      
      // Si hay un nuevo logo, subirlo primero
      if (logoFile) {
        const uploadedLogoUrl = await uploadCompanyLogo(logoFile);
        if (uploadedLogoUrl) {
          logoUrl = uploadedLogoUrl;
        }
      }
      
      // Actualizar configuración con los nuevos datos
      const updatedSettings = await updateCompanySettings({
        ...data,
        logoUrl
      });
      
      if (updatedSettings) {
        setSettings(updatedSettings);
        toast.success("Configuración guardada correctamente");
        
        // Limpiar estado de logo
        setLogoFile(null);
      }
    } catch (error) {
      console.error("Error saving company settings:", error);
      toast.error("Error al guardar la configuración");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          Configuración de la Empresa
        </CardTitle>
        <CardDescription>
          Esta información se utilizará en las facturas y documentos oficiales.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="style">Estilo de Documentos</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="general" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Empresa</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre S.L." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CIF/NIF</FormLabel>
                        <FormControl>
                          <Input placeholder="B12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Calle, número, código postal, ciudad" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+34 600 000 000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="contacto@empresa.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormLabel>Logo de la Empresa</FormLabel>
                  {logoPreview && (
                    <div className="flex justify-center mb-4">
                      <img 
                        src={logoPreview} 
                        alt="Logo de la empresa" 
                        className="max-h-32 object-contain border rounded p-2"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      id="logo"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("logo")?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Subir Nuevo Logo
                    </Button>
                    {logoFile && (
                      <div className="text-sm text-gray-500">
                        Nuevo logo seleccionado: {logoFile.name}
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Recomendado: Imagen PNG o JPG con fondo transparente, máximo 2MB.
                  </FormDescription>
                </div>
              </TabsContent>
              
              <TabsContent value="style" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <PaintBucket className="h-4 w-4 text-blue-600" />
                    Colores de Documentos
                  </h3>
                  <p className="text-sm text-gray-500">
                    Estos colores se utilizarán en los PDFs generados para propuestas, facturas, contratos e informes.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color Principal</FormLabel>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-md border"
                              style={{ backgroundColor: field.value }}
                            />
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Usado para cabeceras y títulos
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color Secundario</FormLabel>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-md border"
                              style={{ backgroundColor: field.value }}
                            />
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Usado para destacados y acentos
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accentColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color de Fondo</FormLabel>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-md border"
                              style={{ backgroundColor: field.value }}
                            />
                            <FormControl>
                              <Input type="color" {...field} />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Usado para fondos de secciones
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Vista previa</h3>
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div 
                      className="h-8 rounded-t-md flex items-center justify-center text-white font-bold" 
                      style={{ backgroundColor: form.watch("primaryColor") }}
                    >
                      ENCABEZADO DE DOCUMENTO
                    </div>
                    <div 
                      className="p-4 rounded-md mt-4 mb-4"
                      style={{ backgroundColor: form.watch("accentColor") }}
                    >
                      <h4 className="font-bold mb-2" style={{ color: form.watch("primaryColor") }}>
                        Título de sección
                      </h4>
                      <p className="text-sm">Contenido de ejemplo para el documento...</p>
                      <div 
                        className="mt-2 p-2 rounded-md inline-block font-semibold"
                        style={{ backgroundColor: form.watch("secondaryColor"), color: "white" }}
                      >
                        Elemento destacado
                      </div>
                    </div>
                    <div 
                      className="h-6 rounded-b-md flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: form.watch("primaryColor") }}
                    >
                      PIE DE PÁGINA
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <Button 
                type="submit" 
                className="gap-2 mt-6"
                disabled={isLoading}
              >
                <Save className="h-4 w-4" />
                Guardar Configuración
              </Button>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
};
