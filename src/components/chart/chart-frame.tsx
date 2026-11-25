"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Content, Locale, Rich } from "@/content/types";
import { LocalTime } from "../home/local-time";
import { ContactList } from "./legend";

type Props = {
  locale: Locale;
  nav: Content["nav"];
  channels: Rich[];
  copied: string;
  home: string;
  resume: string;
  /** Mesma página no outro idioma (no case, o mesmo projeto). */
  switchHref?: string;
  /** Página com capturas claras (case): sem a faixa escura do topo, ver frame.css. */
  photos?: boolean;
};

/**
 * A moldura da carta. Cada peça dela orienta o visitante:
 * - canto esquerdo: quem é (link para o início) e que horas são em Rio Branco,
 *   para quem vai escrever saber se eu estou acordado;
 * - canto direito: a navegação (trabalho, agora, contato, currículo, idioma);
 * - borda direita: a água sobe com a leitura e passa por uma marca em cada
 *   seção. Os números por tela e os tracinhos decorativos saíram: não
 *   diziam nada; a marca de seção diz onde você está.
 * No celular a navegação e o contato moram numa folha aberta por um botão fixo.
 */
export function ChartFrame({ locale, nav, channels, copied, home, resume, switchHref, photos = false }: Props) {
  const sheet = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const brand = useRef<HTMLAnchorElement>(null);
  const [marks, setMarks] = useState<number[]>([]);

  // Marcas da régua: onde o scroll chega a cada seção, em fração da rolagem
  // (a mesma escala da água, que é scroll(root)). Refeito quando a página
  // muda de altura; nada por quadro.
  useEffect(() => {
    const measure = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const next = [...document.querySelectorAll<HTMLElement>("#conteudo > section[id]")].map((s) =>
        Math.round(Math.min(1, (s.getBoundingClientRect().top + window.scrollY) / total) * 1000) / 1000,
      );
      setMarks((prev) => (prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Na abertura da home o nome já está no h1 e escrito no rio; a marca do
  // canto seria a terceira vez. Ela some enquanto o h1 está na tela e volta
  // quando ele sai. Nas páginas sem #abertura-nome (case) fica sempre.
  useEffect(() => {
    const h1 = document.getElementById("abertura-nome");
    const a = brand.current;
    if (!h1 || !a) return;
    const io = new IntersectionObserver(([e]) => a.toggleAttribute("data-oculta", e.isIntersecting));
    io.observe(h1);
    return () => io.disconnect();
  }, []);
  const links = [
    { href: `${home}#trabalho`, label: nav.work },
    { href: `${home}#agora`, label: nav.now },
    { href: `${home}#contato`, label: nav.contact },
  ];
  const langHref = switchHref ?? nav.switchLangHref;
  const langCode = nav.switchLang === "EN" ? "en" : "pt-BR";

  return (
    <>
      <a href="#conteudo" className="pular">
        {nav.skip}
      </a>
      <div aria-hidden className="moldura" />
      {/* Escurece o topo atrás dos cantos, sumindo em degradê: o texto que rola por baixo não briga com a navegação e não há caixa preta recortando a carta. */}
      <div aria-hidden className={clsx("faixa-topo", photos && "faixa-cantos")} />
      <div aria-hidden className="regua">
        <span className="regua-agua" />
        {marks.map((p, i) => (
          <span key={i} className="regua-marca" style={{ bottom: `${p * 100}%` }} />
        ))}
      </div>

      <p className={clsx("canto canto-quem", photos && "canto-sobre-foto")}>
        <Link ref={brand} href={home} className="canto-marca">
          Edilberto Lima Jr.
        </Link>
        <span className="canto-hora">
          <span aria-hidden className="canto-sep">
            {" · "}
          </span>
          Rio Branco, <LocalTime locale={locale} />
        </span>
      </p>

      <nav aria-label={nav.mainLabel} className={clsx("canto canto-nav", photos && "canto-sobre-foto")}>
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <a href={resume}>{nav.resume}</a>
        <Link href={langHref} hrefLang={langCode} lang={langCode}>
          {nav.switchLang}
        </Link>
      </nav>

      {/* Celular: a mesma noite engrossa embaixo, atrás do botão fixo, para o texto sumir antes de passar por ele. */}
      <div aria-hidden className="faixa-base" />
      <button ref={opener} type="button" className="menu-botao" aria-haspopup="dialog" onClick={() => sheet.current?.showModal()}>
        {nav.menuOpen}
      </button>
      <dialog
        ref={sheet}
        aria-label={nav.menuOpen}
        className="folha"
        // showModal prende o foco e o Esc fecha; ao fechar, o foco volta ao botão.
        onClose={() => opener.current?.focus()}
        onClick={(e) => {
          // Toque no fundo escurecido fecha; link de âncora fecha antes de rolar.
          if (e.target === e.currentTarget || (e.target as Element).closest("a")) sheet.current?.close();
        }}
      >
        <div className="folha-topo">
          <button type="button" className="folha-fechar" onClick={() => sheet.current?.close()}>
            {nav.menuClose}
          </button>
        </div>
        <nav aria-label={nav.mainLabel} className="folha-nav">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <Link href={langHref} hrefLang={langCode} lang={langCode}>
            {nav.switchLang}
          </Link>
        </nav>
        <ContactList items={channels} locale={locale} copied={copied} />
      </dialog>
    </>
  );
}
