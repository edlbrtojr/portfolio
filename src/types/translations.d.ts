export interface Translation {
  navigation: {
    experience: string;
    education: string;
    skills: string;
    certifications: string;
    projects: string;
    home: string;
  };
  notFound: {
    title: string;
    description: string;
    goBack: string;
    goHome: string;
  };
  sidebar: {
    title: string;
    navigation: string;
  };
  hero: {
    greeting: string;
    title: string;
    summary: string;
    downloadResume: string;
    contactMe: string;
    professionalSummaryTitle: string;
    professionalSummary: string;
  };
  experience: {
    title: string;
    subtitle: string;
    timeline: string;
    positions: Array<{
      title: string;
      company: string;
      location: string;
      period: string;
      current?: boolean;
      responsibilities?: string[];
    }>;
    otherPositions: Array<{
      title: string;
      company: string;
      location: string;
      period: string;
      responsibilities: string[];
    }>;
  };
  education: {
    title: string;
    subtitle: string;
    degrees: Array<{
      degree: string;
      institution: string;
      location: string;
      period: string;
    }>;
  };
  skills: {
    title: string;
    subtitle: string;
    filterAll: string;
    categories: Array<{
      name: string;
      skills: string[];
    }>;
  };
  certifications: {
    title: string;
    subtitle: string;
    categories: Array<{
      name: string;
      certifications: Array<{
        title: string;
        provider: string;
        date: string;
      }>;
    }>;
  };
  projects: {
    title: string;
    subtitle: string;
    viewProject: string;
    projects: Array<{
      title: string;
      description: string;
      year: string;
      technologies: string[];
      github: boolean;
      live: boolean;
      liveUrl?: string;
      slug: string;
      featured?: boolean;
      image?: string;
      details: {
        overview: string;
        challenges: string[];
        solutions: string[];
        results: string[];
      };
    }>;
  };
  projectDetails: {
    backToProjects: string;
    overview: string;
    technologies: string;
    challenges: string;
    solutions: string;
    results: string;
    relatedProjects: string;
  };
}
