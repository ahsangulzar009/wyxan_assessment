"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  History as HistoryIcon,
  Keyboard,
  Link2,
  Search,
  type LucideIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getHistory, getUsers, type User, type Via, type Visit } from "@/lib/api";

const VIA: Record<Via, { label: string; icon: LucideIcon }> = {
  typed: { label: "Typed", icon: Keyboard },
  link: { label: "Link", icon: Link2 },
  history: { label: "History", icon: HistoryIcon },
  search: { label: "Search", icon: Search },
};

type HistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string;
  onOpenAddress: (address: string) => void;
};

function when(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function Initials({ name }: { name: string }) {
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-foreground text-[9px] font-semibold text-background">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export default function HistoryDialog({
  open,
  onOpenChange,
  currentUserId,
  onOpenAddress,
}: HistoryDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState(currentUserId ?? "");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    if (open && !userId && currentUserId) setUserId(currentUserId);
  }, [open, userId, currentUserId]);

  useEffect(() => {
    if (!open) return;
    getUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [open]);

  useEffect(() => {
    if (!open || !userId) return;

    let cancelled = false;
    setLoading(true);

    getHistory(userId)
      .then((list) => {
        if (!cancelled) setVisits(list);
      })
      .catch(() => {
        if (!cancelled) setVisits([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, userId]);

  const selected = users.find((user) => user.id === userId) ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>History</DialogTitle>
          <DialogDescription>Everywhere this person has been.</DialogDescription>
        </DialogHeader>

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger
            aria-label="Choose whose history"
            className="flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-border/70 px-2.5 text-sm outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-muted"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Initials name={selected?.name ?? "?"} />
              <span className="truncate font-medium">
                {selected?.name ?? "Choose a person"}
              </span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuRadioGroup
              value={userId}
              onValueChange={(value) => {
                setUserId(String(value));
                setMenuOpen(false);
              }}
            >
              {users.map((user) => (
                <DropdownMenuRadioItem
                  key={user.id}
                  value={user.id}
                  className="py-1.5 pr-8 cursor-pointer"
                >
                  <Initials name={user.name} />
                  <span className="truncate">{user.name}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="-mx-1 max-h-[60vh] space-y-0.5 overflow-y-auto px-1">
          {loading ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              Loading…
            </p>
          ) : visits.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              Nothing recorded yet.
            </p>
          ) : (
            visits.map((visit) => {
              const via = VIA[visit.via];
              const ViaIcon = via.icon;

              return (
                <button
                  key={visit.id}
                  type="button"
                  onClick={() => onOpenAddress(visit.address)}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {visit.title ?? visit.address}
                    </span>
                    <span className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="truncate font-mono">{visit.address}</span>
                      <span aria-hidden className="shrink-0">
                        •
                      </span>
                      <span className="shrink-0 text-[10px] font-semibold tracking-widest uppercase text-foreground/55">
                        via
                      </span>
                      <ViaIcon className="size-3.5 shrink-0" />
                      <span className="shrink-0 font-medium text-foreground/80">
                        {via.label}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {when(visit.visitedAt)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
