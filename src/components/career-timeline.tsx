"use client";
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
};

type ExperienceData = {
  timeline: string;
  positions: Position[];
  responsibilities: string[];
};

export function CareerTimeline() {
  const { t, language } = useLanguage() as any;

  // Default experience content in case t.experience is undefined
  const defaultExperience = {
    timeline: "Career at Federação das Indústrias do Acre - Sistema FIEAC",
    positions: [
      {
        title: "IT Analyst",
        company: "Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Feb 2025 - Present",
        current: true,
      },
      {
        title: "IT Assistant",
        company: "Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Jan 2024 - Feb 2025",
      },
      {
        title: "IT Intern",
        company: "Federação das Indústrias do Acre - Sistema FIEAC",
        location: "Rio Branco",
        period: "Sep 2023 - Dec 2023",
      },
    ],
    responsibilities: [
      "Development of low-code/no-code applications using Power Apps and Power Automate",
      "System integration with Dataverse, Dynamics 365 and external APIs",
      "Implementation of Python and Selenium scripts for automating processes",
      "Data analysis with Power BI and Microsoft Fabric",
      "Support and maintenance of organization systems",
    ],
  };

  // Use t.experience if available, otherwise use default
  const experience = t?.experience || defaultExperience;

  // Ensure responsibilities is always an array
  const responsibilities =
    experience?.responsibilities || defaultExperience.responsibilities;

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
                (position: Position, index: number) => (
                  <div key={index} className="relative pl-8 group/item">
                    {/* Timeline circle with glow effect */}
                    <div className="absolute left-0 top-[6px] h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(101,157,255,0.4)] group-hover/item:shadow-[0_0_15px_rgba(101,157,255,0.6)] transition-all duration-300"></div>

                    <div className="backdrop-blur-sm p-3 rounded-lg bg-white/10 dark:bg-slate-700/80 group-hover/item:bg-white/5 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-white/90 dark:text-white/90 group-hover/item:text-white dark:group-hover/item:text-white transition-colors duration-300">
                          {position.title}
                        </h3>
                        {position.current && (
                          <span className="bg-blue-500/70 text-white dark:text-white text-xs px-2 py-0.5 rounded shadow-[0_0_10px_rgba(101,157,255,0.3)]">
                            {language === "en" ? "Current" : "Atual"}
                          </span>
                        )}
                      </div>
                      <p className="text-blue-300/80 dark:text-blue-300/80 font-medium group-hover/item:text-blue-300 dark:group-hover/item:text-blue-300 transition-colors duration-300">
                        {position.company}
                      </p>
                      <p className="text-sm text-white/60 dark:text-white/60 group-hover/item:text-white/80 dark:group-hover/item:text-white/80 transition-colors duration-300">
                        {position.location} | {position.period}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right column: All responsibilities as a single entity */}
          <div className="md:col-span-2 backdrop-blur-sm bg-white/10 dark:bg-slate-700/80 p-6 rounded-lg hover:bg-white/5 transition-colors duration-300 group/resp">
            <h4 className="text-lg font-medium mb-4 text-blue-300/90 dark:text-blue-300/90 group-hover/resp:text-blue-300 dark:group-hover/resp:text-blue-300 transition-colors duration-300">
              {language === "en"
                ? "Responsibilities & Achievements"
                : "Responsabilidades & Conquistas"}
            </h4>

            <ul className="list-disc list-inside space-y-3 text-sm">
              {/* Show all responsibilities as a single list */}
              {responsibilities.map((resp: string, idx: number) => (
                <li
                  key={idx}
                  className="text-white/70 dark:text-white/70 group-hover/resp:text-white/90 dark:group-hover/resp:text-white/90 transition-colors duration-300"
                >
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
