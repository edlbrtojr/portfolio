"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function Education() {
  const { t } = useLanguage();

  // Return early if t is not defined yet
  if (!t) {
    return <div>Loading...</div>;
  }

  return (
    <section id="education" className="py-12 relative">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative z-10"
      >
        <h2 className="text-3xl font-bold tracking-tight mb-4 text-white dark:text-white">
          {t.education.title}
        </h2>
        <p className="text-white/70 dark:text-white/70 max-w-2xl backdrop-blur-sm bg-white/10 dark:bg-slate-800/50 p-4 rounded-lg">
          {t.education.subtitle}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {t.education.degrees.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <Card className="h-full icloud-card border-none shadow-lg transition-all relative overflow-hidden">
              {/* Top shine effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/8 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_2s_ease-in-out]"></div>

              {/* Edge glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[0_0_15px_2px_rgba(101,157,255,0.07)]"></div>

              <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-white/10 dark:bg-slate-800/80 backdrop-blur-xl relative z-10 group-hover:bg-white/15 dark:group-hover:bg-slate-700/90 transition-colors duration-300">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(101,157,255,0.2)] group-hover:shadow-[0_0_20px_rgba(101,157,255,0.3)] transition-all">
                  <GraduationCap className="h-6 w-6 text-blue-300 dark:text-blue-300" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white/90 dark:text-white/90 group-hover:text-white dark:group-hover:text-white transition-colors duration-300">
                    {edu.degree}
                  </CardTitle>
                  <p className="text-blue-300/80 dark:text-blue-300/80 font-medium group-hover:text-blue-300 dark:group-hover:text-blue-300 transition-colors duration-300">
                    {edu.institution}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="bg-white/10 dark:bg-slate-800/80 backdrop-blur-md relative z-10 group-hover:bg-white/15 dark:group-hover:bg-slate-700/90 transition-colors duration-300">
                <p className="text-sm text-white/60 dark:text-white/60 group-hover:text-white/80 dark:group-hover:text-white/80 transition-colors duration-300">
                  {edu.location} | {edu.period}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
