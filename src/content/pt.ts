import type { Content } from "./types";

// Números conferidos nos repositórios em 2026-11-25 (contagem de pastas,
// pipelines do ADF, arquivos de teste). Ao atualizar o currículo, reconfira
// aqui — o portfólio e o PDF precisam dizer a mesma coisa.

export const pt: Content = {
  locale: "pt",
  meta: {
    title: "Edilberto Lima Jr. · Full-stack e engenharia de dados",
    description:
      "Desenvolvedor full-stack e engenheiro de dados em Rio Branco, AC. Data lake em produção no Azure, plataforma de dados com 14 dashboards e um SaaS para clínicas com clientes pagantes.",
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
    eyebrow: "Rio Branco, AC · aberto a vagas e projetos",
    name: "Edilberto Lima Jr.",
    role: "Desenvolvedor full-stack e engenheiro de dados",
    lead: "Levo o dado da fonte bruta até a tela de quem decide: montei sozinho o data lake do Observatório da Indústria do Acre, desenvolvo a plataforma que entrega esses dados e fundei um SaaS que já atende 3 clínicas pagantes.",
    ctaPrimary: "Ver projetos",
    ctaWhatsapp: "Chamar no WhatsApp",
    scrollHint: "Role para seguir o dado",
  },
  path: {
    eyebrow: "00 · fontes",
    title: "Quinze fontes brutas. Um caminho até a tela.",
    body: "Tenho mais de 3 anos construindo de ponta a ponta. Escrevo a ingestão em PySpark, modelo as camadas no Databricks, publico no Azure Data Explorer e desenvolvo a aplicação em Next.js que mostra tudo isso a gestores e empresários. Uso IA em produção: agentes, chatbots de WhatsApp e desenvolvimento assistido por agentes.",
    metrics: [
      { value: "15", label: "bases públicas e institucionais integradas" },
      { value: "30", label: "pipelines agendados no Azure Data Factory" },
      { value: "23,7 mi", label: "registros na maior base ingerida" },
      { value: "3", label: "clínicas pagantes no Milix" },
    ],
  },
  featured: [
    {
      slug: "observatorio-data-lake",
      title: "Data lake do Observatório da Indústria",
      kicker: "Engenharia de dados · em produção",
      year: "2025–2026",
      role: "Arquiteto e único desenvolvedor",
      summary:
        "Arquitetei e implementei sozinho o data lake do Sistema FIEAC no Azure. Quinze bases públicas e institucionais passam por bronze, silver e gold e chegam ao Azure Data Explorer prontas para dashboards e relatórios.",
      metrics: [
        { value: "30", label: "pipelines no ADF" },
        { value: "15", label: "fontes integradas" },
        { value: "102", label: "arquivos de teste" },
      ],
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
          "O lake reúne bases públicas e institucionais em camadas bronze, silver e gold no Databricks, com Unity Catalog e Delta Lake, orquestradas pelo Azure Data Factory. Os dados prontos vão para o Azure Data Explorer, de onde a plataforma do Observatório, os boletins e os relatórios consultam via KQL.",
        challenges: [
          "Bases heterogêneas e grandes: até 23,7 milhões de registros numa única fonte",
          "Reprocessar cargas sem duplicar dados",
          "Validar pipelines sem pagar a nuvem a cada teste",
          "Operar sem segredo espalhado em código ou configuração",
          "Manter o custo do Azure Data Explorer sob controle",
        ],
        solutions: [
          "Medallion com Delta Lake e Unity Catalog, com catálogos separados de desenvolvimento e produção",
          "Engine Python que roda igual na máquina e na nuvem: cada pipeline é validado localmente antes de publicar",
          "Controle de execução idempotente e manifesto SHA-256 dos arquivos brutos",
          "Managed Identity, Key Vault e RBAC em todos os serviços, sem chave compartilhada",
          "30 pipelines com gatilhos mensais e diários, e automação que desliga o ADX fora do horário de uso",
        ],
        results: [
          "Em produção, com execução agendada",
          "RAIS (1,3 milhão de vínculos), CAGED (613 mil movimentações), INSS (23,7 milhões de concessões) e Comex Stat (18 milhões de linhas), entre outras",
          "Base dos dashboards da plataforma, do boletim mensal de comércio exterior e do relatório Panorama das Exportações do Acre 2021–2025",
        ],
      },
    },
    {
      slug: "observatorio-plataforma",
      title: "Plataforma de inteligência de dados do Observatório",
      kicker: "Full-stack · em produção",
      year: "2025–2026",
      role: "Desenvolvedor principal",
      summary:
        "O portal que entrega os dados do lake a gestores e empresários: 14 dashboards analíticos consultando o ADX em KQL, IA de três provedores, newsletter, CMS e hub de demandas, com login corporativo e permissão por usuário e grupo.",
      metrics: [
        { value: "14", label: "dashboards analíticos" },
        { value: "945", label: "arquivos de teste" },
        { value: "3", label: "ambientes com CI/CD" },
      ],
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
          "Sou o principal desenvolvedor da plataforma do Observatório da Indústria do Acre. Ela tem portal público, área autenticada com dashboards, relatórios e apresentações, e um painel administrativo completo. Todo número de dashboard vem do data lake, consultado no Azure Data Explorer.",
        challenges: [
          "Consultar grandes volumes sem trazer os dados para a aplicação",
          "Controlar acesso por usuário e grupo, com prazo de validade e auditoria",
          "Oferecer IA de vários provedores sem expor chaves nem estourar custos",
          "Manter a qualidade numa aplicação com dezenas de módulos",
        ],
        solutions: [
          "Consultas KQL com os filtros aplicados direto no Azure Data Explorer",
          "Login com Microsoft Entra ID e permissões por usuário ou grupo, recurso e ação, com vigência e trilha de auditoria",
          "Vercel AI SDK com Anthropic, OpenAI e Google, chaves no Key Vault e limite de uso",
          "CI/CD com GitHub Actions e Azure DevOps em dev, homologação e produção, testes com Vitest e Playwright",
        ],
        results: [
          "Em produção em observatorio.fieac.org.br",
          "14 dashboards: RAIS, CAGED, comércio exterior, empresas, acidentes de trabalho, finanças municipais e outros",
          "Newsletter, CMS de notícias, apresentações com link assinado e hub de demandas",
        ],
      },
    },
    {
      slug: "milix",
      title: "Milix: gestão para clínicas",
      kicker: "SaaS próprio · 3 clínicas pagantes",
      year: "2025–2026",
      role: "Fundador e único desenvolvedor",
      summary:
        "Um SaaS multi-tenant para clínicas de qualquer especialidade: agenda, prontuário, financeiro, estoque, NFS-e, CRM, portal do paciente e um agente de IA que atende no WhatsApp. Fiz o produto, vendi, implantei e dou o suporte.",
      metrics: [
        { value: "3", label: "clínicas pagantes" },
        { value: "155", label: "telas no app" },
        { value: "1,7 mil", label: "arquivos de teste" },
      ],
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
          "O Milix atende odontologia, medicina, fisioterapia, nutrição, psicologia e estética. Cada clínica é um cliente isolado e pode ter várias filiais. O produto cobre o ciclo inteiro do paciente, da primeira mensagem no WhatsApp ao caixa do dia. É a evolução do Smilix, minha primeira versão, focada em odontologia.",
        challenges: [
          "Isolar totalmente os dados entre clínicas e filiais em toda operação",
          "Combinar permissão granular por perfil com recursos liberados pelo plano",
          "Cobrança recorrente com planos, add-ons e período de teste",
          "Um agente de IA no WhatsApp que atenda pacientes com segurança",
          "Evoluir rápido, sozinho, sem quebrar o que está em produção",
        ],
        solutions: [
          "Toda tabela carrega o tenant, e toda chamada pública passa por um único ponto de entrada que verifica identidade, permissão e plano, nessa ordem",
          "Um teste estrutural quebra o build se alguém criar chamada pública fora desse ponto de entrada",
          "Asaas com webhooks: planos mensais e anuais, add-ons e 14 dias grátis",
          "Cloud API oficial da Meta, gateway próprio de LLM, transcrição de áudio e busca semântica por embeddings",
          "Cerca de 1.700 arquivos de teste e 26 registros de decisão de arquitetura (ADRs)",
        ],
        results: [
          "3 clínicas pagantes usando em produção",
          "Ciclo completo de produto: desenvolvimento, venda, implantação com importação de pacientes e suporte",
          "Migração da primeira versão (Supabase, Stripe, Docker em VPS) para uma arquitetura mais robusta e testável",
        ],
      },
    },
  ],
  more: {
    eyebrow: "04 · sob medida",
    title: "Sistemas para empresas que não cabem em planilha.",
    body: "Projetos freelance em produção e um experimento pessoal com dados públicos. Cada um resolve um problema concreto de quem usa todo dia.",
    projects: [
      {
        slug: "distribuidora-flow",
        title: "Distribuidora Flow",
        kicker: "Freelance · em produção",
        year: "2025",
        role: "Desenvolvedor full-stack",
        summary:
          "Caixa, estoque e pedidos de uma distribuidora de bebidas, com um chatbot de IA que recebe pedidos reais pelo WhatsApp, painel em tempo real e app de rotas para entregadores.",
        metrics: [],
        stack: ["React", "TypeScript", "Supabase", "OpenAI", "WhatsApp API", "Redis", "XState", "Google Maps"],
        links: [],
        shots: [],
        diagram: "order-flow",
        stage: "tree",
        details: {
          overview:
            "Sistema full-stack para uma distribuidora de bebidas: frente de caixa, estoque e atendimento pelo WhatsApp. Um painel Kanban acompanha os pedidos em tempo real, entregadores recebem rotas pelo Google Maps e um chatbot com IA recebe pedidos de clientes sozinho, notificando cada etapa pela API oficial do WhatsApp.",
          challenges: [
            "Um chatbot que processa pedidos reais sem inventar produto nem preço",
            "Sincronizar pedidos em tempo real entre WhatsApp, painel e entregadores",
            "Controlar retornáveis (cascos) com rastreamento e aviso automático",
            "Sessões concorrentes e limite de taxa no bot",
          ],
          solutions: [
            "Validação com Zod, limiar de confiança e guardrails contra alucinação",
            "Máquina de estados em XState para os fluxos de conversa e as fases do pedido",
            "Supabase Realtime em todas as interfaces e sessões em Redis com TTL",
            "Geocodificação e roteamento de entregas com a API do Google Maps",
          ],
          results: [
            "Em uso diário na distribuidora: caixa, estoque e pedidos",
            "Pedidos de clientes reais recebidos pelo chatbot sem intervenção",
            "Ciclo do pedido rastreado da mensagem no WhatsApp até a entrega",
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
          "Base de conhecimento de um provedor de internet: atendentes seguem árvores de decisão interativas, e gestores sem formação técnica montam os fluxos num editor visual.",
        metrics: [
          { value: "22", label: "tabelas" },
          { value: "23", label: "telas" },
        ],
        stack: ["Next.js", "React", "TypeScript", "Drizzle ORM", "PostgreSQL", "NextAuth", "React Flow", "TipTap"],
        links: [],
        shots: [],
        diagram: "decision-tree",
        stage: "tree",
        details: {
          overview:
            "Base de conhecimento e biblioteca de processos para o suporte de um provedor de internet. Atendentes seguem árvores de decisão passo a passo; gestores editam os fluxos num editor visual com React Flow e escrevem artigos num editor de texto rico. O acesso é por perfil, com visibilidade por setor.",
          challenges: [
            "Um editor de fluxos que gestor sem formação técnica consiga usar",
            "Visibilidade de conteúdo por perfil e por setor",
            "Manter o formato antigo de árvore de decisão funcionando junto do novo",
          ],
          solutions: [
            "React Flow com nós customizados e layout automático com dagre",
            "NextAuth com JWT e permissões por setor filtrando todo conteúdo",
            "Visualizador passo a passo que registra o caminho do atendente pelos nós",
          ],
          results: [
            "Em produção no servidor do cliente, padronizando o atendimento entre setores",
            "Gestores criam e atualizam processos sem depender de desenvolvedor",
            "Log de acesso mostrando quais processos são mais usados",
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
          "Resultados das eleições no Acre com dados do TSE: mapa, ranking e comparação de candidatos do estado até a seção eleitoral, com ETL em Python determinístico e reprocessável.",
        metrics: [
          { value: "258 mil", label: "linhas de votos" },
          { value: "2.270", label: "seções" },
        ],
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
            "Um pipeline em Python prepara os resultados eleitorais do Acre, que são importados no Convex e exibidos em mapas, rankings e comparações, do estado inteiro até a seção, com exportação em CSV.",
          challenges: [
            "Organizar mais de 258 mil linhas de votos em vários níveis territoriais",
            "Reprocessar sem duplicar registros",
            "Garantir que os totais batem com a fonte oficial",
          ],
          solutions: [
            "Preparação determinística com hashes SHA-256: rodar de novo gera exatamente os mesmos arquivos",
            "Importação em lotes com pontos de retomada, repetível sem duplicar",
            "Conferência automática de totais entre o Python e o banco, e malha do IBGE 2025 no MapLibre",
          ],
          results: [
            "258.052 linhas de votos, 2.270 seções, 660 locais, 22 municípios e 341 candidatos",
            "Consulta e exportação até o nível da seção eleitoral",
          ],
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
        description: "Primeira versão do Milix, para odontologia: Supabase com RLS, Stripe e bot de WhatsApp, rodando em Docker numa VPS.",
        stack: ["Next.js", "Supabase", "Stripe", "Redis"],
      },
      {
        title: "Dados fiscais de 21 prefeituras",
        year: "2026",
        description: "Pipeline que unifica os portais de transparência de 21 municípios do Acre: 2,09 milhões de registros em 16 tabelas.",
        stack: ["Python", "Pydantic", "DuckDB", "Streamlit"],
      },
      {
        title: "Apresentações de dados do Observatório",
        year: "2026",
        description: "Kit de apresentações HTML autocontidas com three.js e CI que valida cada versão. Panorama das Exportações do Acre e estudo da Zona Leste de Manaus.",
        stack: ["React", "three.js", "Motion"],
      },
      {
        title: "Catálogo de skills para agentes",
        year: "2026",
        description: "Skills de modelagem, ingestão e dashboards para Claude Code e Codex, sincronizadas por hash entre repositórios e com 34 casos de avaliação.",
        stack: ["Node.js", "YAML", "Azure DevOps"],
      },
      {
        title: "Busca Diários",
        year: "2024",
        description: "Baixa os diários oficiais do Acre e do Tribunal de Justiça e procura termos dentro dos PDFs, com interface de linha de comando e gráfica.",
        stack: ["Python", "Selenium", "pdfplumber"],
        href: "https://github.com/edlbrtojr/BuscaDiarios",
      },
      {
        title: "Service desk e fluxo de documentos",
        year: "2024–2025",
        description: "Aplicativo de demandas entre setores e aprovação de documentos com assinatura, que substituíram pedidos por e-mail e papel no Sistema FIEAC.",
        stack: ["Power Apps", "Power Automate", "SharePoint"],
      },
      {
        title: "Intranet do Sistema FIEAC",
        year: "2024",
        description: "Intranet reconstruída no SharePoint moderno, com web parts próprias em SharePoint Framework.",
        stack: ["SPFx", "TypeScript", "React"],
      },
      {
        title: "Gerador de QR Code",
        year: "2026",
        description: "QR codes personalizados para Instagram, WhatsApp, Pix e Wi-Fi, com exportação em PNG e SVG.",
        stack: ["Vite", "TypeScript"],
      },
    ],
  },
  career: {
    eyebrow: "05 · trajetória",
    title: "De professor de inglês a engenheiro de dados.",
    body: "Ensinei inglês na rede estadual por mais de dois anos enquanto cursava Sistemas de Informação. A didática ficou: explico arquitetura para quem não é técnico e documento para o próximo desenvolvedor.",
    positions: [
      {
        title: "Analista de TI · engenharia de dados e full-stack",
        company: "Observatório da Indústria, Sistema FIEAC",
        period: "out/2025 – atual",
        summary: "Data lake no Azure, plataforma de dados e padronização do uso de agentes de IA na equipe.",
        current: true,
      },
      {
        title: "Fundador e desenvolvedor",
        company: "Milix",
        period: "ago/2025 – atual",
        summary: "SaaS multi-tenant para clínicas, com cobrança recorrente e agente de IA no WhatsApp.",
        current: true,
      },
      {
        title: "Desenvolvedor full-stack freelance",
        company: "Autônomo",
        period: "2025 – atual",
        summary: "Sistemas sob medida em produção para uma distribuidora e um provedor de internet.",
        current: true,
      },
      {
        title: "Assistente de TI",
        company: "UNITEC, Sistema FIEAC",
        period: "jan/2024 – out/2025",
        summary: "Power Apps, Power Automate, automação com Python e a nova intranet em SPFx.",
      },
      {
        title: "Estagiário de TI",
        company: "UNITEC, Sistema FIEAC",
        period: "set/2023 – dez/2023",
        summary: "Suporte, chamados e as primeiras aplicações internas em Power Platform.",
      },
    ],
    earlier: "Antes: professor de inglês na rede estadual do Acre (2021–2024) e estagiário de help desk na Uninorte (2021).",
    educationTitle: "Formação",
    education: [
      { degree: "Bacharelado em Sistemas de Informação", institution: "Estácio-Unimeta", period: "2021–2024" },
      { degree: "Licenciatura em Língua Inglesa", institution: "Universidade Federal do Acre", period: "2016–2019" },
    ],
    certificationsTitle: "Cursos",
    certifications: "13 cursos concluídos, entre eles Data Analytics e Gestão de Projetos (Universidade Corporativa da Indústria), Python avançado, Django, SQL avançado e Power BI (Alura).",
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
    title: "Tem um processo travado? Eu transformo em sistema.",
    body: "Atendo empresas de qualquer porte, do primeiro rascunho ao sistema rodando, com o mesmo cuidado que levo para a produção do Observatório e do Milix.",
    items: [
      { title: "Sistemas sob medida", description: "Caixa, estoque, agenda, base de conhecimento: o fluxo da sua empresa, sem adaptar o negócio a um software genérico." },
      { title: "Atendimento com IA no WhatsApp", description: "Chatbots e agentes que recebem pedidos, agendam e respondem dúvidas, com guardrails para não inventar." },
      { title: "Dashboards e dados", description: "Pipelines que juntam suas planilhas e sistemas num lugar só e painéis que mostram o que importa." },
      { title: "Automação de processos", description: "O trabalho repetitivo, de e-mail a aprovação de documento, feito sozinho e com registro." },
      { title: "SaaS do zero", description: "Do MVP ao produto cobrando: multi-tenant, planos, pagamentos recorrentes e nota fiscal." },
      { title: "Integrações", description: "Pagamentos, NFS-e, WhatsApp, ERPs e APIs conectados ao que você já usa." },
    ],
    cta: "Contar meu projeto",
  },
  contact: {
    eyebrow: "07 · gold",
    title: "O dado chegou. Agora é com você.",
    body: "Vagas, projetos freelance ou só uma conversa sobre dados: respondo rápido no WhatsApp e por e-mail.",
    whatsapp: "WhatsApp",
    email: "edlbrtojr@gmail.com",
    resume: "Currículo em PDF",
    resumeAlt: "Resume in English",
    note: "Rio Branco, Acre · trabalho remoto ou presencial",
  },
  ui: {
    viewCase: "Ver o case",
    visitSite: "Abrir o site",
    stack: "Stack",
    role: "Papel",
    back: "Voltar ao início",
    overview: "Visão geral",
    challenges: "Desafios",
    solutions: "Como resolvi",
    results: "Resultados",
    nextProject: "Próximo projeto",
    footer: "Feito por Edilberto Lima Jr. com Next.js e three.js.",
    notFoundTitle: "Esse dado não chegou ao gold.",
    notFoundBody: "A página que você procurou não existe ou mudou de endereço.",
    notFoundCta: "Voltar ao início",
  },
};
