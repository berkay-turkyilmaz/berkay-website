export interface SkillCategory {
  id: string;
  labelKey: string;
  skills: string[];
}

/** CV-aligned skill groups (Özet / Beceriler) */
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "languages",
    labelKey: "languages",
    skills: ["JavaScript (ES6+)", "HTML5", "CSS3", "SASS/SCSS"],
  },
  {
    id: "libraries",
    labelKey: "libraries",
    skills: ["React.js", "Responsive Web Design", "Flexbox/Grid", "REST APIs"],
  },
  {
    id: "tools",
    labelKey: "tools",
    skills: ["Git", "GitHub", "Jira", "Figma", "Zeplin", "VS Code", "Microsoft SharePoint"],
  },
];
