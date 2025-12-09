"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/language-context";

type Skill = string;

type SkillCategory = {
  name: string;
  skills: Skill[];
};

type SkillItem = {
  skill: string;
  category: string;
};

export function Skills() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const allSkills: SkillItem[] = t.skills.categories.flatMap(
    (category: SkillCategory) =>
      category.skills.map((skill: string) => ({
        skill,
        category: category.name,
      }))
  );

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
      {/* Decorative blur */}
      <div className="absolute top-20 -left-20 w-60 h-60 bg-aurora-purple/10 rounded-full blur-3xl" />

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
            <Code className="w-6 h-6 text-aurora-purple" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
              {t.skills.title}
            </h2>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl ml-15">
          {t.skills.subtitle}
        </p>
      </motion.div>

      {/* Skills card */}
      <Card className="aurora-glass-iridescent overflow-hidden group">
        <CardContent className="p-6 md:p-8 relative">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={
                  selectedCategory === null
                    ? "aurora-btn-primary rounded-xl"
                    : "aurora-btn rounded-xl"
                }
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {t.skills.filterAll}
              </Button>
            </motion.div>

            {t.skills.categories.map(
              (category: SkillCategory, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={
                      selectedCategory === category.name ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.name)}
                    className={
                      selectedCategory === category.name
                        ? "aurora-btn-primary rounded-xl"
                        : "aurora-btn rounded-xl"
                    }
                  >
                    {category.name}
                  </Button>
                </motion.div>
              )
            )}
          </div>

          {/* Skills display */}
          <motion.div layout className="flex flex-wrap gap-3">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((item: SkillItem, index: number) => (
                <motion.div
                  key={`${item.category}-${item.skill}`}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.02,
                    type: "spring",
                    stiffness: 200,
                  }}
                  layout
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <span className="inline-flex items-center px-3 py-1.5 text-sm rounded-xl bg-muted/30 text-foreground border border-border/50 hover:bg-aurora-purple/15 hover:border-aurora-purple/30 hover:text-aurora-purple transition-all duration-300 cursor-default hover:shadow-lg hover:shadow-aurora-purple/10">
                    {item.skill}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Skill count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-4 border-t border-border/30"
          >
            <p className="text-sm text-muted-foreground">
              {filteredSkills.length}{" "}
              {filteredSkills.length === 1 ? "skill" : "skills"}
              {selectedCategory && ` in ${selectedCategory}`}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </section>
  );
}
