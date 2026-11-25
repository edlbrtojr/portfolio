import type { Glossary, Rich } from "@/content/types";

/**
 * Marca o jargão de uma página com nota de professor: a primeira ocorrência
 * de cada termo do glossário na página inteira (não em cada parágrafo) vira
 * `{ text, term }`, que o RichText desenha com número e nota na margem.
 *
 * `maxPerText`: no máximo duas notas por parágrafo. Com mais, as notas da
 * margem se empilham além da altura do parágrafo e descolam da linha a que
 * se referem. Os termos que sobram ficam para a próxima ocorrência.
 */
export function annotate(texts: string[], glossary: Glossary, maxPerText = 2): Rich[] {
  const used = new Set<string>();
  return texts.map((text) => {
    let parts: Rich = [text];
    let count = 0;
    for (const { term, note } of glossary) {
      if (count >= maxPerText) break;
      if (used.has(term)) continue;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (typeof p !== "string") continue;
        const at = findWord(p, term);
        if (at < 0) continue;
        const piece = [p.slice(0, at), { text: term, term: note }, p.slice(at + term.length)].filter((x) => x !== "");
        parts = [...parts.slice(0, i), ...piece, ...parts.slice(i + 1)];
        used.add(term);
        count += 1;
        break;
      }
    }
    return parts;
  });
}

const letter = /[\p{L}\p{N}]/u;

/** Posição do termo como palavra inteira ("pipeline" não casa dentro de "pipelines"). */
export function findWord(text: string, term: string) {
  let from = 0;
  while (from <= text.length) {
    const at = text.indexOf(term, from);
    if (at < 0) return -1;
    const before = at > 0 ? text[at - 1] : "";
    const after = text[at + term.length] ?? "";
    if (!letter.test(before) && !letter.test(after)) return at;
    from = at + 1;
  }
  return -1;
}
