import type { Content } from "./types";

// Regras do texto (revisões de 2026-11-25, pedidas pelo Edilberto):
// - Sem faixa de KPI e sem contagem de inventário (bases, pipelines, telas,
//   testes). O lake ganha fonte nova em um dia, e número interno não diz nada
//   a quem lê. Nenhum dos 20 portfólios de referência pesquisados usava isso.
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
    work: "Projetos",
    career: "Trajetória",
    services: "Serviços",
    contact: "Contato",
    resume: "Currículo",
    switchLang: "EN",
    switchLangHref: "/en",
    skip: "Pular para o conteúdo",
    menuOpen: "Abrir menu",
    menuClose: "Fechar menu",
    mainLabel: "Principal",
  },
  hero: {
    eyebrow: "Rio Branco, Acre · aberto a vagas e freelas",
    name: "Edilberto Lima Jr.",
    role: "Desenvolvedor full-stack e engenheiro de dados",
    lead: "Pego o dado do jeito que o governo publica e entrego do jeito que um empresário entende. Sou o desenvolvedor principal do data lake e da plataforma do Observatório da Indústria do Acre, e criei o Milix, um sistema para clínicas.",
    ctaPrimary: "Ver projetos",
    ctaWhatsapp: "Falar no WhatsApp",
    scrollHint: "Role e acompanhe o dado",
  },
  path: {
    eyebrow: "00 · o caminho",
    title: "Do arquivo bruto à tela.",
    body: "Quase todo trabalho meu começa num arquivo cru e termina num gráfico que alguém abre na segunda de manhã. Gosto de cuidar do caminho inteiro entre os dois: a coleta, o modelo de dados e a aplicação.",
    steps: [
      { value: "Coletar", label: "Python e PySpark buscando dados de órgãos públicos, APIs e sistemas internos" },
      { value: "Modelar", label: "Camadas bronze, silver e gold no Databricks, prontas para consulta" },
      { value: "Mostrar", label: "Dashboards e aplicações em Next.js para quem precisa decidir" },
      { value: "Automatizar", label: "Rotinas agendadas e atendimento com IA no WhatsApp" },
    ],
  },
  featured: [
    {
      slug: "observatorio-data-lake",
      title: "Data lake do Observatório da Indústria",
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
      title: "Plataforma de dados do Observatório",
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
      title: "Milix: gestão para clínicas",
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
  ],
  more: {
    eyebrow: "04 · sob medida",
    title: "Feitos sob encomenda e usados todo dia.",
    body: "Dois sistemas que fiz como freelancer e que seguem em produção, e um projeto pessoal com os dados públicos das eleições.",
    projects: [
      {
        slug: "distribuidora-flow",
        title: "Distribuidora Flow",
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
        stage: "tree",
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
  },
  archive: {
    title: "Arquivo",
    items: [
      {
        title: "Smilix",
        year: "2025",
        description: "A primeira versão do Milix, só para dentistas, com Supabase e RLS, Stripe e bot de WhatsApp em Docker numa VPS.",
        stack: ["Next.js", "Supabase", "Stripe", "Redis"],
      },
      {
        title: "Dados fiscais de 21 prefeituras",
        year: "2026",
        description: "Junta os portais de transparência de 21 municípios do Acre numa base só, com 2,09 milhões de registros.",
        stack: ["Python", "Pydantic", "DuckDB", "Streamlit"],
      },
      {
        title: "Apresentações de dados do Observatório",
        year: "2026",
        description: "Apresentações em HTML que abrem em qualquer navegador, com three.js e CI que valida cada versão. Entre elas, o Panorama das Exportações do Acre.",
        stack: ["React", "three.js", "Motion"],
      },
      {
        title: "Catálogo de skills para agentes",
        year: "2026",
        description: "Ensina o Claude Code e o Codex a modelar, ingerir e montar dashboards do jeito da equipe, com casos de avaliação para cada skill.",
        stack: ["Node.js", "YAML", "Azure DevOps"],
      },
      {
        title: "Busca Diários",
        year: "2024",
        description: "Baixa os diários oficiais do Acre e do Tribunal de Justiça e procura termos dentro dos PDFs.",
        stack: ["Python", "Selenium", "pdfplumber"],
        href: "https://github.com/edlbrtojr/BuscaDiarios",
      },
      {
        title: "Service desk e fluxo de documentos",
        year: "2024–2025",
        description: "App de demandas entre setores e aprovação de documentos com assinatura, que tiraram os pedidos internos do Sistema FIEAC do e-mail e do papel.",
        stack: ["Power Apps", "Power Automate", "SharePoint"],
      },
      {
        title: "Intranet do Sistema FIEAC",
        year: "2024",
        description: "A intranet refeita no SharePoint moderno, com web parts próprias em SharePoint Framework.",
        stack: ["SPFx", "TypeScript", "React"],
      },
      {
        title: "Gerador de QR Code",
        year: "2026",
        description: "QR codes personalizados para Instagram, WhatsApp, Pix e Wi-Fi, em PNG ou SVG.",
        stack: ["Vite", "TypeScript"],
      },
    ],
  },
  career: {
    eyebrow: "05 · trajetória",
    title: "De professor de inglês a engenheiro de dados.",
    body: "Dei aula de inglês na rede estadual enquanto cursava Sistemas de Informação. Entrei na TI como estagiário de suporte e cheguei à engenharia de dados passando pela automação. Da sala de aula ficou o hábito de explicar: apresento uma arquitetura para quem não é técnico e escrevo documentação pensando em quem vem depois.",
    positions: [
      {
        title: "Analista de TI · engenharia de dados e full-stack",
        company: "Observatório da Indústria, Sistema FIEAC",
        period: "out/2025 – atual",
        summary: "Desenvolvedor principal do data lake e da plataforma de dados. Também organizei como a equipe usa agentes de IA no código.",
        current: true,
      },
      {
        title: "Fundador e desenvolvedor",
        company: "Milix",
        period: "ago/2025 – atual",
        summary: "Meu SaaS para clínicas: produto, venda, implantação e suporte.",
        current: true,
      },
      {
        title: "Desenvolvedor full-stack freelance",
        company: "Autônomo",
        period: "2025 – atual",
        summary: "Sistemas em produção para uma distribuidora de bebidas e um provedor de internet.",
        current: true,
      },
      {
        title: "Assistente de TI",
        company: "UNITEC, Sistema FIEAC",
        period: "jan/2024 – out/2025",
        summary: "Apps em Power Apps, fluxos no Power Automate, automações em Python e a nova intranet em SPFx.",
      },
      {
        title: "Estagiário de TI",
        company: "UNITEC, Sistema FIEAC",
        period: "set/2023 – dez/2023",
        summary: "Suporte, chamados e meus primeiros apps internos em Power Platform.",
      },
    ],
    earlier: "Antes disso: professor de inglês na rede estadual do Acre (2021–2024) e estagiário de help desk na Uninorte (2021).",
    educationTitle: "Formação",
    education: [
      { degree: "Bacharelado em Sistemas de Informação", institution: "Estácio-Unimeta", period: "2021–2024" },
      { degree: "Licenciatura em Língua Inglesa", institution: "Universidade Federal do Acre", period: "2016–2019" },
    ],
    certificationsTitle: "Cursos",
    certifications: "Data Analytics e Gestão de Projetos pela Universidade Corporativa da Indústria. Python avançado, Django, SQL avançado e Power BI pela Alura.",
    skillsTitle: "Ferramentas",
    skills: [
      { group: "Dados", items: ["Python", "SQL", "PySpark", "KQL", "Databricks", "Delta Lake", "Azure Data Factory", "Azure Data Explorer", "DuckDB", "Power BI"] },
      { group: "Aplicação", items: ["TypeScript", "Next.js", "React", "Node.js", "PostgreSQL", "Drizzle", "Prisma", "Convex", "Supabase", "Tailwind CSS"] },
      { group: "IA", items: ["Vercel AI SDK", "OpenAI", "Anthropic", "Embeddings", "Agentes", "Claude Code", "Codex"] },
      { group: "Nuvem e qualidade", items: ["Azure", "Key Vault", "Bicep", "Vercel", "Docker", "GitHub Actions", "Azure DevOps", "Vitest", "Playwright", "pytest"] },
    ],
  },
  services: {
    eyebrow: "06 · para sua empresa",
    title: "Se a sua empresa roda em planilha e WhatsApp, eu sei por onde começar.",
    body: "Atendo empresas pequenas e grandes, do primeiro rascunho ao sistema no ar. Você me conta como o trabalho acontece hoje, eu proponho o menor sistema que resolve, e a gente cresce a partir dele.",
    items: [
      { title: "Sistema sob medida", description: "Caixa, estoque, agenda, base de conhecimento. O software segue o seu processo, e não o contrário." },
      { title: "Atendimento com IA no WhatsApp", description: "Um agente que recebe pedido, marca horário e tira dúvida, sem inventar preço nem produto." },
      { title: "Dados e dashboards", description: "Suas planilhas e sistemas numa base só, e um painel com os números que importam para o seu negócio." },
      { title: "Automação", description: "Aprovação de documento, relatório, e-mail repetido. O trabalho manual acontece sozinho, com registro de tudo." },
      { title: "SaaS do zero", description: "Do MVP ao produto cobrando: várias empresas no mesmo sistema, planos, pagamento recorrente e nota fiscal." },
      { title: "Integrações", description: "Pagamento, nota fiscal, WhatsApp, ERP e qualquer API, ligados ao que você já usa." },
    ],
    cta: "Contar meu projeto",
  },
  contact: {
    eyebrow: "07 · contato",
    title: "Tem uma vaga ou um projeto? Me chama.",
    body: "Respondo rápido no WhatsApp e no e-mail. Se for vaga, o currículo em PDF está logo aqui embaixo.",
    whatsapp: "WhatsApp",
    email: "edlbrtojr@gmail.com",
    resume: "Currículo em PDF",
    resumeAlt: "Resume in English",
    note: "Rio Branco, Acre · remoto ou presencial, aberto a mudança",
  },
  ui: {
    viewCase: "Ver o case",
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
    footer: "Feito por Edilberto Lima Jr. com Next.js e three.js.",
    notFoundTitle: "Esse dado não chegou ao gold.",
    notFoundBody: "A página que você procurou não existe ou mudou de endereço.",
    notFoundCta: "Voltar ao início",
  },
};
