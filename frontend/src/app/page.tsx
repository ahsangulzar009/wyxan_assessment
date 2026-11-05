"use client";

import { useEffect, useRef, useState } from "react";
import { Compass } from "lucide-react";
import { toast } from "sonner";

import Header, { type BrowserUser } from "@/components/Header";
import { visitSite, type Site, type Via } from "@/lib/api";

import NotFound from "./_component/NotFound";
import SiteFrame from "./_component/SiteFrame";
import HistoryDialog from "./_component/HistoryDialog";

type Entry = { address: string; site: Site | null };

export default function Home() {
  const [currentUser, setCurrentUser] = useState<BrowserUser | null>(null);
  const [trail, setTrail] = useState<Entry[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [pending, setPending] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const current = trail[cursor] ?? null;
  const site = current?.site ?? null;
  const address = pending ?? current?.address ?? "";

  useEffect(() => {
    document.title = site
      ? `${site.title} — Mini Browser`
      : "Mini Browser by Wynax";
  }, [site]);

  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    if (previousUserId.current === null) {
      previousUserId.current = currentUser.id;
      return;
    }

    if (previousUserId.current === currentUser.id) return;

    previousUserId.current = currentUser.id;
    setTrail([]);
    setCursor(-1);
  }, [currentUser]);

  async function goTo(next: string, via: Via = "typed") {
    const wanted = next.trim().toLowerCase();
    if (!wanted || !currentUser || pending) return;

    setPending(wanted);

    try {
      const found = await visitSite({
        userId: currentUser.id,
        address: wanted,
        via,
      });

      const entry: Entry = { address: found?.address ?? wanted, site: found };

      setTrail((old) => [...old.slice(0, cursor + 1), entry]);
      setCursor(cursor + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Internal server error",
        { description: wanted },
      );
    } finally {
      setPending(null);
    }
  }

  function goToEntry(at: number) {
    const entry = trail[at];
    if (!entry || !currentUser) return;

    setCursor(at);

    visitSite({
      userId: currentUser.id,
      address: entry.address,
      via: "history",
    })
  }

  function backToStart() {
    setTrail([]);
    setCursor(-1);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        address={address}
        onNavigate={goTo}
        onSelectUser={setCurrentUser}
        onClear={backToStart}
        canGoBack={cursor > 0}
        canGoForward={cursor < trail.length - 1}
        onBack={() => goToEntry(cursor - 1)}
        onForward={() => goToEntry(cursor + 1)}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      <main className="flex flex-1 flex-col">
        {site ? (
          <div className="mx-auto mt-3 w-[95%] max-w-375">
            <div className="relative h-[calc(100dvh-6rem)] overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm">
              <SiteFrame
                key={site.address}
                title={site.title}
                html={site.html}
                onFollow={(next) => goTo(next, "link")}
              />
              {pending && (
                <span className="absolute right-3 top-3 rounded-full bg-foreground/80 px-3 py-1 text-[11px] font-medium text-background backdrop-blur">
                  asking {pending}…
                </span>
              )}
            </div>
          </div>
        ) : pending ? (
          <div className="flex flex-1 items-center justify-center px-6 pb-16">
            <p className="animate-pulse font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              asking {pending}…
            </p>
          </div>
        ) : current ? (
          <NotFound
            icon={<Compass className="size-5 text-muted-foreground" />}
            eyebrow="Nowhere"
            title={current.address}
            body="Nobody ever published a page at this address."
            actionLabel="Back to the start"
            onAction={backToStart}
          />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              The small web
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              Type an address to begin
            </h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Every page you visit is recorded against the person you are
              browsing as.
            </p>
          </div>
        )}
      </main>

      <HistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        currentUserId={currentUser?.id}
        onOpenAddress={(next) => {
          setHistoryOpen(false);
          void goTo(next, "history");
        }}
      />
    </div>
  );
}

