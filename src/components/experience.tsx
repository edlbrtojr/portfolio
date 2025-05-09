"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { CareerTimeline } from "@/components/career-timeline";

export function Experience() {
  const { t, language } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="experience" className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold tracking-tight mb-4 text-white dark:text-white">
          {t.experience.title}
        </h2>
        <p className="text-white/80 dark:text-white/80 max-w-2xl backdrop-blur-sm bg-white/10 dark:bg-slate-800/50 p-4 rounded-lg">
          {t.experience.subtitle}
        </p>
      </motion.div>

      {/* Career Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <CareerTimeline />
      </motion.div>

      {/* Other positions */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-semibold mb-4 text-white dark:text-white">
          {language === "en" ? "Other Experience" : "Outras Experiências"}
        </h3>
        {t.experience.otherPositions.map((exp, index) => (
          <motion.div key={index} variants={item}>
            <Card className="icloud-card overflow-hidden">
              <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-slate-800/80">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white dark:text-white">
                      {exp.title}
                    </h3>
                    <p className="text-blue-300 dark:text-blue-300 font-medium">
                      {exp.company}
                    </p>
                    <p className="text-sm text-white/70 dark:text-white/70">
                      {exp.location} | {exp.period}
                    </p>
                  </div>
                </div>
              </div>
              {exp.responsibilities && (
                <CardContent className="pt-4 backdrop-blur-xl bg-white/10 dark:bg-slate-800/80">
                  <ul className="list-disc list-inside space-y-1 text-sm text-white/80 dark:text-white/80">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
