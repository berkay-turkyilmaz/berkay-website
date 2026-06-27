export type FocusStatus = "building" | "consulting" | "open-to-work";

export const currentFocus = {
  status: "building" as FocusStatus,
  projectKey: "project_saas",
  descriptionKey: "description_saas",
  sinceKey: "since_march",
  availableForKeys: [
    "available_freelance",
    "available_consulting",
    "available_fulltime",
  ],
} as const;
