export type FocusStatus = "building" | "consulting" | "open-to-work";

export const currentFocus = {
  status: "building" as FocusStatus,
  projectKey: "current_focus.project_saas",
  descriptionKey: "current_focus.description_saas",
  sinceKey: "current_focus.since_march",
  availableForKeys: [
    "current_focus.available_freelance",
    "current_focus.available_consulting",
    "current_focus.available_fulltime",
  ],
} as const;
