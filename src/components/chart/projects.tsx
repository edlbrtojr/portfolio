import Image from "next/image";
import { projectHref } from "@/content";
import type { ArchiveItem, Content, Locale, Project } from "@/content/types";
import { TravelLink } from "../scene/travel-link";
import { Raft } from "./raft";

type Props = { locale: Locale; projects: Project[]; archive: ArchiveItem[]; work: Content["work"]; ui: Content["ui"] };

/**
 * O trabalho em três alturas, da mais para a menos importante:
 *
 * - principais (`rank: "capital"`, o que eu sustento hoje): um bloco por
 *   projeto com o que é, o meu papel e a stack, e a tela real do projeto
 *   boiando no rio ao lado (Raft). Quem só passa o olho já vê o que eu faço
 *   e com o quê; antes a home tinha só o nome em caixa-alta e uma linha.
 * - menores (`rank: "cidade"`, freelas e projeto pessoal): uma linha cada,
 *   com link para o case.
 * - o resto (`archive`): lista curta na margem direita.
 *
 * Papel e stack são texto corrido em mono, não chips: é informação para
 * ler, não enfeite para contar (regra do dono sobre texto com propósito).
 */
export function Projects({ locale, projects, archive, work, ui }: Props) {
  const main = projects.filter((p) => p.rank === "capital");
  const minor = projects.filter((p) => p.rank === "cidade");
  return (
    <div className="projetos-carta">
      <ol className="projetos">
        {main.map((p) => {
          const href = projectHref(locale, p.slug);
          const shot = p.shots[0];
          const site = p.links[0];
          return (
            // data-porto: a cena mede daqui de onde sai o braço do rio deste projeto (ScenePage).
            <li key={p.slug} id={p.slug} className="projeto" data-porto="principal">
              <div className="col projeto-texto">
                <p className="projeto-de">
                  {p.toponym.note} <span aria-hidden>·</span> {p.year}
                </p>
                <h3 className="nome-projeto projeto-nome">
                  <TravelLink direction="ir" slug={p.slug} href={href} data-lantern>
                    {p.toponym.name}
                  </TravelLink>
                </h3>
                <p className="projeto-linha">{p.line}</p>
                <dl className="projeto-ficha">
                  <div>
                    <dt>{ui.role}</dt>
                    <dd>{p.role}</dd>
                  </div>
                  <div>
                    <dt>{ui.stack}</dt>
                    <dd>{p.stack.join(" · ")}</dd>
                  </div>
                </dl>
                <p className="projeto-links">
                  <TravelLink direction="ir" slug={p.slug} href={href}>
                    {work.open} →
                  </TravelLink>
                  {site && (
                    <a href={site.href} target="_blank" rel="noopener noreferrer">
                      {site.label} ↗
                    </a>
                  )}
                </p>
              </div>
              {shot && (
                <Raft href={href} slug={p.slug}>
                  {/* alt vazio: o link é decorativo (ver Raft) e a descrição completa da captura está no case. */}
                  <Image src={shot.src} alt="" fill sizes="(min-width: 1100px) 36vw, (min-width: 768px) 37vw, 72vw" />
                </Raft>
              )}
            </li>
          );
        })}
      </ol>

      <div className="menores-faixa">
        <ol className="col menores" start={main.length + 1}>
          {minor.map((p) => (
            <li key={p.slug} id={p.slug} className="menor" data-porto="menor">
              <TravelLink direction="ir" slug={p.slug} href={projectHref(locale, p.slug)} data-lantern>
                <span className="menor-de">
                  {p.toponym.note} <span aria-hidden>·</span> {p.year}
                </span>
                <span className="nome-projeto menor-nome">{p.toponym.name}</span>
                <span className="menor-linha">{p.line}</span>
              </TravelLink>
            </li>
          ))}
        </ol>

        <div className="povoados">
          <p className="povoados-legenda">{work.more}</p>
          <ul>
            {archive.map((a) => {
              const body = (
                <>
                  <span className="povoado-titulo">
                    {a.title}
                    {a.href && <span aria-hidden> ↗</span>}
                  </span>
                  <span className="povoado-ano">{a.year}</span>
                  <span className="povoado-texto">{a.description}</span>
                </>
              );
              return (
                <li key={a.title}>
                  {a.href ? (
                    <a href={a.href} target="_blank" rel="noopener noreferrer" className="povoado" data-lantern>
                      {body}
                    </a>
                  ) : (
                    <div className="povoado">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
