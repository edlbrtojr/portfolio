import type { Locale } from "@/content/types";

// Diagramas desenhados no código para projetos de cliente cujas telas não
// podem ser mostradas (dados reais de clientes). Mostram o mecanismo, não a UI.
// Os pulsos usam SMIL (<animateMotion>), que ignora as regras CSS de
// animação; sob reduced-motion eles são escondidos por `.diagram-pulse`
// em globals.css.

type Props = { kind: "order-flow" | "decision-tree" | "gazette-watch"; title: string; locale: Locale };

const LABELS = {
  pt: {
    bot: "bot IA", order: "pedido", board: "painel", delivery: "entrega", q: "modem com luz vermelha?", yes: "sim", no: "não", reboot: "reiniciar ONU", ticket: "abrir chamado", wifi: "testar Wi-Fi",
    gazettes: "diários oficiais", pages: "texto por página", names: "nomes monitorados", search: "busca dos nomes", alert: "aviso", daily: "uma vez por dia", once: "todos numa passada", excerpt: "trecho + link do ato",
  },
  en: {
    bot: "AI bot", order: "order", board: "board", delivery: "delivery", q: "red light on modem?", yes: "yes", no: "no", reboot: "reboot ONT", ticket: "open ticket", wifi: "test Wi-Fi",
    gazettes: "official gazettes", pages: "text by page", names: "monitored names", search: "name search", alert: "alert", daily: "once a day", once: "all in one pass", excerpt: "excerpt + link to the notice",
  },
};

const stroke = "rgb(237 235 230 / 0.22)";

function Node({ x, y, w = 128, label, tone = "ink" }: { x: number; y: number; w?: number; label: string; tone?: "ink" | "gold" | "teal" }) {
  const color = tone === "gold" ? "var(--color-gold)" : tone === "teal" ? "var(--color-teal)" : "var(--color-ink)";
  return (
    <g>
      <rect x={x - w / 2} y={y - 20} width={w} height={40} rx={10} fill="var(--color-surface-2)" stroke={color} strokeOpacity={0.55} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fill={color} fontFamily="var(--font-mono)">
        {label}
      </text>
    </g>
  );
}

function Pulse({ path, dur, delay = 0 }: { path: string; dur: number; delay?: number }) {
  return (
    <circle r={3.5} fill="var(--color-gold)" className="diagram-pulse">
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

export function Diagram({ kind, title, locale }: Props) {
  const t = LABELS[locale];
  if (kind === "order-flow") {
    // WhatsApp → bot (XState) → pedido → painel / entregador
    const p1 = "M110 150 L250 150";
    const p2 = "M330 150 L470 150";
    const p3 = "M550 150 C600 150 600 80 650 80";
    const p4 = "M550 150 C600 150 600 220 650 220";
    return (
      <svg viewBox="0 0 760 300" role="img" aria-label={title} className="h-full w-full">
        {[p1, p2, p3, p4].map((d) => (
          <path key={d} d={d} fill="none" stroke={stroke} strokeWidth={1.5} />
        ))}
        <Node x={70} y={150} w={96} label="WhatsApp" tone="teal" />
        <Node x={290} y={150} w={96} label={t.bot} tone="gold" />
        <Node x={510} y={150} w={96} label={t.order} />
        <Node x={700} y={80} w={100} label={t.board} />
        <Node x={700} y={220} w={100} label={t.delivery} />
        <text x={290} y={196} textAnchor="middle" fontSize={11} fill="var(--color-faint)" fontFamily="var(--font-mono)">
          XState · Redis
        </text>
        <text x={510} y={196} textAnchor="middle" fontSize={11} fill="var(--color-faint)" fontFamily="var(--font-mono)">
          Supabase Realtime
        </text>
        <Pulse path={p1} dur={2.8} />
        <Pulse path={p2} dur={2.8} delay={0.9} />
        <Pulse path={p3} dur={2.8} delay={1.8} />
        <Pulse path={p4} dur={2.8} delay={2.2} />
      </svg>
    );
  }
  if (kind === "gazette-watch") {
    // Convokator: os diários viram texto uma vez por dia; os nomes entram por
    // baixo e são todos procurados na mesma passada; o que casa vira aviso.
    // É o desenho da decisão central do projeto (baixar uma vez, casar todos).
    const g1 = "M146 110 L246 110";
    const g2 = "M394 110 L474 110";
    const g3 = "M606 110 L668 110";
    const g4 = "M540 224 L540 132";
    const sub = (x: number, y: number, label: string) => (
      <text x={x} y={y} textAnchor="middle" fontSize={11} fill="var(--color-faint)" fontFamily="var(--font-mono)">
        {label}
      </text>
    );
    return (
      <svg viewBox="0 0 760 300" role="img" aria-label={title} className="h-full w-full">
        {[g1, g2, g3, g4].map((d) => (
          <path key={d} d={d} fill="none" stroke={stroke} strokeWidth={1.5} />
        ))}
        <Node x={78} y={110} w={136} label={t.gazettes} tone="teal" />
        <Node x={320} y={110} w={148} label={t.pages} />
        <Node x={540} y={110} w={132} label={t.search} tone="gold" />
        <Node x={706} y={110} w={76} label={t.alert} tone="teal" />
        <Node x={540} y={246} w={160} label={t.names} />
        {/* Acima do topo das caixas (y = 90): na altura da seta o rótulo encostava na caixa vizinha. */}
        {sub(196, 80, t.daily)}
        {sub(540, 70, t.once)}
        {sub(672, 156, t.excerpt)}
        <Pulse path={g1} dur={3} />
        <Pulse path={g2} dur={3} delay={1} />
        <Pulse path={g4} dur={3} delay={1.4} />
        <Pulse path={g3} dur={3} delay={2} />
      </svg>
    );
  }
  // Árvore de decisão: pergunta → respostas → passos
  const edges = [
    "M380 62 C380 100 220 100 220 132",
    "M380 62 C380 100 540 100 540 132",
    "M220 172 C220 205 130 205 130 236",
    "M220 172 C220 205 310 205 310 236",
    "M540 172 C540 205 540 205 540 236",
  ];
  return (
    <svg viewBox="0 0 760 290" role="img" aria-label={title} className="h-full w-full">
      {edges.map((d) => (
        <path key={d} d={d} fill="none" stroke={stroke} strokeWidth={1.5} />
      ))}
      <Node x={380} y={42} w={190} label={t.q} tone="gold" />
      <Node x={220} y={152} w={110} label={t.yes} />
      <Node x={540} y={152} w={110} label={t.no} />
      <Node x={130} y={256} w={140} label={t.reboot} tone="teal" />
      <Node x={310} y={256} w={140} label={t.ticket} tone="teal" />
      <Node x={540} y={256} w={150} label={t.wifi} tone="teal" />
      <Pulse path={edges[0] + " " + edges[2].replace("M220 172", "L220 172")} dur={3.2} />
      <Pulse path={edges[1] + " " + edges[4].replace("M540 172", "L540 172")} dur={3.2} delay={1.6} />
    </svg>
  );
}
