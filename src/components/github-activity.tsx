import { GitBranch, Star, Package, Clock } from "lucide-react";

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: {
    commits?: Array<{ message: string }>;
    ref_type?: string;
    description?: string;
  };
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (hours < 1) return "< 1h ago";
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function EventIcon({ type }: { type: string }) {
  const cls = "w-3.5 h-3.5 shrink-0";
  if (type === "PushEvent") return <GitBranch className={cls} />;
  if (type === "CreateEvent") return <Package className={cls} />;
  if (type === "WatchEvent") return <Star className={cls} />;
  return <Clock className={cls} />;
}

function EventDescription({ event }: { event: GitHubEvent }) {
  const repoShort = event.repo.name.split("/")[1] ?? event.repo.name;

  if (event.type === "PushEvent") {
    const msg = event.payload?.commits?.[0]?.message ?? "pushed commits";
    const truncated = msg.length > 60 ? msg.slice(0, 57) + "…" : msg;
    return (
      <span>
        <span className="text-primary/80">{repoShort}</span>
        {" — "}
        {truncated}
      </span>
    );
  }

  if (event.type === "CreateEvent") {
    const refType = event.payload?.ref_type ?? "repository";
    return (
      <span>
        Created {refType}{" "}
        <span className="text-primary/80">{repoShort}</span>
      </span>
    );
  }

  if (event.type === "WatchEvent") {
    return (
      <span>
        Starred <span className="text-primary/80">{repoShort}</span>
      </span>
    );
  }

  return <span>{event.type.replace("Event", "")} on <span className="text-primary/80">{repoShort}</span></span>;
}

async function fetchGitHubActivity(): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(
      "https://api.github.com/users/berkay-turkyilmaz/events/public?per_page=10",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data: GitHubEvent[] = await res.json();
    return data
      .filter((e) => ["PushEvent", "CreateEvent", "WatchEvent"].includes(e.type))
      .slice(0, 5);
  } catch {
    return [];
  }
}

export async function GitHubActivity() {
  const events = await fetchGitHubActivity();

  if (events.length === 0) return null;

  return (
    <div className="w-full bg-card border border-border/60 rounded-2xl p-5 sm:p-6 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest flex items-center gap-1.5">
          <GitBranch className="w-3 h-3" />
          GitHub Activity
        </span>
        <a
          href="https://github.com/berkay-turkyilmaz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-primary hover:text-primary/70 transition-colors font-mono"
        >
          @berkay-turkyilmaz ↗
        </a>
      </div>

      {/* Events list */}
      <ul className="space-y-2">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex items-start gap-2.5 text-[12px] font-mono text-muted-foreground/70 group"
          >
            <span className="mt-0.5 text-primary/50 group-hover:text-primary transition-colors">
              <EventIcon type={event.type} />
            </span>
            <span className="flex-1 leading-relaxed group-hover:text-foreground/80 transition-colors">
              <EventDescription event={event} />
            </span>
            <span className="text-[10px] text-muted-foreground/35 shrink-0 mt-0.5">
              {formatRelativeTime(event.created_at)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
