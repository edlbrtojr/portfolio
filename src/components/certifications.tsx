"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface CertificationCardProps {
  title: string;
  provider: string;
  date: string;
  index: number;
}

function CertificationCard({ title, provider, date, index }: CertificationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Card className="h-full aurora-glass overflow-hidden hover:border-aurora-purple/30 transition-all duration-300">
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-purple/5 to-aurora-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="pb-2 relative">
          <CardTitle className="text-base font-display font-semibold text-foreground group-hover:text-aurora-purple transition-colors duration-300 line-clamp-2">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative">
          <div className="space-y-2">
            <p className="text-sm text-aurora-purple/80 font-medium line-clamp-1">
              {provider}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-aurora-cyan" />
              <span>{date}</span>
            </div>
          </div>
        </CardContent>

        {/* Subtle corner accent */}
        <div className="absolute bottom-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-aurora-purple/20 rounded-br-lg" />
        </div>
      </Card>
    </motion.div>
  );
}

export function Certifications() {
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
    <section id="certifications" className="py-12 relative">
      {/* Decorative blur */}
      <div className="absolute bottom-20 -left-20 w-60 h-60 bg-aurora-magenta/10 rounded-full blur-3xl" />

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
            <Award className="w-6 h-6 text-aurora-purple" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
              {t.certifications.title}
            </h2>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl ml-15">
          {t.certifications.subtitle}
        </p>
      </motion.div>

      {/* Certification categories */}
      <div className="space-y-10">
        {t.certifications.categories.map((category, catIndex) => (
          <motion.div
            key={catIndex}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
          >
            {/* Category header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-aurora-cyan/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-aurora-cyan" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground">
                {category.name}
              </h3>
              <span className="aurora-badge ml-auto">
                {category.certifications.length}
              </span>
            </div>

            {/* Certifications grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.certifications.map((cert, certIndex) => (
                <CertificationCard
                  key={certIndex}
                  title={cert.title}
                  provider={cert.provider}
                  date={cert.date}
                  index={certIndex}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total count */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-10 pt-6 border-t border-border/30 text-center"
      >
        <p className="text-muted-foreground">
          <span className="text-lg font-display font-semibold text-aurora-purple">
            {t.certifications.categories.reduce(
              (acc, cat) => acc + cat.certifications.length,
              0
            )}
          </span>{" "}
          {t.certifications.categories.reduce(
            (acc, cat) => acc + cat.certifications.length,
            0
          ) === 1
            ? "certification"
            : "certifications"}{" "}
          earned
        </p>
      </motion.div>
    </section>
  );
}
