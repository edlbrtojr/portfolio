import Image from "next/image";
import type { CSSProperties } from "react";
import { content, homeHref, resumeHref, whatsappHref } from "@/content";
import type { Locale } from "@/content/types";
import { ChartFrame } from "./chart/chart-frame";
import { ContactCard } from "./chart/legend";
import { Prose } from "./chart/prose";
import { RiverType } from "./chart/river-type";
import { Projects } from "./chart/projects";
import { RichText } from "./home/rich-text";
import { ScenePage } from "./scene/scene-page";

/**
 * A home é uma carta do rio Acre à noite. O rio é a página: desce com a
 * leitura, o nome está escrito nele, o texto mora na margem esquerda e as
 * notas de professor na direita. A ordem do DOM é a ordem de leitura; o nome
 * desenhado no rio repete o h1.
 *
 * O percurso tem três perguntas, nesta ordem: quem é (abertura e bio), o que
 * ele fez (trabalho, agora, antes) e como falar com ele (contato). A abertura
 * já oferece os dois atalhos que quem chega procura.
 */
export function Home({ locale }: { locale: Locale }) {
  const c = content[locale];
  const copy = { locale, copied: c.contact.copied };
  return (
    <>
      <ScenePage kind="home" />
      <ChartFrame locale={locale} nav={c.nav} channels={c.contact.channels} copied={c.contact.copied} home={homeHref(locale)} resume={resumeHref(locale)} />
      <main id="conteudo" tabIndex={-1} className="carta">
        {/* Nome sem sobrenome no rio: 9 letras cabem numa tela de rio; o h1 tem o nome inteiro. */}
        <RiverType name="Edilberto" />

        <section aria-labelledby="abertura-nome" className="abertura">
          <div className="col">
            {/* O retrato: o site é para me conhecer, e até aqui não tinha rosto. */}
            <div className="abertura-retrato entra">
              <Image src="/images/profile.jpg" alt={c.hero.portraitAlt} width={1091} height={1203} sizes="(min-width: 768px) 128px, 96px" priority />
            </div>
            <h1 id="abertura-nome" className="abertura-nome entra" style={{ "--i": 1 } as CSSProperties}>
              {c.hero.name}
            </h1>
            <p className="abertura-linha entra" style={{ "--i": 2 } as CSSProperties}>
              {c.hero.line}
            </p>
            <p className="abertura-atalhos entra" style={{ "--i": 3 } as CSSProperties}>
              <a href="#trabalho">{c.hero.cta.work} ↓</a>
              <a href={whatsappHref(locale)} target="_blank" rel="noopener noreferrer">
                {c.hero.cta.contact} ↗
              </a>
            </p>
          </div>
        </section>

        <section aria-label={c.hero.name} className="bio">
          <Prose paragraphs={c.bio} idPrefix="nota-bio" pClass="bio-p" {...copy} />
        </section>

        <section id="trabalho" aria-labelledby="trabalho-titulo" className="secao">
          <h2 id="trabalho-titulo" className="col secao-titulo">
            {c.work.label}
          </h2>
          <Projects locale={locale} projects={c.projects} archive={c.archive} work={c.work} ui={c.ui} />
        </section>

        <section id="agora" aria-labelledby="agora-titulo" className="secao">
          <h2 id="agora-titulo" className="col secao-titulo">
            {c.now.label}
          </h2>
          <div className="diario">
            {/* Mês em que o texto foi escrito: diz se o "agora" ainda vale. */}
            <p className="col diario-cabecalho">{c.now.signature}</p>
            <Prose paragraphs={c.now.body} idPrefix="nota-agora" pClass="diario-p" {...copy} />
          </div>
        </section>

        <section id="antes" aria-labelledby="antes-titulo" className="secao">
          <h2 id="antes-titulo" className="col secao-titulo">
            {c.past.label}
          </h2>
          <div className="nota-linha">
            <ol className="col marcos">
              {c.past.steps.map((s) => (
                <li key={s.year}>
                  <span className="marco-ano">{s.year}</span>
                  <span className="marco-titulo">{s.title}</span>
                  <span className="marco-texto">{s.text}</span>
                </li>
              ))}
            </ol>
            <p className="nota-margem nota-solta">
              <span className="nota-lapis">{c.past.tools}</span>
            </p>
          </div>
        </section>

        <section id="contato" aria-labelledby="contato-titulo" className="secao foz">
          <h2 id="contato-titulo" className="col secao-titulo">
            {c.contact.label}
          </h2>
          {/* data-lantern: passar o mouse (ou o foco) no convite chama a lanterna e os vaga-lumes para ele, como nos topônimos. */}
          <p className="col convite" data-lantern>
            <RichText parts={c.contact.invite} {...copy} linkClass="convite-link" />
          </p>
          <div className="foz-base">
            <ContactCard items={c.contact.channels} {...copy} />
            <footer className="colofao">
              <p>{c.chart.colophon}</p>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
