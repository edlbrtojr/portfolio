import type { Content } from "./types";

// Regras do texto (revisões de 2026-11-25, pedidas pelo Edilberto):
// - A home é uma página escrita em primeira pessoa, não um molde de seções
//   repetido ("01 · rótulo", título-slogan, chips, botão). Rótulos são uma
//   palavra em minúsculas; serviços entram no texto, não numa grade de cards.
// - Sem faixa de KPI e sem contagem de inventário (bases, pipelines, telas,
//   testes). O lake ganha fonte nova em um dia, e número interno não diz nada
//   a quem lê. Nenhum dos portfólios de referência pesquisados usava isso.
// - Lake e plataforma foram feitos com a equipe do Observatório, com o
//   Edilberto como desenvolvedor principal. Nunca escrever "sozinho" nesses
//   dois. No Milix, sim: ele é o único desenvolvedor.
// - Mostrar o que ele faz sem comparar com outros profissionais.
// - Detalhe de bastidor (chaves, SSO) só no currículo e na stack, não no texto.
// O PDF do currículo segue as mesmas regras; por ser datado, pode citar
// "3 clínicas pagantes".

export const pt: Content = {
  locale: "pt",
  meta: {
    title: "Edilberto Lima Jr. · Full-stack e engenharia de dados",
    description:
      "Desenvolvedor full-stack e engenheiro de dados em Rio Branco, AC. Desenvolvedor principal do data lake e da plataforma de dados do Observatório da Indústria do Acre, e criador do Milix, um SaaS para clínicas.",
  },
  nav: {
    work: "trabalho",
    now: "agora",
    contact: "contato",
    resume: "Currículo",
    switchLang: "EN",
    switchLangHref: "/en",
    skip: "Pular para o conteúdo",
    menuOpen: "Abrir menu",
    menuClose: "Fechar menu",
    mainLabel: "Principal",
  },
  hero: {
    name: "Edilberto Lima Jr.",
    line: "Desenvolvedor full-stack e engenheiro de dados em Rio Branco, no Acre.",
    scrollHint: "Role e sobrevoe o rio",
  },
  bio: [
    [
      "Oi, eu sou o Edilberto. Faço sistemas inteiros: busco o dado onde ele estiver, organizo num ",
      { text: "data lake", term: "Um depósito central onde dados de várias fontes ficam guardados, limpos e prontos para consulta." },
      " e entrego numa tela que alguém usa no dia seguinte.",
    ],
    [
      "Hoje sou o desenvolvedor principal do ",
      { text: "data lake", href: "/projetos/observatorio-data-lake" },
      " e da ",
      { text: "plataforma de dados", href: "/projetos/observatorio-plataforma" },
      " do ",
      { text: "Observatório da Indústria do Acre", href: "https://observatorio.fieac.org.br" },
      ", junto com a equipe de lá. Fora dele, criei o ",
      { text: "Milix", href: "/projetos/milix" },
      ", um sistema para clínicas que eu programo, vendo e atendo.",
    ],
    [
      "Antes de programar, dei aula de inglês na rede estadual. Ficou a mania de explicar as coisas: passe o mouse nas ",
      { text: "palavras sublinhadas", term: "Assim mesmo. Termo técnico aqui vem com legenda." },
      ".",
    ],
  ],
  work: { label: "trabalho", more: "mais coisas que fiz" },
  projects: [
    {
      slug: "observatorio-data-lake",
      title: "Data lake do Observatório",
      line: "Junta dados públicos de emprego, comércio e empresas num lugar só.",
      kicker: "Engenharia de dados · em produção",
      year: "2025–2026",
      role: "Arquitetura e desenvolvimento principal",
      summary:
        "A base de dados do Observatório da Indústria do Acre, no Azure. Recebe dados públicos de emprego, comércio exterior e empresas, limpa, confere e deixa tudo pronto para dashboards e relatórios. Liderei a arquitetura e o desenvolvimento, junto com a equipe do Observatório.",
      stack: ["Python", "PySpark", "Databricks", "Delta Lake", "Unity Catalog", "Azure Data Factory", "Azure Data Explorer", "ADLS Gen2", "KQL"],
      links: [],
      shots: [
        {
          src: "/images/projects/capturas/lake-panorama-exportacoes.png",
          alt: "Capa da apresentação Panorama das Exportações do Acre 2021–2025, com exportações subindo de US$ 48,8 mi para US$ 98,8 mi",
          width: 1920,
          height: 1080,
        },
      ],
      stage: "lake",
      details: {
        overview:
          "O Observatório da Indústria do Acre publica análises sobre emprego, comércio exterior e empresas do estado, e tudo isso depende de dado público. O lake faz a parte pesada: baixa a fonte, guarda o original, limpa, confere e publica no Azure Data Explorer. É de lá que a plataforma, os boletins e os relatórios consultam, em KQL.",
        decisions: [
          {
            problem: "Testar pipeline direto na nuvem custa dinheiro a cada execução.",
            choice: "Escrevi um engine em Python que roda igual na minha máquina e no Databricks. Todo pipeline passa pelos testes locais antes de subir, sem gastar nada.",
          },
          {
            problem: "Cada órgão publica num formato diferente.",
            choice: "Toda fonte segue o mesmo molde de estágios (bronze, silver e gold), com catálogos separados para desenvolvimento e produção. Fonte nova repete o molde em vez de inventar outro.",
          },
          {
            problem: "Reprocessar um mês não pode duplicar linha.",
            choice: "As cargas são idempotentes e cada arquivo bruto ganha um hash SHA-256. Rodar de novo dá o mesmo resultado.",
          },
          {
            problem: "O Azure Data Explorer cobra por hora ligado.",
            choice: "Uma automação desliga o cluster fora do horário de uso.",
          },
        ],
        results: [
          "Em produção, orquestrado pelo Azure Data Factory com gatilhos diários e mensais.",
          "Processa RAIS, CAGED, Comex Stat, Receita Federal, INSS, IBGE e outras fontes públicas.",
          "Alimenta os dashboards da plataforma, o boletim mensal de comércio exterior e o relatório Panorama das Exportações do Acre 2021–2025.",
        ],
      },
    },
    {
      slug: "observatorio-plataforma",
      title: "Plataforma do Observatório",
      line: "Onde empresários e gestores do Acre consultam esses dados.",
      kicker: "Full-stack · em produção",
      year: "2025–2026",
      role: "Desenvolvedor principal",
      summary:
        "O site onde empresários e gestores consultam os dados do Observatório. Dashboards de emprego, salário, exportação e empresas do Acre, relatórios e resumos com IA, sem precisar baixar uma planilha. Sou o desenvolvedor principal, junto com a equipe do Observatório.",
      stack: ["Next.js", "React", "TypeScript", "PostgreSQL", "Drizzle ORM", "Azure Data Explorer", "Microsoft Entra ID", "Vercel AI SDK", "Vitest", "Playwright"],
      links: [{ label: "observatorio.fieac.org.br", href: "https://observatorio.fieac.org.br" }],
      shots: [
        {
          src: "/images/projects/capturas/plataforma-landing.png",
          alt: "Página inicial do Observatório da Indústria do Acre, com um globo destacando o Acre",
          width: 1440,
          height: 900,
        },
        {
          src: "/images/projects/capturas/plataforma-radar-panorama.png",
          alt: "Dashboard Radar de Salários: remuneração mediana, cobertura e distribuição dos vínculos da RAIS por faixa de salário mínimo",
          width: 1440,
          height: 1000,
          // O dashboard termina em ~700 px; o resto da captura é fundo branco.
          frame: "2 / 1",
        },
      ],
      stage: "dashboards",
      details: {
        overview:
          "A plataforma tem um portal público, uma área logada com dashboards, relatórios e apresentações, e um painel de administração. Todo número de dashboard vem do lake, consultado na hora no Azure Data Explorer. Há dashboards de emprego formal, contratações, comércio exterior, empresas, acidentes de trabalho e finanças municipais, entre outros.",
        decisions: [
          {
            problem: "Copiar o lake para o banco da aplicação dobraria o custo e deixaria número velho na tela.",
            choice: "As consultas vão em KQL direto ao Azure Data Explorer, com o filtro aplicado lá. A aplicação recebe só o resultado.",
          },
          {
            problem: "Nem todo usuário pode ver tudo, e alguns acessos têm data para acabar.",
            choice: "Login com Microsoft Entra ID e permissão por usuário ou grupo, recurso e ação, com vigência e trilha de auditoria.",
          },
          {
            problem: "Usar IA sobre os dados sem a conta sair do controle.",
            choice: "Vercel AI SDK com Anthropic, OpenAI e Google atrás de um limite de uso.",
          },
          {
            problem: "Com dezenas de módulos, uma mudança quebra outra sem ninguém ver.",
            choice: "Testes com Vitest e Playwright, e CI/CD no GitHub Actions e no Azure DevOps com desenvolvimento, homologação e produção separados.",
          },
        ],
        results: [
          "No ar em observatorio.fieac.org.br.",
          "Além dos dashboards: newsletter, CMS de notícias, apresentações compartilhadas por link assinado e um hub de demandas.",
        ],
      },
    },
    {
      slug: "milix",
      title: "Milix",
      line: "Meu sistema para clínicas, com atendimento por IA no WhatsApp.",
      tag: "produto próprio",
      kicker: "SaaS próprio · com clientes pagantes",
      year: "2025–2026",
      role: "Fundador e único desenvolvedor",
      summary:
        "Sistema de gestão para clínicas: agenda, prontuário, financeiro e nota fiscal, com um agente de IA que atende os pacientes no WhatsApp. É o meu produto. Faço o código, a venda e o suporte, e ele já tem clínicas pagando.",
      stack: ["Next.js", "TypeScript", "Convex", "Asaas", "WhatsApp Cloud API", "OpenAI", "Vercel AI SDK", "Vitest", "Playwright"],
      links: [{ label: "milix.app", href: "https://milix.app" }],
      shots: [
        {
          src: "/images/projects/capturas/milix-demo.png",
          alt: "Demonstração do Milix com dados fictícios: agenda do dia ao lado de uma conversa de WhatsApp em que a paciente confirma o horário",
          width: 1280,
          height: 800,
        },
        {
          src: "/images/projects/capturas/milix-landing.png",
          alt: "Página inicial do Milix: Sua clínica. Tudo em sintonia.",
          width: 1280,
          height: 800,
        },
      ],
      stage: "phone",
      details: {
        overview:
          "O Milix cobre o caminho do paciente, da primeira mensagem no WhatsApp ao fechamento do caixa. Cada clínica é um cliente isolado e pode ter várias filiais. A primeira versão, o Smilix, rodava em Supabase, Stripe e Docker numa VPS. Reescrevi a base numa arquitetura mais fácil de testar e de evoluir.",
        decisions: [
          {
            problem: "Uma clínica não pode ver o dado de outra, nem por engano.",
            choice: "Toda tabela carrega a clínica, e toda chamada pública passa por um único ponto de entrada que confere identidade, permissão e plano, nessa ordem.",
          },
          {
            problem: "Com o código crescendo rápido, cedo ou tarde aparece um atalho.",
            choice: "Um teste estrutural quebra o build se surgir chamada pública fora desse ponto de entrada.",
          },
          {
            problem: "Plano, add-on e período de teste precisam cobrar sozinhos.",
            choice: "Cobrança recorrente no Asaas, com planos mensais e anuais, add-ons, período de teste e webhooks.",
          },
          {
            problem: "Paciente manda áudio e escreve o nome do procedimento do jeito dele.",
            choice: "Agente na Cloud API oficial da Meta, com transcrição de áudio, busca semântica por embeddings e um gateway próprio de LLM.",
          },
          {
            problem: "Evoluir sozinho sem quebrar o que já está em produção.",
            choice: "Testes com Vitest e Playwright no produto inteiro, e cada decisão de arquitetura registrada num ADR.",
          },
        ],
        results: [
          "Clínicas pagantes usando no dia a dia.",
          "O ciclo inteiro de um produto: construir, vender, implantar com importação de pacientes e dar suporte.",
        ],
      },
    },
    {
      slug: "distribuidora-flow",
      title: "Distribuidora Flow",
      line: "Pedidos pelo WhatsApp, caixa e entregas de uma distribuidora de bebidas.",
      tag: "freelance",
      kicker: "Freelance · em produção",
      year: "2025",
      role: "Desenvolvedor full-stack",
      summary:
        "Caixa, estoque e pedidos de uma distribuidora de bebidas. Um chatbot recebe os pedidos no WhatsApp, o painel mostra cada um em tempo real e o entregador recebe a rota no celular.",
      stack: ["React", "TypeScript", "Supabase", "OpenAI", "WhatsApp API", "Redis", "XState", "Google Maps"],
      links: [],
      shots: [],
      diagram: "order-flow",
      stage: "tree",
      details: {
        overview:
          "Sistema para uma distribuidora de bebidas: frente de caixa, estoque e atendimento pelo WhatsApp. O chatbot conversa com o cliente, monta o pedido e avisa cada etapa pela API oficial do WhatsApp. No painel, os pedidos andam num quadro Kanban em tempo real, e o entregador recebe a rota pelo Google Maps.",
        decisions: [
          {
            problem: "Chatbot que inventa produto ou preço dá prejuízo.",
            choice: "Toda resposta passa por validação com Zod, limiar de confiança e guardrails contra alucinação.",
          },
          {
            problem: "Conversa e pedido têm muitas etapas, e é fácil um deles se perder no meio.",
            choice: "Uma máquina de estados em XState controla o fluxo da conversa e as fases do pedido.",
          },
          {
            problem: "WhatsApp, painel e entregador precisam ver o mesmo pedido ao mesmo tempo.",
            choice: "Supabase Realtime em todas as telas e sessões do bot no Redis, com expiração.",
          },
          {
            problem: "Casco retornável some quando ninguém controla.",
            choice: "Controle de retornáveis com rastreamento e aviso automático.",
          },
        ],
        results: [
          "Em uso diário no caixa, no estoque e nos pedidos.",
          "Pedidos de clientes reais entram pelo chatbot sem ninguém digitar.",
          "Cada pedido é rastreado da mensagem no WhatsApp até a entrega.",
        ],
      },
    },
    {
      slug: "biblioteca-de-processos",
      title: "Biblioteca de Processos",
      line: "Árvores de decisão para o suporte de um provedor de internet.",
      tag: "freelance",
      kicker: "Freelance · em produção",
      year: "2025",
      role: "Desenvolvedor full-stack",
      summary:
        "Base de conhecimento de um provedor de internet. O atendente segue uma árvore de decisão passo a passo, e o gestor monta e corrige esses fluxos num editor visual, sem chamar desenvolvedor.",
      stack: ["Next.js", "React", "TypeScript", "Drizzle ORM", "PostgreSQL", "NextAuth", "React Flow", "TipTap"],
      links: [],
      shots: [],
      diagram: "decision-tree",
      stage: "tree",
      details: {
        overview:
          "O suporte de um provedor de internet precisava que todo atendente resolvesse o mesmo problema do mesmo jeito. A Biblioteca guarda os processos como árvores de decisão: o atendente responde às perguntas e chega à solução. Gestores editam os fluxos num editor visual e escrevem artigos num editor de texto rico. Cada setor vê o que é dele.",
        decisions: [
          {
            problem: "Gestor sem formação técnica precisa montar fluxo sozinho.",
            choice: "Editor em React Flow com nós próprios e layout automático com dagre. O gestor arrasta e liga os passos.",
          },
          {
            problem: "Cada setor só pode ver o próprio conteúdo.",
            choice: "NextAuth com JWT e permissão por setor filtrando todo o conteúdo.",
          },
          {
            problem: "Saber quais processos ajudam de verdade.",
            choice: "O visualizador registra o caminho do atendente pelos nós, e um log de acesso mostra o que é mais usado.",
          },
        ],
        results: [
          "Em produção no servidor do cliente.",
          "Gestores criam e atualizam processos sem depender de desenvolvedor.",
          "O atendimento segue o mesmo padrão em todos os setores.",
        ],
      },
    },
    {
      slug: "vizu-eleicoes",
      title: "Vizu Eleições",
      line: "As eleições no Acre, do estado inteiro até a seção eleitoral.",
      tag: "projeto pessoal",
      kicker: "Projeto pessoal · dados públicos",
      year: "2026",
      role: "Autor",
      summary:
        "Os resultados das eleições no Acre, do estado inteiro até a seção eleitoral. Mapa, ranking e comparação de candidatos com dados do TSE, sobre um ETL em Python que gera sempre o mesmo resultado.",
      stack: ["Python", "Next.js", "TypeScript", "Convex", "MapLibre", "Vitest", "Playwright"],
      links: [],
      shots: [
        {
          src: "/images/projects/capturas/vizu-mapa.png",
          alt: "Mapa municipal do Acre colorido pela opção mais votada para governador, com resumo de votos ao lado",
          width: 1440,
          height: 900,
        },
      ],
      // A hélice fica para a trajetória; mapa e ranking lembram painéis.
      stage: "dashboards",
      details: {
        overview:
          "Um pipeline em Python prepara os resultados do TSE, importa no Convex e mostra em mapas, rankings e comparações, do estado inteiro até uma seção, com exportação em CSV.",
        decisions: [
          {
            problem: "Rodar o ETL duas vezes não pode dar resultados diferentes.",
            choice: "Preparação determinística com hashes SHA-256: a segunda execução gera exatamente os mesmos arquivos.",
          },
          {
            problem: "Importação longa cai no meio.",
            choice: "Importação em lotes com ponto de retomada, que pode ser repetida sem duplicar.",
          },
          {
            problem: "Total errado num mapa eleitoral é pior do que mapa nenhum.",
            choice: "Os totais são conferidos automaticamente entre o Python e o banco, e o mapa usa a malha municipal do IBGE 2025 no MapLibre.",
          },
        ],
        results: ["660 locais de votação, 22 municípios e 341 candidatos, consultáveis até a seção."],
      },
    },
  ],
  archive: [
    { title: "Smilix", year: "2025", description: "A primeira versão do Milix, só para dentistas." },
    { title: "Dados fiscais de 21 prefeituras", year: "2026", description: "Os portais de transparência de 21 municípios do Acre numa base só." },
    { title: "Apresentações de dados", year: "2026", description: "Apresentações do Observatório em HTML, como o Panorama das Exportações do Acre." },
    { title: "Skills para agentes de IA", year: "2026", description: "Ensina o Claude Code e o Codex a trabalhar do jeito da equipe." },
    { title: "Busca Diários", year: "2024", description: "Procura termos dentro dos diários oficiais do Acre.", href: "https://github.com/edlbrtojr/BuscaDiarios" },
    { title: "Service desk do Sistema FIEAC", year: "2024", description: "Tirou os pedidos internos do e-mail e do papel." },
    { title: "Intranet do Sistema FIEAC", year: "2024", description: "Refeita no SharePoint moderno, com web parts próprias." },
    { title: "Gerador de QR Code", year: "2026", description: "QR codes para Instagram, WhatsApp, Pix e Wi-Fi." },
  ],
  now: {
    label: "agora",
    body: [
      [
        "No Observatório, sigo colocando bases novas no lake e painéis novos na plataforma. No Milix, cuido das clínicas que já usam o sistema e do que elas pedem.",
      ],
      [
        "Também pego projetos para empresas: sistemas sob medida, atendimento com IA no WhatsApp, ",
        { text: "dashboards", term: "Painéis com os números do negócio, atualizados sozinhos, no lugar da planilha que alguém monta toda semana." },
        " e automações. Se a sua empresa roda em planilha e WhatsApp, ",
        { text: "me chama", href: "whatsapp" },
        ".",
      ],
    ],
    signature: "Rio Branco, AC · novembro de 2026",
  },
  past: {
    label: "antes",
    hint: "passe o mouse ou toque nos anos",
    steps: [
      { year: "2016", title: "Letras", text: "Licenciatura em língua inglesa na Universidade Federal do Acre." },
      { year: "2021", title: "Sala de aula", text: "Professor de inglês na rede estadual, enquanto cursava Sistemas de Informação na Estácio. No mesmo ano, um estágio de help desk na Uninorte." },
      { year: "2023", title: "Suporte", text: "Estagiário de TI na UNITEC, do Sistema FIEAC: chamados e os primeiros aplicativos internos." },
      { year: "2024", title: "Automação", text: "Assistente de TI: Power Apps, Power Automate, Python e a nova intranet do Sistema FIEAC." },
      { year: "2025", title: "Dados", text: "Analista de TI no Observatório da Indústria, à frente do data lake e da plataforma. E o Milix, por conta própria." },
    ],
    tools: "No dia a dia: Python, PySpark, Databricks, Azure, TypeScript, Next.js e PostgreSQL.",
  },
  contact: {
    label: "contato",
    body: [
      [
        "O jeito mais rápido de falar comigo é pelo ",
        { text: "WhatsApp", href: "whatsapp" },
        ". Também respondo no ",
        { text: "edlbrtojr@gmail.com", href: "email" },
        ". O currículo está em ",
        { text: "português", href: "resume:pt" },
        " e em ",
        { text: "inglês", href: "resume:en" },
        ", e o resto, no ",
        { text: "LinkedIn", href: "https://www.linkedin.com/in/edilbertolimajr/" },
        " e no ",
        { text: "GitHub", href: "https://github.com/edlbrtojr" },
        ".",
      ],
    ],
    copied: "copiado",
  },
  ui: {
    visitSite: "Abrir o site",
    stack: "Stack",
    role: "Papel",
    back: "Voltar ao início",
    overview: "Contexto",
    decisions: "Decisões",
    problem: "Problema",
    choice: "O que fiz",
    results: "Onde está hoje",
    nextProject: "Próximo projeto",
    footer: "Feito à beira do rio Acre, com Next.js e three.js.",
    localTime: "em Rio Branco",
    notFoundTitle: "Esse dado não chegou ao gold.",
    notFoundBody: "A página que você procurou não existe ou mudou de endereço.",
    notFoundCta: "Voltar ao início",
  },
};
