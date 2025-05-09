import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { Education } from "@/components/education";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Certifications } from "@/components/certifications";
import "./section-styles.css";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-8 animate-fade-in">
      <Hero />
      <Projects />
      <Experience />
      <Education />
      <Skills />
      <Certifications />
    </div>
  );
}
