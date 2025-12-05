"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Define types for the career positions and responsibilities
type Position = {
  title: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  responsibilities?: string[];
};

type ExperienceData = {
  timeline: string;
  positions: Position[];
};

export function CareerTimeline() {
  const { t, language } = useLanguage() as any;

  // Default experience content in case t.experience is undefined
  const defaultExperienceEn = {
    timeline: "Career at Federação das Indústrias do Acre - Sistema FIEAC",
    positions: [
      {
        title: "Systems Analyst",
        company: "Observatório da Indústria - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Feb 2025 - Present",
        current: true,
        responsibilities: [
          "Working in a data intelligence center integrated with the Observatórios Network of the Sistema Indústria (CNI).",
          "Data analysis and development of strategic intelligence systems for the Observatório da Indústria do Acre.",
          "Creation of strategic dashboards and reports with Power BI and Microsoft Fabric to support strategic decision-making in the industrial sector.",
          "Development and maintenance of low-code/no-code applications using Power Apps and Power Automate for industrial data monitoring and analysis.",
          "System integration with Dataverse, Dynamics 365 and external APIs for industrial data collection and processing.",
          "Development of custom solutions with Next.js and TypeScript focused on data intelligence and strategic analysis.",
        ],
      },
      {
        title: "IT Assistant",
        company: "Unidade de Tecnologia - UNITEC - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Jan 2024 - Feb 2025",
        responsibilities: [
          "Working in corporate IT, developing internal solutions for different departments.",
          "Development of low-code/no-code applications using Power Apps and Power Automate to optimize corporate processes.",
          "Integration of corporate systems with Dataverse, Dynamics 365 and external APIs.",
          "Implementation of Python and Selenium scripts for automating repetitive processes and administrative routines.",
          "Development of internal reports and dashboards with Power BI and Microsoft Fabric for organizational management.",
          "Use of Next.js, TypeScript and Power Apps Component Framework for custom corporate solutions.",
        ],
      },
      {
        title: "IT Intern",
        company: "Unidade de Tecnologia - UNITEC - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Sep 2023 - Dec 2023",
        responsibilities: [
          "Working in corporate IT, providing technical support and development of internal solutions.",
          "Development and maintenance of internal applications with Power Platform for different organizational sectors.",
          "Automation of business workflows and administrative processes.",
          "Support and maintenance of corporate organization systems.",
        ],
      },
    ],
  };

  const defaultExperiencePt = {
    timeline: "Carreira na Federação das Indústrias do Acre - Sistema FIEAC",
    positions: [
      {
        title: "Analista de Sistemas",
        company: "Observatório da Indústria - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Fev/2025 - Atual",
        current: true,
        responsibilities: [
          "Atuação em centro de inteligência de dados integrado à Rede de Observatórios do Sistema Indústria (CNI).",
          "Análise de dados e desenvolvimento de sistemas de inteligência estratégica para o Observatório da Indústria do Acre.",
          "Criação de dashboards e relatórios estratégicos com Power BI e Microsoft Fabric para subsidiar decisões estratégicas do setor industrial.",
          "Desenvolvimento e manutenção de aplicações low-code/no-code utilizando Power Apps e Power Automate para monitoramento e análise de dados industriais.",
          "Integração de sistemas com Dataverse, Dynamics 365 e APIs externas para coleta e processamento de dados industriais.",
          "Desenvolvimento de soluções personalizadas com Next.js e TypeScript focadas em inteligência de dados e análise estratégica.",
        ],
      },
      {
        title: "Assistente de TI",
        company: "Unidade de Tecnologia - UNITEC - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Jan/2024 - Fev/2025",
        responsibilities: [
          "Atuação na TI corporativa da organização, desenvolvendo soluções internas para diferentes departamentos.",
          "Desenvolvimento de aplicações low-code/no-code utilizando Power Apps e Power Automate para otimização de processos corporativos.",
          "Integração de sistemas corporativos com Dataverse, Dynamics 365 e APIs externas.",
          "Implementação de scripts em Python e Selenium para automação de processos repetitivos e rotinas administrativas.",
          "Desenvolvimento de relatórios e dashboards internos com Power BI e Microsoft Fabric para gestão organizacional.",
          "Utilização de Next.js, TypeScript e Power Apps Component Framework para soluções corporativas personalizadas.",
        ],
      },
      {
        title: "Estagiário de TI",
        company: "Unidade de Tecnologia - UNITEC - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Set/2023 - Dez/2023",
        responsibilities: [
          "Atuação na TI corporativa da organização, fornecendo suporte técnico e desenvolvimento de soluções internas.",
          "Desenvolvimento e manutenção de aplicações internas com Power Platform para diferentes setores organizacionais.",
          "Automação de fluxos de trabalho empresariais e processos administrativos.",
          "Suporte e manutenção de sistemas corporativos da organização.",
        ],
      },
    ],
  };

  // Use appropriate default experience based on language
  const defaultExperience =
    language === "en" ? defaultExperienceEn : defaultExperiencePt;

  // Use t.experience if available, otherwise use default based on language
  const experience = t?.experience || defaultExperience;

  // Find the first position with responsibilities or the current one to set as initial selected
  const getInitialSelectedIndex = (positions: Position[]) => {
    if (!positions || positions.length === 0) return 0;
    // Try to find current position first
    const currentIndex = positions.findIndex((p: Position) => p.current);
    if (
      currentIndex !== -1 &&
      positions[currentIndex].responsibilities &&
      positions[currentIndex].responsibilities!.length > 0
    ) {
      return currentIndex;
    }
    // Otherwise find first with responsibilities
    const firstWithResponsibilities = positions.findIndex(
      (p: Position) => p.responsibilities && p.responsibilities.length > 0
    );
    return firstWithResponsibilities !== -1 ? firstWithResponsibilities : 0;
  };

  const positions = experience.positions || [];
  const initialIndex = getInitialSelectedIndex(positions);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // Update selected index when language changes (experience will change too)
  useEffect(() => {
    const newIndex = getInitialSelectedIndex(positions);
    setSelectedIndex(newIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Get responsibilities for the selected position
  const getSelectedResponsibilities = () => {
    const positions = experience.positions || [];
    if (positions.length === 0) return [];

    const selectedPosition = positions[selectedIndex];
    if (selectedPosition?.responsibilities) {
      return selectedPosition.responsibilities;
    }

    // Fallback to default responsibilities based on language
    const defaultPositions =
      language === "en"
        ? defaultExperienceEn.positions
        : defaultExperiencePt.positions;

    if (defaultPositions[selectedIndex]?.responsibilities) {
      return defaultPositions[selectedIndex].responsibilities;
    }

    return [];
  };

  const responsibilities = getSelectedResponsibilities();
  const selectedPosition = experience.positions?.[selectedIndex];

  return (
    <Card className="overflow-hidden icloud-card border-none relative group">
      {/* Top shine effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/8 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_2.5s_ease-in-out]"></div>

      {/* Edge glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[0_0_15px_2px_rgba(101,157,255,0.05)]"></div>

      <CardHeader className="p-4 flex flex-row items-center gap-2 bg-white/10 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/5 relative z-10">
        <div className="p-2 rounded-full bg-white/5 backdrop-blur-md shadow-[0_0_10px_rgba(101,157,255,0.15)]">
          <Briefcase className="h-5 w-5 text-blue-300 dark:text-blue-300" />
        </div>
        <h3 className="text-lg font-semibold text-white/90 dark:text-white/90">
          {experience.timeline}
        </h3>
      </CardHeader>

      <CardContent className="p-6 backdrop-blur-md bg-white/10 dark:bg-slate-800/80 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: Job title evolution timeline */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[6px] top-[10px] bottom-[36px] w-0.5 bg-gradient-to-b from-blue-400/50 to-blue-500/20"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              {(experience.positions || []).map(
                (position: Position, index: number) => {
                  const isSelected = selectedIndex === index;
                  const hasResponsibilities =
                    position.responsibilities &&
                    position.responsibilities.length > 0;

                  return (
                    <div
                      key={index}
                      className="relative pl-8 group/item"
                      onClick={() => {
                        if (hasResponsibilities) {
                          setSelectedIndex(index);
                        }
                      }}
                    >
                      {/* Timeline circle with glow effect */}
                      <div
                        className={`absolute left-0 top-[6px] h-3 w-3 rounded-full transition-all duration-300 ${
                          isSelected
                            ? "bg-blue-500 shadow-[0_0_15px_rgba(101,157,255,0.8)] scale-125"
                            : "bg-blue-400 shadow-[0_0_10px_rgba(101,157,255,0.4)] group-hover/item:shadow-[0_0_15px_rgba(101,157,255,0.6)]"
                        } ${hasResponsibilities ? "cursor-pointer" : ""}`}
                      ></div>

                      <div
                        className={`backdrop-blur-sm p-3 rounded-lg transition-all duration-300 ${
                          isSelected
                            ? "bg-white/20 dark:bg-slate-600/90 border-2 border-blue-400/50 shadow-[0_0_20px_rgba(101,157,255,0.2)]"
                            : "bg-white/10 dark:bg-slate-700/80 border-2 border-transparent group-hover/item:bg-white/5"
                        } ${hasResponsibilities ? "cursor-pointer" : ""}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`text-xl font-semibold transition-colors duration-300 ${
                              isSelected
                                ? "text-white dark:text-white"
                                : "text-white/90 dark:text-white/90 group-hover/item:text-white dark:group-hover/item:text-white"
                            }`}
                          >
                            {position.title}
                          </h3>
                          {position.current && (
                            <span className="bg-blue-500/70 text-white dark:text-white text-xs px-2 py-0.5 rounded shadow-[0_0_10px_rgba(101,157,255,0.3)]">
                              {language === "en" ? "Current" : "Atual"}
                            </span>
                          )}
                        </div>
                        <p
                          className={`font-medium transition-colors duration-300 ${
                            isSelected
                              ? "text-blue-300 dark:text-blue-300"
                              : "text-blue-300/80 dark:text-blue-300/80 group-hover/item:text-blue-300 dark:group-hover/item:text-blue-300"
                          }`}
                        >
                          {position.company}
                        </p>
                        <p
                          className={`text-sm transition-colors duration-300 ${
                            isSelected
                              ? "text-white/80 dark:text-white/80"
                              : "text-white/60 dark:text-white/60 group-hover/item:text-white/80 dark:group-hover/item:text-white/80"
                          }`}
                        >
                          {position.location} | {position.period}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Right column: Responsibilities for selected position */}
          <div className="md:col-span-2 backdrop-blur-sm bg-white/10 dark:bg-slate-700/80 p-6 rounded-lg hover:bg-white/5 transition-colors duration-300 group/resp">
            <div className="mb-4">
              <h4 className="text-lg font-medium mb-2 text-blue-300/90 dark:text-blue-300/90 group-hover/resp:text-blue-300 dark:group-hover/resp:text-blue-300 transition-colors duration-300">
                {language === "en"
                  ? "Responsibilities & Achievements"
                  : "Responsabilidades & Conquistas"}
              </h4>
              {selectedPosition && (
                <p className="text-sm text-white/50 dark:text-white/50">
                  {selectedPosition.title}
                  {selectedPosition.current &&
                    ` • ${language === "en" ? "Current" : "Atual"}`}
                </p>
              )}
            </div>

            {responsibilities.length > 0 ? (
              <ul className="list-disc list-inside space-y-3 text-sm">
                {responsibilities.map((resp: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-white/70 dark:text-white/70 group-hover/resp:text-white/90 dark:group-hover/resp:text-white/90 transition-colors duration-300 animate-in fade-in slide-in-from-right-4 duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {resp}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/50 dark:text-white/50 italic">
                {language === "en"
                  ? "No responsibilities listed for this position."
                  : "Nenhuma responsabilidade listada para esta posição."}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
