import {

  Brain,

  FileSearch,

  MessageSquare,

  GraduationCap,

  ExternalLink,

  type LucideIcon,

} from "lucide-react";

import type { ChatMode, SidebarItem, SidebarSection } from "../types";



/** Stroke weight for premium thin icons in the lab sidebar. */

export const AILAB_SIDEBAR_ICON_STROKE = 1.35;



/** ChatGPT-style sub-routes under AI Lab (locale prefix added by router). */

export const AILAB_ROUTES = {

  agentConsole: "/ai-lab",

  sandbox: "/ai-lab/sandbox",

  deepAnalyzer: "/ai-lab/deep-analyzer",

  /** Legacy — redirects to agent console */

  thoughtChain: "/ai-lab/thought-chain",

} as const;



export function getChatRouteForMode(mode: ChatMode): string {

  switch (mode) {

    case "pdf":

      return AILAB_ROUTES.sandbox;

    case "terminal":

    case "engineer":

    default:

      return AILAB_ROUTES.agentConsole;

  }

}



export const AILAB_SIDEBAR_SECTIONS: readonly SidebarSection[] = [

  {

    categoryKey: "sidebar.categories.chat",

    items: [

      {

        id: "bex-assistant",

        labelKey: "sidebar.items.bex_assistant",

        descKey: "sidebar.items.bex_assistant_desc",

        icon: MessageSquare,

        type: "link",

        href: AILAB_ROUTES.agentConsole,

      },

    ],

  },

  {

    categoryKey: "sidebar.categories.tools",

    items: [

      {

        id: "document-rag",

        labelKey: "sidebar.items.document_rag",

        descKey: "sidebar.items.document_rag_desc",

        icon: FileSearch,

        type: "link",

        href: AILAB_ROUTES.sandbox,

      },

      {

        id: "deep-analyzer",

        labelKey: "sidebar.items.deep_analyzer",

        descKey: "sidebar.items.deep_analyzer_desc",

        icon: Brain,

        type: "link",

        href: AILAB_ROUTES.deepAnalyzer,

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

        href: "/ai-lab/english-path",

        isOutbound: true,

      },

      {

        id: "booking",

        labelKey: "sidebar.items.booking",

        descKey: "sidebar.items.booking_desc",

        icon: ExternalLink,

        type: "link",

        href: "/ai-lab/booking",

        isOutbound: true,

      },

    ],

  },

] as const satisfies readonly SidebarSection[];



export function flattenSidebarItems(sections: readonly SidebarSection[]): SidebarItem[] {

  return sections.flatMap((s) => [...s.items]);

}



/** True when URL is the main workspace (`/ai-lab` only), not a sub-tool route. */

export function isAiLabWorkspaceHome(pathname: string): boolean {

  const segs = pathname.split("/").filter(Boolean);

  const i = segs.lastIndexOf("ai-lab");

  return i !== -1 && i === segs.length - 1;

}



function hrefPathSegments(href: string): string[] {

  const pathOnly = href.split("?")[0];

  return pathOnly.split("/").filter(Boolean);

}



/** Pathname must end with the same segments as `href` (handles locale prefix). */

export function pathnameSuffixMatches(pathname: string, href: string): boolean {

  const pSegs = pathname.split("/").filter(Boolean);

  const hSegs = hrefPathSegments(href);

  if (hSegs.length === 0 || pSegs.length < hSegs.length) return false;

  for (let i = 0; i < hSegs.length; i++) {

    if (pSegs[pSegs.length - hSegs.length + i] !== hSegs[i]) return false;

  }

  return true;

}



/**

 * Active sidebar row: longest matching link href wins (so `/ai-lab` does not steal `/ai-lab/sandbox`).

 */

export function getActiveSidebarItemId(

  pathname: string,

  sections: readonly SidebarSection[] = AILAB_SIDEBAR_SECTIONS

): string {

  const links = flattenSidebarItems(sections).filter(

    (i): i is SidebarItem & { href: string } => i.type === "link" && !!i.href

  );



  let best: { id: string; len: number } | null = null;

  for (const item of links) {

    if (pathnameSuffixMatches(pathname, item.href)) {

      const len = hrefPathSegments(item.href).length;

      if (!best || len > best.len) {

        best = { id: item.id, len };

      }

    }

  }



  if (best) return best.id;

  return "bex-assistant";

}



export type SidebarIconComponent = LucideIcon;

