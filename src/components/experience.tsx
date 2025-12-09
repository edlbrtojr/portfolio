"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Building2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { CareerTimeline } from "@/components/career-timeline";

export function Experience() {
  const { t, language } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="experience" className="py-12 relative">
      {/* Decorative blur */}
      <div className="absolute top-40 -right-20 w-60 h-60 bg-aurora-magenta/10 rounded-full blur-3xl" />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative z-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-aurora-purple/10 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-aurora-purple" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
              {t.experience.title}
            </h2>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl ml-15">
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-aurora-cyan/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-aurora-cyan" />
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground">
            {language === "en" ? "Other Experience" : "Outras Experiências"}
          </h3>
        </div>

        {t.experience.otherPositions.map((exp, index) => (
          <motion.div key={index} variants={item}>
            <Card className="aurora-glass hover-lift overflow-hidden group">
              <div className="p-5 relative">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple/5 to-aurora-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-aurora-purple transition-colors duration-300">
                        {exp.title}
                      </h3>
                      <p className="text-aurora-purple font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <span className="aurora-badge shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {exp.location}
                  </p>
                </div>
              </div>

              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <CardContent className="pt-0 pb-5 px-5 border-t border-border/30">
                  <ul className="list-none space-y-2 text-sm text-muted-foreground mt-4">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-aurora-purple/50 mt-2 shrink-0" />
                        <span className="group-hover:text-foreground transition-colors duration-300">
                          {resp}
                        </span>
                      </li>
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
