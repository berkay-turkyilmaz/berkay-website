import {
  Brain,
  FileSearch,
  MessageSquare,
  GraduationCap,
  ExternalLink,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import type { SidebarItem, SidebarSection } from "../types";
import type { ChatKind } from "../lib/chat-store";

/** Stroke weight for premium thin icons in the lab sidebar. */
export const AILAB_SIDEBAR_ICON_STROKE = 1.35;

/** AI Lab URL map (locale prefix is added by the router). */
export const AILAB_ROUTES = {
  chat: "/ai-lab/chat",
  documents: "/ai-lab/documents",
  analyzer: "/ai-lab/analyzer",
  englishPath: "/ai-lab/english-path",
  booking: "/ai-lab/booking",
} as const;

export function chatBasePath(kind: ChatKind): string {
  return kind === "document" ? AILAB_ROUTES.documents : AILAB_ROUTES.chat;
}

export function chatPath(kind: ChatKind, id?: string): string {
  return id ? `${chatBasePath(kind)}/${id}` : chatBasePath(kind);
}

export const AILAB_SIDEBAR_SECTIONS: readonly SidebarSection[] = [
  {
    categoryKey: "sidebar.categories.chat",
    items: [
      {
        id: "chat",
        labelKey: "sidebar.items.bex_assistant",
        descKey: "sidebar.items.bex_assistant_desc",
        icon: MessageSquare,
        type: "link",
        href: AILAB_ROUTES.chat,
      },
    ],
  },
  {
    categoryKey: "sidebar.categories.tools",
    items: [
      {
        id: "documents",
        labelKey: "sidebar.items.document_rag",
        descKey: "sidebar.items.document_rag_desc",
        icon: FileSearch,
        type: "link",
        href: AILAB_ROUTES.documents,
      },
      {
        id: "analyzer",
        labelKey: "sidebar.items.deep_analyzer",
        descKey: "sidebar.items.deep_analyzer_desc",
        icon: Brain,
        type: "link",
        href: AILAB_ROUTES.analyzer,
      },
    ],
  },
  {
    categoryKey: "sidebar.categories.portfolio",
    items: [
      {
        id: "english",
        labelKey: "sidebar.items.english",
        descKey: "sidebar.items.english_desc",
        icon: GraduationCap,
        type: "link",
        href: AILAB_ROUTES.englishPath,
        isOutbound: true,
      },
      {
        id: "booking",
        labelKey: "sidebar.items.booking",
        descKey: "sidebar.items.booking_desc",
        icon: ExternalLink,
        type: "link",
        href: AILAB_ROUTES.booking,
        isOutbound: true,
      },
      {
        id: "meetora",
        labelKey: "sidebar.items.meetora",
        descKey: "sidebar.items.meetora_desc",
        icon: MapPin,
        type: "link",
        href: "https://getmeetora.com/",
        isOutbound: true,
      },
    ],
  },
] as const satisfies readonly SidebarSection[];

export function flattenSidebarItems(sections: readonly SidebarSection[]): SidebarItem[] {
  return sections.flatMap((s) => [...s.items]);
}

/** Segments after `ai-lab` in a (possibly locale-prefixed) pathname. */
export function aiLabSegments(pathname: string): string[] {
  const segs = pathname.split("/").filter(Boolean);
  const i = segs.indexOf("ai-lab");
  return i === -1 ? [] : segs.slice(i + 1);
}

/** Which chat surface the URL belongs to, or null for tools and apps. */
export function getChatKindFromPath(pathname: string): ChatKind | null {
  const [first] = aiLabSegments(pathname);
  if (first === "chat") return "chat";
  if (first === "documents") return "document";
  return null;
}

/** Saved-chat id in `/ai-lab/chat/[id]` or `/ai-lab/documents/[id]`. */
export function getChatIdFromPath(pathname: string): string | null {
  const segs = aiLabSegments(pathname);
  return (segs[0] === "chat" || segs[0] === "documents") && segs[1] ? segs[1] : null;
}

/** Active sidebar row, derived from the first segment after `/ai-lab`. */
export function getActiveSidebarItemId(pathname: string): string {
  const [first] = aiLabSegments(pathname);
  switch (first) {
    case "documents":
      return "documents";
    case "analyzer":
      return "analyzer";
    case "english-path":
      return "english";
    case "booking":
      return "booking";
    default:
      return "chat";
  }
}

export type SidebarIconComponent = LucideIcon;
