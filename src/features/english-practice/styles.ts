/**

 * EnglishPath — Slate + Teal profesyonel tasarım sistemi

 * Tek ana vurgu rengi; modüller ton farkıyla ayrılır (gökkuşağı yok).

 */

export const ep = {

  page: "min-h-screen min-h-[100dvh] bg-[#f8fafc] text-slate-800 antialiased",

  pageMesh:

    "pointer-events-none fixed inset-0 -z-10 bg-[#f8fafc] bg-[radial-gradient(ellipse_70%_50%_at_50%_-15%,rgba(13,148,136,0.07),transparent)]",

  clickable: "cursor-pointer",

  card: "bg-white border border-slate-200/90 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.04)]",

  cardHover:

    "hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)] hover:border-teal-200/80 hover:-translate-y-px transition-all duration-200 ease-out",

  cardGlass:

    "bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.05)]",

  btnPrimary:

    "cursor-pointer bg-teal-600 text-white font-semibold shadow-sm shadow-teal-600/20 hover:bg-teal-700 active:scale-[0.98] transition-all duration-150",

  btnSecondary:

    "cursor-pointer bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-150",

  btnSuccess:

    "cursor-pointer bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/20 active:scale-[0.98] transition-all duration-150",

  btnDanger:

    "cursor-pointer bg-rose-600 text-white font-semibold shadow-sm shadow-rose-600/20 hover:bg-rose-700 active:scale-[0.98] transition-all duration-150",

  chip: "cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-teal-200 hover:text-teal-700 transition-colors",

  chipActive: "bg-teal-600 text-white border-teal-600 shadow-sm",

  navTab:

    "cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap",

  navTabActive: "bg-teal-600 text-white hover:text-white hover:bg-teal-600 shadow-sm",

  navDropdown:

    "absolute top-full left-0 mt-1.5 min-w-[11rem] py-1.5 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-900/8 z-50",

  navDropdownItem:

    "cursor-pointer w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors text-left",

  navDropdownItemActive: "bg-teal-50 text-teal-700 font-medium",

  touchBtn: "cursor-pointer min-h-[52px] min-w-[52px] touch-manipulation select-none",

  gameFullscreen:

    "fixed inset-0 z-[60] md:static md:z-auto md:min-h-0 bg-[#f8fafc] flex flex-col pt-[env(safe-area-inset-top)] md:pt-0",

  muted: "text-slate-500",

  mutedSm: "text-slate-400",

  surfaceMuted: "bg-slate-50 border border-slate-100 rounded-xl",

  sectionLabel: "text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400",

  heroGradient: "bg-gradient-to-br from-slate-800 via-slate-800 to-teal-900",

  iconBox: "bg-teal-50 text-teal-700",

  iconBoxMuted: "bg-slate-100 text-slate-600",

  badge: "bg-teal-50 text-teal-700 border border-teal-100",

  stat: "text-teal-700 bg-teal-50",

} as const;



export const GAME_TABS = ["taboo", "heads_up", "charades", "emoji_clues"] as const;

export type GameTab = (typeof GAME_TABS)[number];



export function isGameTab(tab: string): tab is GameTab {

  return (GAME_TABS as readonly string[]).includes(tab);

}



export const LEARN_TABS = ["flashcards", "grammar", "prepositions"] as const;

export const GAME_MENU_TABS = ["games", ...GAME_TABS] as const;



export function isLearnTab(tab: string): boolean {

  return (LEARN_TABS as readonly string[]).includes(tab);

}



export function isGameMenuTab(tab: string): boolean {

  return (GAME_MENU_TABS as readonly string[]).includes(tab);

}


