import { content, homeHref, resumeHref, whatsappHref } from "@/content";
import type { Locale } from "@/content/types";
import { SceneRoot, StageObserver } from "./scene/scene-root";
import { CareerSection } from "./sections/career";
import { CaseSection } from "./sections/case-section";
import { ContactSection } from "./sections/contact";
import { Hero } from "./sections/hero";
import { MoreSection } from "./sections/more";
import { PathSection } from "./sections/path";
import { ServicesSection } from "./sections/services";
import { SiteHeader } from "./site-header";

export function Home({ locale }: { locale: Locale }) {
  const c = content[locale];
  const whatsapp = whatsappHref(locale);
  return (
    <>
      {/* Nome sem acento/sobrenome nas partículas: 9 letras largas amostram melhor. */}
      <SceneRoot name="EDILBERTO" />
      <StageObserver />
      <SiteHeader nav={c.nav} home={homeHref(locale)} resume={resumeHref(locale)} />
      <main id="conteudo" className="relative z-10">
        <Hero hero={c.hero} whatsapp={whatsapp} />
        <PathSection path={c.path} />
        <div id="projetos" className="scroll-mt-16">
          {c.featured.map((p, n) => (
            <CaseSection key={p.slug} project={p} index={n + 1} locale={locale} ui={c.ui} />
          ))}
          <MoreSection more={c.more} archive={c.archive} locale={locale} ui={c.ui} />
        </div>
        <CareerSection career={c.career} />
        <ServicesSection services={c.services} whatsapp={whatsapp} />
        <ContactSection contact={c.contact} footer={c.ui.footer} whatsapp={whatsapp} locale={locale} />
      </main>
    </>
  );
}
