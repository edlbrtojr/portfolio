import Link from "next/link";
import { projectHref } from "@/content";
import type { ArchiveItem, Locale, Project } from "@/content/types";

type Props = { locale: Locale; projects: Project[]; archive: ArchiveItem[]; more: string };

/**
 * O trabalho como toponímia: capitais (o que eu sustento hoje), cidades
 * (freelas e projeto pessoal) e povoados (o resto, ao longo de um igarapé).
 * As capitais têm lugar fixo na composição e atravessam o rio de propósito,
 * como o nome de uma região atravessa um rio no mapa; calcular o lado pela
 * curva criava dependência circular entre altura e posição.
 *
 * Cidades e povoados dividem a mesma faixa: cidades descendo na diagonal
 * pela margem esquerda e atravessando o rio, povoados na margem direita (a
 * coluna das notas). Um embaixo do outro, a seção tinha 2,5 telas e a
 * metade direita da carta ficava vazia.
 */
export function Toponyms({ locale, projects, archive, more }: Props) {
  const capitals = projects.filter((p) => p.rank === "capital");
  const cities = projects.filter((p) => p.rank === "cidade");
  const item = (p: Project, i: number) => (
    <li key={p.slug} id={p.slug} className={`topo topo-${p.rank} topo-${p.rank}-${i}`}>
      <Link href={projectHref(locale, p.slug)} className="topo-link" data-lantern>
        <span className="topo-linha-nome">
          <span className="topo-nome">{p.toponym.name}</span>
          {p.toponym.note && <span className="topo-nota">{p.toponym.note}</span>}
        </span>
        <span className="topo-legenda">{p.line}</span>
        <span className="topo-cota">{p.year}</span>
      </Link>
    </li>
  );
  return (
    <div className="topos-carta">
      <ol className="topos">{capitals.map(item)}</ol>

      <div className="topos-baixo">
        <ol className="topos topos-cidades" start={capitals.length + 1}>
          {cities.map(item)}
        </ol>

        <div className="povoados">
          <p className="povoados-legenda">{more}</p>
          <ul>
            {archive.map((a) => {
              const body = (
                <>
                  <span aria-hidden className="povoado-ponto" />
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
