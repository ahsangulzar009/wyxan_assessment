"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock3,
  Globe2,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { API_BASE_URL, getUsers, type SearchResult, type User } from "@/lib/api";
import Highlight from "@/app/_component/Highlight";

export type BrowserUser = User;

type HeaderProps = {
  address?: string;
  onNavigate?: (address: string) => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  onSearch?: (query: string) => void;
  searchResults?: SearchResult[] | null;
  searchQuery?: string;
  onOpenResult?: (address: string) => void;
  onCloseResults?: () => void;
  currentUser?: BrowserUser;
  onSelectUser?: (user: BrowserUser) => void;
  onClear?: () => void;
  onOpenHistory?: () => void;
  onOpenPublish?: () => void;
};

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Avatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br from-foreground to-foreground/70 text-[10px] font-semibold tracking-wide text-background ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}

export default function Header({
  address,
  onNavigate,
  canGoBack = false,
  canGoForward = false,
  onBack,
  onForward,
  onSearch,
  searchResults,
  searchQuery = "",
  onOpenResult,
  onCloseResults,
  currentUser,
  onSelectUser,
  onClear,
  onOpenHistory,
  onOpenPublish,
}: HeaderProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [usersStatus, setUsersStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  const [addressDraft, setAddressDraft] = useState(address ?? "");
  const [searchDraft, setSearchDraft] = useState("");
  const [pickedUserId, setPickedUserId] = useState<string | undefined>(
    currentUser?.id,
  );

  const addressRef = useRef<HTMLInputElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);

  // Search as you type, but not on every keystroke.
  const searchHandler = useRef(onSearch);
  searchHandler.current = onSearch;
  const closeResults = useRef(onCloseResults);
  closeResults.current = onCloseResults;

  useEffect(() => {
    const typed = searchDraft.trim();

    if (!typed) {
      closeResults.current?.();
      return;
    }

    const timer = setTimeout(() => searchHandler.current?.(typed), 300);
    return () => clearTimeout(timer);
  }, [searchDraft]);

  // Clicking away or pressing Escape closes the results.
  useEffect(() => {
    if (!searchResults) return;

    function onPointerDown(event: PointerEvent) {
      if (!searchFormRef.current?.contains(event.target as Node)) {
        onCloseResults?.();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseResults?.();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [searchResults, onCloseResults]);

  useEffect(() => {
    getUsers()
      .then((list) => {
        setUsers(list);
        setUsersStatus(list.length > 0 ? "ready" : "error");
      })
      .catch(() => setUsersStatus("error"));
  }, []);

  useEffect(() => {
    if (address !== undefined) setAddressDraft(address);
  }, [address]);

  const activeUserId = currentUser?.id ?? pickedUserId ?? users[0]?.id;
  const activeUser =
    users.find((person) => person.id === activeUserId) ?? users[0];

  const selectUserRef = useRef(onSelectUser);
  selectUserRef.current = onSelectUser;

  useEffect(() => {
    if (activeUser) selectUserRef.current?.(activeUser);
  }, [activeUser]);

  function handleAddressSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = addressDraft.trim();
    if (!next) return;
    onNavigate?.(next);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchDraft.trim();
    if (!query) return;
    onSearch?.(query);
  }

  function handleUserChange(value: unknown) {
    setPickedUserId(String(value));
  }

  return (
    <header className="sticky top-3 z-40 mx-auto mt-3 w-[95%] max-w-375">
      <div className="flex h-14 items-center gap-1.5 rounded-2xl border border-border/70 bg-background/75 px-2 shadow-[0_1px_2px_rgba(16,24,32,0.04),0_12px_28px_-16px_rgba(16,24,32,0.25)] backdrop-blur-xl supports-backdrop-filter:bg-background/60 sm:gap-2 sm:px-3">
        {/* Back / forward */}
        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Back"
                  disabled={!canGoBack}
                  onClick={onBack}
                  className="cursor-pointer rounded-full text-foreground/80 hover:text-foreground"
                />
              }
            >
              <ArrowLeft className="size-5" />
            </TooltipTrigger>
            <TooltipContent>Back</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Forward"
                  disabled={!canGoForward}
                  onClick={onForward}
                  className="cursor-pointer rounded-full text-foreground/80 hover:text-foreground"
                />
              }
            >
              <ArrowRight className="size-5" />
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>

        <div className="mx-0.5 hidden h-5 w-px shrink-0 bg-border sm:block" />

        <form onSubmit={handleAddressSubmit} className="relative min-w-0 flex-1">
          <Globe2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={addressRef}
            value={addressDraft}
            onChange={(event) => setAddressDraft(event.target.value)}
            aria-label="Address"
            placeholder="Type an address, e.g. tidepool.zz"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }}
            className="h-9 rounded-full border-transparent bg-muted/60 pl-9 pr-20 text-sm shadow-inner shadow-black/3 transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring/60 focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-ring/15 dark:bg-muted/40 dark:focus-visible:bg-background"
          />
          {addressDraft && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Clear address"
              onClick={() => {
                setAddressDraft("");
                onClear?.();
                addressRef.current?.focus();
              }}
              className="absolute cursor-pointer right-13 top-1/2 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </Button>
          )}
          <Button
            type="submit"
            size="xs"
            disabled={!addressDraft.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-full px-3 text-xs font-medium"
          >
            Go
          </Button>
        </form>

        <form
          ref={searchFormRef}
          onSubmit={handleSearchSubmit}
          className="relative hidden w-52 shrink-0 lg:block xl:w-72"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            aria-label="Search the web"
            placeholder="Search the web"
            autoComplete="off"
            spellCheck={false}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }}
            className="h-9 rounded-full border-transparent bg-muted/60 pl-9 pr-3 text-sm shadow-inner shadow-black/3 transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring/60 focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-ring/15 dark:bg-muted/40 dark:focus-visible:bg-background"
          />

          {searchResults ? (
            <div className="absolute right-0 top-11 z-50 w-120 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border/70 bg-popover shadow-xl">
              {searchResults.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Nothing matches “{searchQuery}”.
                </p>
              ) : (
                <ul className="max-h-112 overflow-y-auto p-1 [scrollbar-color:var(--muted-foreground)_transparent] scrollbar-thin">
                  {searchResults.map((result) => (
                    <li key={result.address}>
                      <button
                        type="button"
                        onClick={() => onOpenResult?.(result.address)}
                        className="block w-full cursor-pointer rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
                      >
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-sm font-medium">
                            {result.title}
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                            {result.address}
                          </span>
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                          <Highlight text={result.snippet} query={searchQuery} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </form>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenHistory}
            className="rounded-full cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <Clock3 />
            <span className="hidden lg:inline">History</span>
          </Button>

          <Button
            size="sm"
            onClick={onOpenPublish}
            className="cursor-pointer rounded-full bg-foreground px-3 text-background shadow-sm hover:bg-foreground/90"
          >
            <Plus />
            <span className="hidden sm:inline">Publish</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={
                activeUser
                  ? `Browsing as ${activeUser.name}`
                  : "Choose who to browse as"
              }
              className="flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border/70 bg-background/60 py-0 pl-1 pr-2 text-sm outline-none transition-colors hover:border-border hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-border data-popup-open:bg-muted sm:w-36"
            >
              {activeUser ? (
                <>
                  <Avatar name={activeUser.name} />
                  <span className="hidden min-w-0 flex-1 truncate text-left font-medium sm:inline">
                    {activeUser.name.split(" ")[0]}
                  </span>
                </>
              ) : (
                <>
                  <span
                    aria-hidden
                    className="size-6 shrink-0 animate-pulse rounded-full bg-muted"
                  />
                  <span className="hidden min-w-0 flex-1 truncate text-left text-muted-foreground sm:inline">
                    {usersStatus === "error" ? "No people" : "Loading"}
                  </span>
                </>
              )}
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-60">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Browsing as</DropdownMenuLabel>
              </DropdownMenuGroup>

              {usersStatus === "loading" && (
                <div className="space-y-1 p-0.5" aria-hidden>
                  {[0, 1, 2].map((row) => (
                    <div key={row} className="flex items-center gap-2 px-1 py-1.5">
                      <span className="size-5 animate-pulse rounded-full bg-muted" />
                      <span className="h-3 w-24 animate-pulse rounded-full bg-muted" />
                    </div>
                  ))}
                </div>
              )}

              {usersStatus === "error" && (
                <p className="px-1.5 pb-1 pt-0.5 text-xs leading-snug text-muted-foreground">
                  Couldn&apos;t load people from {API_BASE_URL}.
                </p>
              )}

              {usersStatus === "ready" && (
                <DropdownMenuRadioGroup
                  value={activeUserId}
                  onValueChange={handleUserChange}
                >
                  {users.map((person) => (
                    <DropdownMenuRadioItem
                      key={person.id}
                      value={person.id}
                      className="py-1.5 pr-8"
                    >
                      <Avatar name={person.name} className="size-5 text-[9px]" />
                      <span className="truncate">{person.name}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
