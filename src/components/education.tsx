"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, MapPin, Calendar } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function Education() {
  const { t } = useLanguage();

  if (!t) {
    return (
      <div className="py-12">
        <div className="aurora-glass rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-muted/50 rounded w-1/3 mb-4" />
          <div className="h-4 bg-muted/50 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <section id="education" className="py-12 relative">
      {/* Decorative blur */}
      <div className="absolute -top-10 -right-20 w-40 h-40 bg-aurora-cyan/10 rounded-full blur-3xl" />

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
            <GraduationCap className="w-6 h-6 text-aurora-purple" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
              {t.education.title}
            </h2>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl ml-15">
          {t.education.subtitle}
        </p>
      </motion.div>

      {/* Education cards */}
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
            <Card className="h-full aurora-glass-iridescent overflow-hidden hover-lift">
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <div className="w-14 h-14 rounded-2xl bg-aurora-purple/10 flex items-center justify-center shrink-0 group-hover:bg-aurora-purple/20 transition-colors duration-300">
                  <GraduationCap className="h-7 w-7 text-aurora-purple" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-display font-semibold text-foreground group-hover:text-aurora-purple transition-colors duration-300 leading-tight">
                    {edu.degree}
                  </CardTitle>
                  <p className="text-aurora-purple/80 font-medium mt-1">
                    {edu.institution}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-aurora-cyan" />
                    <span>{edu.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-aurora-cyan" />
                    <span>{edu.period}</span>
                  </div>
                </div>
              </CardContent>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-aurora-purple/30 rounded-tr-lg" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
