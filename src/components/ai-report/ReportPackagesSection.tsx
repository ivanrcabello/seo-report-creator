
import { AIReport } from "@/services/aiReportService";
import { ReportSection } from "@/components/seo-report/ReportSection";
import { Package, Check } from "lucide-react";

interface ReportPackagesSectionProps {
  report: AIReport;
}

export const ReportPackagesSection = ({ report }: ReportPackagesSectionProps) => {
  if (!report.packages || report.packages.length === 0) {
    return null;
  }
  
  return (
    <ReportSection
      title="Planes Recomendados"
      icon={<Package className="h-5 w-5 text-amber-600" />}
      gradientFrom="from-amber-50"
      gradientTo="to-amber-50/30"
      titleColor="text-amber-800"
      borderColor="border-amber-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {report.packages.map((pkg, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg border border-amber-100 shadow-sm overflow-hidden"
          >
            <div className="p-5 bg-gradient-to-r from-amber-50 to-amber-100">
              <h3 className="text-xl font-bold text-amber-900">{pkg.name}</h3>
              <div className="mt-2">
                <span className="text-2xl font-bold text-amber-700">{pkg.price}€</span>
                <span className="text-gray-500">/mes</span>
              </div>
            </div>
            
            <div className="p-5">
              <ul className="space-y-3">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </ReportSection>
  );
};
