"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { Briefcase, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

  const defaultExperienceEn = {
    timeline: "Career at Federação das Indústrias do Acre - Sistema FIEAC",
    positions: [
      {
        title: "Systems Analyst",
        company:
          "Observatório da Indústria do Acre - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Nov 2025 - Present",
        current: true,
        responsibilities: [
          "Working in the data intelligence center of the Observatório da Indústria do Acre, integrated with the Observatórios Network of the Sistema Indústria (CNI).",
          "Collection, processing and analysis of socioeconomic and industrial data for the state of Acre.",
          "Development of strategic studies, economic research and market analysis to support the industrial sector's decision-making.",
          "Creation of interactive dashboards and analytical reports with Power BI and Microsoft Fabric for monitoring industrial indicators.",
          "Development of data intelligence systems and web applications with Next.js and TypeScript for dissemination of industrial information.",
          "Integration with national databases and CNI systems for consolidation of regional industrial statistics.",
          "Production of technical publications, newsletters and strategic content about the industrial panorama of Acre.",
        ],
      },
      {
        title: "Systems Analyst",
        company:
          "Unidade de Tecnologia - UNITEC - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Feb 2025 - Nov 2025",
        responsibilities: [
          "Technological leadership in the IT unit, coordinating development projects and internal solutions.",
          "Architecture and development of corporate systems using Next.js, TypeScript and Microsoft Power Platform.",
          "Implementation of business intelligence solutions with Power BI and Microsoft Fabric for different departments.",
          "Development and maintenance of low-code/no-code applications using Power Apps and Power Automate.",
          "Integration of corporate systems with Dataverse, Dynamics 365 and external APIs.",
          "Technical mentoring and support to the development team in projects and automations.",
        ],
      },
      {
        title: "IT Assistant",
        company:
          "Unidade de Tecnologia - UNITEC - Federação das Indústrias do Acre - Sistema FIEAC",
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
        company:
          "Unidade de Tecnologia - UNITEC - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Mar 2023 - Jan 2024",
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
        company:
          "Observatório da Indústria do Acre - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Nov/2025 - Atual",
        current: true,
        responsibilities: [
          "Atuação no centro de inteligência de dados do Observatório da Indústria do Acre, integrado à Rede de Observatórios do Sistema Indústria (CNI).",
          "Coleta, tratamento e análise de dados socioeconômicos e industriais do estado do Acre.",
          "Elaboração de estudos estratégicos, pesquisas econômicas e análises de mercado para subsidiar tomadas de decisão do setor industrial.",
          "Criação de dashboards interativos e relatórios analíticos com Power BI e Microsoft Fabric para acompanhamento de indicadores industriais.",
          "Desenvolvimento de sistemas de inteligência de dados e aplicações web com Next.js e TypeScript para disseminação de informações industriais.",
          "Integração com bases de dados nacionais e sistemas da CNI para consolidação de estatísticas industriais regionais.",
          "Produção de publicações técnicas, boletins e conteúdos estratégicos sobre o panorama industrial do Acre.",
        ],
      },
      {
        title: "Analista de Sistemas",
        company:
          "Unidade de Tecnologia - UNITEC - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Fev/2025 - Nov/2025",
        responsibilities: [
          "Liderança técnica na unidade de TI, coordenando projetos de desenvolvimento e soluções internas.",
          "Arquitetura e desenvolvimento de sistemas corporativos utilizando Next.js, TypeScript e Microsoft Power Platform.",
          "Implementação de soluções de business intelligence com Power BI e Microsoft Fabric para diferentes departamentos.",
          "Desenvolvimento e manutenção de aplicações low-code/no-code utilizando Power Apps e Power Automate.",
          "Integração de sistemas corporativos com Dataverse, Dynamics 365 e APIs externas.",
          "Mentoria técnica e suporte à equipe de desenvolvimento em projetos e automações.",
        ],
      },
      {
        title: "Assistente de TI",
        company:
          "Unidade de Tecnologia - UNITEC - Federação das Indústrias do Acre - Sistema FIEAC",
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
        company:
          "Unidade de Tecnologia - UNITEC - Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Mar/2023 - Jan/2024",
        responsibilities: [
          "Atuação na TI corporativa da organização, fornecendo suporte técnico e desenvolvimento de soluções internas.",
          "Desenvolvimento e manutenção de aplicações internas com Power Platform para diferentes setores organizacionais.",
          "Automação de fluxos de trabalho empresariais e processos administrativos.",
          "Suporte e manutenção de sistemas corporativos da organização.",
        ],
      },
    ],
  };

  const defaultExperience =
    language === "en" ? defaultExperienceEn : defaultExperiencePt;
  const experience = t?.experience || defaultExperience;

  const getInitialSelectedIndex = (positions: Position[]) => {
    if (!positions || positions.length === 0) return 0;
    const currentIndex = positions.findIndex((p: Position) => p.current);
    if (
      currentIndex !== -1 &&
      positions[currentIndex].responsibilities &&
      positions[currentIndex].responsibilities!.length > 0
    ) {
      return currentIndex;
    }
    const firstWithResponsibilities = positions.findIndex(
      (p: Position) => p.responsibilities && p.responsibilities.length > 0
    );
    return firstWithResponsibilities !== -1 ? firstWithResponsibilities : 0;
  };

  const positions = experience.positions || [];
  const initialIndex = getInitialSelectedIndex(positions);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    const newIndex = getInitialSelectedIndex(positions);
    setSelectedIndex(newIndex);
  }, [language]);

  const getSelectedResponsibilities = () => {
    const positions = experience.positions || [];
    if (positions.length === 0) return [];

    const selectedPosition = positions[selectedIndex];
    if (selectedPosition?.responsibilities) {
      return selectedPosition.responsibilities;
    }

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
    <Card className="aurora-glass-iridescent overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-border/30">
        <div className="w-10 h-10 rounded-xl bg-aurora-purple/10 flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-aurora-purple" />
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground">
          {experience.timeline}
        </h3>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Timeline */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-aurora-purple via-aurora-cyan to-aurora-purple/20 rounded-full" />

            {/* Timeline items */}
            <div className="space-y-6">
              {(experience.positions || []).map(
                (position: Position, index: number) => {
                  const isSelected = selectedIndex === index;
                  const hasResponsibilities =
                    position.responsibilities &&
                    position.responsibilities.length > 0;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-8 group/item"
                      onClick={() => {
                        if (hasResponsibilities) {
                          setSelectedIndex(index);
                        }
                      }}
                    >
                      {/* Timeline dot */}
                      <motion.div
                        className={`absolute left-0 top-2 h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? "bg-aurora-purple shadow-lg shadow-aurora-purple/40"
                            : "bg-muted border-2 border-aurora-purple/30 group-hover/item:border-aurora-purple/60"
                        } ${hasResponsibilities ? "cursor-pointer" : ""}`}
                        whileHover={
                          hasResponsibilities ? { scale: 1.1 } : undefined
                        }
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-white"
                          />
                        )}
                      </motion.div>

                      {/* Position card */}
                      <motion.div
                        className={`p-4 rounded-xl transition-all duration-300 ${
                          isSelected
                            ? "bg-aurora-purple/10 border border-aurora-purple/30"
                            : "bg-muted/30 border border-transparent hover:bg-muted/50"
                        } ${hasResponsibilities ? "cursor-pointer" : ""}`}
                        whileHover={hasResponsibilities ? { x: 4 } : undefined}
                      >
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4
                            className={`font-display font-semibold transition-colors duration-300 ${
                              isSelected
                                ? "text-aurora-purple"
                                : "text-foreground group-hover/item:text-aurora-purple"
                            }`}
                          >
                            {position.title}
                          </h4>
                          {position.current && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <Sparkles className="w-3 h-3" />
                              {language === "en" ? "Current" : "Atual"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-medium mb-1 line-clamp-2">
                          {position.company}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {position.location} • {position.period}
                        </p>

                        {isSelected && hasResponsibilities && (
                          <div className="mt-2 flex items-center text-xs text-aurora-purple">
                            <ChevronRight className="w-3 h-3 mr-1" />
                            <span>
                              {language === "en"
                                ? "View details"
                                : "Ver detalhes"}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                }
              )}
            </div>
          </div>

          {/* Right column: Responsibilities */}
          <div className="lg:col-span-2">
            <div className="aurora-glass rounded-2xl p-6 h-full">
              <div className="mb-4">
                <h4 className="text-base font-display font-semibold text-aurora-purple mb-1">
                  {language === "en"
                    ? "Responsibilities & Achievements"
                    : "Responsabilidades & Conquistas"}
                </h4>
                {selectedPosition && (
                  <p className="text-sm text-muted-foreground">
                    {selectedPosition.title}
                    {selectedPosition.current &&
                      ` • ${language === "en" ? "Current" : "Atual"}`}
                  </p>
                )}
              </div>

              <AnimatePresence mode="wait">
                {responsibilities.length > 0 ? (
                  <motion.ul
                    key={selectedIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {responsibilities.map((resp: string, idx: number) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-aurora-cyan mt-2 shrink-0" />
                        <span className="leading-relaxed">{resp}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted-foreground italic"
                  >
                    {language === "en"
                      ? "No responsibilities listed for this position."
                      : "Nenhuma responsabilidade listada para esta posição."}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
