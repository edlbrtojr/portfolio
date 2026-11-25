"use client";

import { useEffect, useRef, useState } from "react";
import { COLUMN_END } from "../scene/river-curve";
import { aimLantern } from "../scene/store";
import { useWideNotes } from "./geometry";

/**
 * Nota de professor. O termo fica no texto; a nota fica sempre no DOM, logo
 * depois do parágrafo (ver Prose), então leitor de tela, buscador e quem não
 * usa mouse leem as duas coisas.
 *
 * - A partir de 1100 px a nota mora na coluna da margem, em lápis (40%). Mouse
 *   ou foco no termo desenham a linha de chamada até ela e passam a nota a
 *   tinta. A linha é calculada no hover, nunca por quadro.
 * - Abaixo disso vira rodapé de livro: o termo é um botão com número, e a nota
 *   abre logo embaixo do parágrafo.
 */
/**
 * A linha da nota: o bloco de largura total em relação ao qual ela é
 * posicionada na margem. Na home é o pai (.nota-linha); no case a nota mora
 * dentro do <dd> e quem posiciona é a .decisao, por isso offsetParent.
 */
function rowOf(note: HTMLElement | null) {
  return (note?.offsetParent as HTMLElement | null) ?? note?.parentElement ?? null;
}

/**
 * Põe cada nota da linha na altura do seu termo e, se duas caem na mesma
 * altura (três termos na mesma frase), empilha a seguinte logo abaixo da
 * anterior, com 10 px de folga. Sem isso as notas se sobrepunham e viravam
 * um borrão. Mede só na montagem e quando a linha muda de tamanho.
 */
function layoutNotes(row: HTMLElement) {
  const top = row.getBoundingClientRect().top;
  const placed: [HTMLElement, number][] = [];
  let floor = -Infinity;
  for (const note of row.querySelectorAll<HTMLElement>(".nota-margem[id]")) {
    const t = row.querySelector(`[data-note="${note.id}"]`);
    if (!t) continue;
    const want = t.getBoundingClientRect().top - top;
    const at = Math.max(want, floor);
    placed.push([note, at]);
    floor = at + note.offsetHeight + 10;
  }
  // Pilha mais alta que o parágrafo (três termos na última linha de "agora"):
  // ela sobe o que passar, até o topo do bloco de texto ou até a última nota
  // de um parágrafo anterior. Descendo, ela invadia a seção seguinte e caía
  // em cima da nota de "antes".
  const block = row.parentElement;
  let room = block ? top - block.getBoundingClientRect().top : 0;
  for (let prev = row.previousElementSibling; prev; prev = prev.previousElementSibling) {
    const notes = prev.querySelectorAll(".nota-margem[id]");
    if (!notes.length) continue;
    room = top - Math.max(...[...notes].map((n) => n.getBoundingClientRect().bottom)) - 10;
    break;
  }
  const lift = Math.max(0, Math.min(floor - 10 - row.offsetHeight, room));
  for (const [note, at] of placed) note.style.setProperty("--nota-top", `${at - lift}px`);
}

export function NoteTerm({ id, n, text }: { id: string; n: number; text: string }) {
  const wide = useWideNotes();
  const term = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const note = document.getElementById(id);
    const row = rowOf(note);
    if (!wide || !note || !row) return;
    const place = () => layoutNotes(row);
    place();
    const ro = new ResizeObserver(place);
    ro.observe(row);
    return () => ro.disconnect();
  }, [wide, id]);

  // Rodapé: o estado do botão manda no atributo da nota.
  useEffect(() => {
    const note = document.getElementById(id);
    if (!note) return;
    note.toggleAttribute("data-aberta", !wide && open);
  }, [wide, open, id]);

  const show = () => {
    const t = term.current;
    const note = document.getElementById(id);
    const row = rowOf(note);
    if (!t || !note || !row) return;
    note.setAttribute("data-ativa", "");
    const svg = row.querySelector<SVGSVGElement>(`[data-chamada="${id}"]`);
    const path = svg?.querySelector("path");
    if (svg && path) {
      // Do canto de cima do fim do termo (última linha, se ele quebrar) até o
      // começo da nota. A linha sobe para a entrelinha logo acima e corre
      // por ela até passar do fim da coluna; só então cruza o rio. Saindo de
      // baixo e na horizontal, ela passava sob as palavras seguintes da
      // mesma linha ("dashboards e automações") e lia como mais um
      // sublinhado, ligando a nota errada.
      const rr = row.getBoundingClientRect();
      const rects = t.getClientRects();
      const tr = rects[rects.length - 1] ?? t.getBoundingClientRect();
      const nr = note.getBoundingClientRect();
      const lh = parseFloat(getComputedStyle(t).lineHeight) || tr.height * 1.45;
      const f = (v: number) => v.toFixed(1);
      const x1 = tr.right - rr.left + 2;
      const y1 = tr.top - rr.top + tr.height * 0.25;
      // Meio da entrelinha acima: metade do espaço que sobra entre a caixa do texto e a altura da linha.
      const gy = tr.top - rr.top - Math.max(2, (lh - tr.height) / 2);
      const xc = Math.max(x1 + 16, COLUMN_END * document.documentElement.clientWidth - rr.left + 12);
      const x2 = nr.left - rr.left - 10;
      const y2 = nr.top - rr.top + 11;
      const dx = x2 - xc;
      path.setAttribute(
        "d",
        `M${f(x1)} ${f(y1)} Q${f(x1 + 3)} ${f(gy)} ${f(x1 + 14)} ${f(gy)} L${f(xc)} ${f(gy)} C${f(xc + dx * 0.5)} ${f(gy)} ${f(x2 - dx * 0.3)} ${f(y2)} ${f(x2)} ${f(y2)}`,
      );
      svg.setAttribute("data-ativa", "");
    }
    aimLantern(note, true);
  };

  const hide = () => {
    const note = document.getElementById(id);
    note?.removeAttribute("data-ativa");
    rowOf(note)?.querySelector(`[data-chamada="${id}"]`)?.removeAttribute("data-ativa");
    aimLantern(null);
  };

  const num = (
    <sup aria-hidden className="nota-num">
      {n}
    </sup>
  );

  if (!wide)
    return (
      <button
        type="button"
        ref={(el) => {
          term.current = el;
        }}
        className="nota-termo nota-botao"
        aria-expanded={open}
        aria-controls={id}
        aria-describedby={id}
        onClick={() => setOpen((v) => !v)}
      >
        {text}
        {num}
      </button>
    );

  // Link de nota de rodapé, não <span tabIndex>: NVDA e VoiceOver ignoram
  // aria-describedby em elemento genérico focável, e quem navegava por Tab
  // ouvia só o termo. O clique não rola até a nota: ela já está ao lado, e
  // pular para ela tiraria o parágrafo da tela.
  return (
    <a
      ref={(el) => {
        term.current = el;
      }}
      href={`#${id}`}
      data-note={id}
      aria-describedby={id}
      className="nota-termo"
      onClick={(e) => e.preventDefault()}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {text}
      {num}
    </a>
  );
}

/** O corpo da nota e a linha de chamada (vazia até o primeiro hover). */
export function MarginNote({ id, n, text }: { id: string; n: number; text: string }) {
  return (
    <>
      <svg aria-hidden className="nota-chamada" data-chamada={id}>
        <path pathLength={1} />
      </svg>
      <span id={id} role="note" className="nota-margem">
        <span className="nota-lapis">
          <sup className="nota-num">{n}</sup> {text}
        </span>
        {/* Cópia em tinta por cima do lápis, revelada linha a linha. */}
        <span aria-hidden className="nota-tinta">
          <sup className="nota-num">{n}</sup> {text}
        </span>
      </span>
    </>
  );
}
