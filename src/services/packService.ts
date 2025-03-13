
import { SeoPack } from "@/types/client";
import { v4 as uuidv4 } from "uuid";

// Datos de ejemplo para paquetes SEO
let seoPacks: SeoPack[] = [
  {
    id: "1",
    name: "SEO Básico",
    description: "Optimización básica para pequeñas empresas y negocios locales",
    price: 299.99, // Precio en euros, IVA incluido
    features: [
      "Análisis SEO inicial",
      "Optimización de 5 palabras clave",
      "Informe mensual de rendimiento",
      "Optimización básica on-page"
    ],
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    name: "SEO Profesional",
    description: "Estrategia SEO completa para empresas en crecimiento",
    price: 599.99, // Precio en euros, IVA incluido
    features: [
      "Análisis SEO completo",
      "Optimización de 15 palabras clave",
      "Informes quincenales de rendimiento",
      "Optimización on-page avanzada",
      "Estrategia de contenidos básica",
      "Análisis de competencia"
    ],
    isActive: true,
    createdAt: "2024-01-20T14:30:00Z"
  },
  {
    id: "3",
    name: "SEO Premium",
    description: "Solución SEO integral para empresas que buscan dominar su nicho",
    price: 1199.99, // Precio en euros, IVA incluido
    features: [
      "Auditoría SEO completa",
      "Optimización de 30+ palabras clave",
      "Informes semanales personalizados",
      "Optimización on-page y off-page",
      "Estrategia de contenidos avanzada",
      "Análisis de competencia detallado",
      "Link building premium",
      "Soporte SEO dedicado"
    ],
    isActive: true,
    createdAt: "2024-02-05T09:15:00Z"
  }
];

// Operaciones CRUD para paquetes
export const getSeoPacks = (): SeoPack[] => {
  return seoPacks.filter(pack => pack.isActive);
};

export const getAllSeoPacks = (): SeoPack[] => {
  return [...seoPacks];
};

export const getSeoPack = (id: string): SeoPack | undefined => {
  return seoPacks.find(pack => pack.id === id);
};

export const addSeoPack = (pack: Omit<SeoPack, "id" | "createdAt">): SeoPack => {
  const newPack: SeoPack = {
    id: uuidv4(),
    ...pack,
    createdAt: new Date().toISOString()
  };
  seoPacks = [...seoPacks, newPack];
  return newPack;
};

export const updateSeoPack = (pack: SeoPack): SeoPack => {
  seoPacks = seoPacks.map(p => p.id === pack.id ? pack : p);
  return pack;
};

export const deleteSeoPack = (id: string): void => {
  // Marcamos como inactivo en lugar de eliminar
  seoPacks = seoPacks.map(pack => 
    pack.id === id ? { ...pack, isActive: false } : pack
  );
};
