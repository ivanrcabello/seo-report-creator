
import { AIReport } from "@/services/aiReportService";
import { FileText, CheckCircle } from "lucide-react";
import { ReportSection } from "@/components/seo-report/ReportSection";

interface ReportPackagesSectionProps {
  report: AIReport;
}

export const ReportPackagesSection = ({ report }: ReportPackagesSectionProps) => {
  if (!report.packages || report.packages.length === 0) {
    return null;
  }

  return (
    <ReportSection
      title="Planes de Tarifas"
      icon={<FileText className="h-5 w-5 text-indigo-600" />}
      gradientFrom="from-indigo-50"
      gradientTo="to-indigo-50/30"
      titleColor="text-indigo-800"
      borderColor="border-indigo-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {report.packages.map((pack, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-indigo-100 shadow-sm overflow-hidden">
            <div className="bg-indigo-50 p-4 border-b border-indigo-100">
              <h3 className="text-xl font-semibold text-indigo-900">{pack.name}</h3>
              <p className="text-3xl font-bold text-indigo-700 mt-2">{pack.price}€<span className="text-sm font-normal text-gray-500">/mes</span></p>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {pack.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
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
