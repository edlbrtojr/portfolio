"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

type Skill = string;

type SkillCategory = {
  name: string;
  skills: Skill[];
};

type SkillsData = {
  title: string;
  subtitle: string;
  filterAll: string;
  categories: SkillCategory[];
};

type SkillItem = {
  skill: string;
  category: string;
};

export function Skills() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Return early if t is not defined yet
  if (!t) {
    return <div>Loading...</div>;
  }

  // Get all skills for the "All" filter
  const allSkills: SkillItem[] = t.skills.categories.flatMap(
    (category: SkillCategory) =>
      category.skills.map((skill: string) => ({
        skill,
        category: category.name,
      }))
  );

  // Filter skills based on selected category
  const filteredSkills: SkillItem[] = selectedCategory
    ? t.skills.categories
        .find((c: SkillCategory) => c.name === selectedCategory)
        ?.skills.map((skill: string) => ({
          skill,
          category: selectedCategory,
        })) || []
    : allSkills;

  return (
    <section id="skills" className="py-12 relative">
      {/* Decorative elements */}
      <div className="absolute top-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative z-10"
      >
        <h2 className="text-3xl font-bold tracking-tight mb-4 text-white dark:text-white">
          {t.skills.title}
        </h2>
        <p className="text-white/70 dark:text-white/70 max-w-2xl backdrop-blur-sm bg-white/10 dark:bg-slate-800/50 p-4 rounded-lg">
          {t.skills.subtitle}
        </p>
      </motion.div>

      {/* Hero-like skills showcase with filters */}
      <Card className="icloud-card overflow-hidden group relative border-none shadow-lg">
        {/* Top shine effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/8 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_2s_ease-in-out]"></div>

        {/* Edge glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[0_0_15px_2px_rgba(101,157,255,0.07)]"></div>

        <CardContent className="p-6 md:p-8 relative z-10 backdrop-blur-xl bg-white/10 dark:bg-slate-800/80 group-hover:bg-white/15 dark:group-hover:bg-slate-700/90 transition-colors duration-300">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={
                selectedCategory === null
                  ? "bg-white/8 text-white dark:text-white border-transparent"
                  : "icloud-btn text-white/80 dark:text-white/80 border-white/5 hover:bg-white/5 hover:text-white/90"
              }
            >
              {t.skills.filterAll}
            </Button>

            {t.skills.categories.map(
              (category: SkillCategory, index: number) => (
                <Button
                  key={index}
                  variant={
                    selectedCategory === category.name ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className={
                    selectedCategory === category.name
                      ? "bg-white/8 text-white dark:text-white border-transparent"
                      : "icloud-btn text-white/80 dark:text-white/80 border-white/5 hover:bg-white/5 hover:text-white/90"
                  }
                >
                  {category.name}
                </Button>
              )
            )}
          </div>

          {/* Skills display */}
          <motion.div layout className="flex flex-wrap gap-3">
            <AnimatePresence>
              {filteredSkills.map((item: SkillItem, index: number) => (
                <motion.div
                  key={`${item.category}-${item.skill}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  layout
                >
                  <Badge
                    variant="secondary"
                    className="text-sm py-1.5 px-3 bg-white/10 dark:bg-slate-700/80 text-white/70 dark:text-white/70 border border-white/3 transition-all duration-300 hover:bg-white/15 hover:text-white/90 hover:shadow-[0_0_10px_rgba(101,157,255,0.1)]"
                  >
                    {item.skill}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </CardContent>
      </Card>
    </section>
  );
}
