
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { SeoLocalReport } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Award, Check, X, Phone, Globe, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface LocalSeoReportViewProps {
  report: SeoLocalReport;
}

export const LocalSeoReportView: React.FC<LocalSeoReportViewProps> = ({ report }) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-5 w-5 text-green-600" />
              {report.title}
            </CardTitle>
            <CardDescription>
              Fecha: {format(new Date(report.date), "PPP", { locale: es })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Información del negocio</h3>
              <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nombre del negocio</p>
                  <p className="font-medium">{report.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p>{report.location || report.address || "No disponible"}</p>
                </div>
                {report.phone && (
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      Teléfono
                    </p>
                    <p>{report.phone}</p>
                  </div>
                )}
                {report.website && (
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      Sitio web
                    </p>
                    <a 
                      href={report.website.startsWith('http') ? report.website : `https://${report.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline break-all"
                    >
                      {report.website}
                    </a>
                  </div>
                )}
                {report.googleBusinessUrl && (
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Google_My_Business_Logo.svg/512px-Google_My_Business_Logo.svg.png" 
                        alt="Google My Business" 
                        className="h-3.5 w-3.5" 
                      />
                      Google Business
                    </p>
                    <a 
                      href={report.googleBusinessUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline break-all"
                    >
                      Ver perfil
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {report.localListings && report.localListings.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Presencia Local</h3>
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <div className="space-y-2">
                    {report.localListings.map((listing: { name: string; listed: boolean; url?: string }, index: number) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          {listing.name}
                        </div>
                        <div className="flex items-center gap-1">
                          {listing.listed ? (
                            <>
                              <Check className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">Registrado</span>
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-500">No registrado</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {report.googleMapsRanking && (
              <div className="bg-slate-50 p-4 rounded-lg border text-center">
                <p className="text-gray-500 mb-1">Ranking en Google Maps</p>
                <div className="text-5xl font-bold text-green-600 mb-2">
                  #{report.googleMapsRanking}
                </div>
                <p className="text-sm text-gray-500">
                  Posición en búsquedas locales para términos principales
                </p>
              </div>
            )}
            
            {report.keywordRankings && report.keywordRankings.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-1">
                  <Search className="h-4 w-4" />
                  Posicionamiento por palabras clave
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg border divide-y">
                  {report.keywordRankings.map((keyword: { keyword: string; position: number }, index: number) => (
                    <div key={index} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{keyword.keyword}</span>
                        <Badge
                          variant={keyword.position <= 3 ? "default" : 
                                  keyword.position <= 10 ? "outline" : 
                                  "secondary"}
                          className={keyword.position <= 3 ? "bg-green-500" : 
                                  keyword.position <= 10 ? "border-amber-500 text-amber-600" : ""}
                        >
                          {keyword.position === 0 ? "Sin posición" : `#${keyword.position}`}
                        </Badge>
                      </div>
                      <Progress 
                        value={keyword.position === 0 ? 0 : Math.max(5, 100 - (keyword.position * 5))} 
                        className={`h-2 ${
                          keyword.position <= 3 ? "bg-green-100" : 
                          keyword.position <= 10 ? "bg-amber-100" : 
                          "bg-gray-100"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {report.recommendations && report.recommendations.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Recomendaciones para mejorar el SEO Local
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                {report.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-gray-700">{recommendation}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
