"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Content } from "@/content/types";

type Props = { nav: Content["nav"]; home: string; resume: string };

export function SiteHeader({ nav, home, resume }: Props) {
  const resumeLabel = nav.resume;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: `${home}#projetos`, label: nav.work },
    { href: `${home}#trajetoria`, label: nav.career },
    { href: `${home}#servicos`, label: nav.services },
    { href: `${home}#contato`, label: nav.contact },
  ];

  return (
    <>
      <a href="#conteudo" className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-lg bg-gold px-4 py-2.5 font-medium text-bg focus:translate-y-0">
        {nav.skip}
      </a>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled || open ? "border-b border-line bg-bg/70 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="wrap flex h-16 items-center justify-between">
          <Link href={home} className="group flex min-h-11 items-center gap-2.5" onClick={() => setOpen(false)}>
            <span aria-hidden className="grid size-8 place-items-center rounded-full border border-gold/60 font-display text-sm font-bold text-gold transition-colors group-hover:bg-gold group-hover:text-bg">
              E
            </span>
            <span className="font-display text-[0.95rem] font-semibold tracking-tight">Edilberto Lima Jr.</span>
          </Link>

          <nav aria-label={nav.mainLabel} className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-ink">
                {l.label}
              </a>
            ))}
            <a href={resume} className="ml-2 rounded-lg border border-line-strong px-3 py-2 text-sm transition-colors hover:border-gold hover:text-gold">
              {resumeLabel}
            </a>
            <Link href={nav.switchLangHref} hrefLang={nav.switchLang === "EN" ? "en" : "pt-BR"} className="ml-1 rounded-lg px-3 py-2 font-mono text-xs text-muted transition-colors hover:text-ink">
              {nav.switchLang}
            </Link>
          </nav>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-lg md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? nav.menuClose : nav.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="relative block h-3 w-5">
              <span className={clsx("absolute left-0 h-px w-5 bg-ink transition-transform duration-300", open ? "top-1.5 rotate-45" : "top-0")} />
              <span className={clsx("absolute left-0 h-px w-5 bg-ink transition-transform duration-300", open ? "top-1.5 -rotate-45" : "top-3")} />
            </span>
          </button>
        </div>
      </header>

      <div
        id="menu-mobile"
        hidden={!open}
        className="fixed inset-0 z-40 bg-bg/95 pt-20 backdrop-blur-xl md:hidden"
      >
        <nav aria-label={nav.mainLabel} className="wrap flex flex-col gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line py-4 font-display text-3xl font-semibold">
              {l.label}
            </a>
          ))}
          <div className="mt-6 flex gap-3">
            <a href={resume} className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-line-strong">
              {resumeLabel}
            </a>
            <Link href={nav.switchLangHref} className="flex min-h-12 w-20 items-center justify-center rounded-xl border border-line-strong font-mono text-sm">
              {nav.switchLang}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
