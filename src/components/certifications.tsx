"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface CertificationCardProps {
  title: string;
  provider: string;
  date: string;
}

function CertificationCard({ title, provider, date }: CertificationCardProps) {
  return (
    <motion.div className="group h-full">
      <Card className="h-full icloud-card border-none shadow-md backdrop-blur-lg relative overflow-hidden flex flex-col">
        {/* Top shine effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/8 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_2s_ease-in-out]"></div>

        {/* Edge glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[0_0_15px_2px_rgba(101,157,255,0.07)]"></div>

        <CardHeader className="pb-3 pt-4 px-4 bg-white/10 dark:bg-slate-800/80 relative z-10 group-hover:bg-white/15 dark:group-hover:bg-slate-700/90 transition-colors duration-300 flex-none h-[85px]">
          <CardTitle className="text-white/90 dark:text-white/90 group-hover:text-white dark:group-hover:text-white transition-colors duration-300 line-clamp-2 overflow-hidden font-semibold text-lg">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/10 dark:bg-slate-800/80 backdrop-blur-md relative z-10 group-hover:bg-white/15 dark:group-hover:bg-slate-700/90 transition-colors duration-300 flex-grow flex flex-col justify-between py-4 px-4">
          <div className="flex flex-col space-y-3">
            <p className="text-sm text-blue-300/80 dark:text-blue-300/80 font-medium group-hover:text-blue-300 dark:group-hover:text-blue-300 transition-colors duration-300 line-clamp-2 overflow-hidden">
              {provider}
            </p>
            <div className="flex items-center text-xs text-white/60 dark:text-white/60 group-hover:text-white/80 dark:group-hover:text-white/80 transition-colors duration-300">
              <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span className="truncate">{date}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Certifications() {
  const { t } = useLanguage();

  // Return early if t is not defined yet
  if (!t) {
    return <div>Loading...</div>;
  }

  return (
    <section id="certifications" className="py-12 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative z-10"
      >
        <h2 className="text-3xl font-bold tracking-tight mb-4 text-white dark:text-white">
          {t.certifications.title}
        </h2>
        <p className="text-white/70 dark:text-white/70 max-w-2xl backdrop-blur-sm bg-white/10 dark:bg-slate-800/50 p-4 rounded-lg">
          {t.certifications.subtitle}
        </p>
      </motion.div>

      <div className="space-y-10">
        {t.certifications.categories.map((category, catIndex) => (
          <div key={catIndex}>
            <h3 className="text-xl font-semibold mb-6 flex items-center text-white/90 dark:text-white/90">
              <div className="p-2 rounded-full bg-white/5 backdrop-blur-md shadow-[0_0_10px_rgba(101,157,255,0.15)] mr-2">
                <Award className="h-5 w-5 text-blue-300 dark:text-blue-300" />
              </div>
              {category.name}
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.certifications.map((cert, certIndex) => (
                <motion.div
                  key={certIndex}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: certIndex * 0.1 }}
                  className="h-[160px]" /* Increased height container */
                >
                  <CertificationCard
                    title={cert.title}
                    provider={cert.provider}
                    date={cert.date}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
