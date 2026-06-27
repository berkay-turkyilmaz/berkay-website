/** Structured resume data — single source for CV page & BEX context */
export const RESUME_PROFILE = {
  role: "Frontend Developer",
  github: "https://github.com/berkay-turkyilmaz",
  portfolioUrl: "https://berkay-dev.vercel.app",
  languageLevel: "English · A2",
  location: "Istanbul, Turkey",
} as const;

export const RESUME_EXPERIENCE = [
  {
    id: "turk-telekom",
    periodKey: "exp_1_period",
    roleKey: "exp_1_role",
    companyKey: "exp_1_company",
    descKey: "exp_1_desc",
    bulletKeys: ["exp_1_bullet_1", "exp_1_bullet_2", "exp_1_bullet_3"],
  },
  {
    id: "ottoman",
    periodKey: "exp_2_period",
    roleKey: "exp_2_role",
    companyKey: "exp_2_company",
    descKey: "exp_2_desc",
    bulletKeys: ["exp_2_bullet_1", "exp_2_bullet_2"],
  },
] as const;

export const RESUME_PROJECTS = [
  {
    id: "portfolio",
    titleKey: "project_1_title",
    periodKey: "project_1_period",
    descKey: "project_1_desc",
    url: "https://berkay-dev.vercel.app",
  },
  {
    id: "finance-bot",
    titleKey: "project_2_title",
    periodKey: "project_2_period",
    descKey: "project_2_desc",
    url: null,
  },
] as const;
