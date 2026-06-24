export interface SkillCategory {
  id: string;
  labelKey: string;
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    labelKey: "skills.frontend",
    skills: ["Next.js 16", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
  },
  {
    id: "backend",
    labelKey: "skills.backend",
    skills: ["Supabase", "PostgreSQL", "Node.js", "Edge Functions", "REST APIs", "tRPC"],
  },
  {
    id: "automation",
    labelKey: "skills.automation",
    skills: ["n8n", "Webhooks", "Cron Jobs", "Google Workspace API", "Stripe", "Serverless"],
  },
  {
    id: "ai",
    labelKey: "skills.ai",
    skills: ["Groq API", "Llama 3.1", "RAG Architecture", "Streaming LLM", "Vector Search", "PDF.js"],
  },
  {
    id: "devops",
    labelKey: "skills.devops",
    skills: ["Vercel", "Docker", "GitHub Actions", "Turbopack", "Zod", "next-intl"],
  },
];
