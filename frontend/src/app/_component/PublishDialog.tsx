"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { getUsers, publishSite, type User } from "@/lib/api";

type PublishDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string;
  onPublished: (address: string) => void;
};

function Initials({ name }: { name: string }) {
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-foreground text-[9px] font-semibold text-background">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export default function PublishDialog({
  open,
  onOpenChange,
  currentUserId,
  onPublished,
}: PublishDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [authorId, setAuthorId] = useState(currentUserId ?? "");
  const [menuOpen, setMenuOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [html, setHtml] = useState("");
  const [busy, setBusy] = useState(false);

  const [touched, setTouched] = useState({
    author: false,
    title: false,
    address: false,
    html: false,
  });

  useEffect(() => {
    if (open && !authorId && currentUserId) setAuthorId(currentUserId);
  }, [open, authorId, currentUserId]);

  useEffect(() => {
    if (!open) return;
    getUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setTouched({ author: false, title: false, address: false, html: false });
  }, [open]);

  const author = users.find((user) => user.id === authorId) ?? null;

  const errors = {
    author: authorId ? "" : "Choose who is publishing.",
    title: title.trim() ? "" : "A title is required.",
    address: address.trim() ? "" : "An address is required.",
    html: html.trim() ? "" : "The page needs some HTML.",
  };

  const ready = !errors.author && !errors.title && !errors.address && !errors.html;
  const errorOf = (field: keyof typeof errors) =>
    touched[field] ? errors[field] : "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ author: true, title: true, address: true, html: true });
    if (!ready || busy) return;

    setBusy(true);

    try {
      const created = await publishSite({
        authorId,
        address: address.trim(),
        title: title.trim(),
        html,
      });

      setTitle("");
      setAddress("");
      setHtml("");
      setTouched({ author: false, title: false, address: false, html: false });

      toast.success(created.message, { description: created.address });
      onPublished(created.address);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Internal server error",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Publish a page</DialogTitle>
            <DialogDescription>
              An address, a title, and the HTML you wrote.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Author
            </span>

            <DropdownMenu
              open={menuOpen}
              onOpenChange={(next) => {
                setMenuOpen(next);
                if (!next) {
                  setTouched((old) => ({ ...old, author: true }));
                }
              }}
            >
              <DropdownMenuTrigger
                aria-label="Choose the author"
                aria-invalid={errorOf("author") ? true : undefined}
                className={`flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-2.5 text-sm outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-muted ${errorOf("author")
                    ? "border-destructive"
                    : "border-border/70"
                  }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Initials name={author?.name ?? "?"} />
                  <span className="truncate font-medium">
                    {author?.name ?? "Choose a person"}
                  </span>
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuRadioGroup
                  value={authorId}
                  onValueChange={(value) => {
                    setAuthorId(String(value));
                    setMenuOpen(false);
                  }}
                >
                  {users.map((user) => (
                    <DropdownMenuRadioItem
                      key={user.id}
                      value={user.id}
                      className="py-1.5 pr-8"
                    >
                      <Initials name={user.name} />
                      <span className="truncate">{user.name}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {errorOf("author") && (
              <span className="text-[11px] text-destructive">
                {errors.author}
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Title
              </span>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={() =>
                  setTouched((old) => ({ ...old, title: true }))
                }
                aria-invalid={errorOf("title") ? true : undefined}
                placeholder="Tidepool"
                autoComplete="off"
              />
              {errorOf("title") && (
                <span className="text-[11px] text-destructive">
                  {errors.title}
                </span>
              )}
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Address
              </span>
              <Input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                onBlur={() =>
                  setTouched((old) => ({ ...old, address: true }))
                }
                aria-invalid={errorOf("address") ? true : undefined}
                placeholder="tidepool.zz"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                className="font-mono"
              />
              {errorOf("address") && (
                <span className="text-[11px] text-destructive">
                  {errors.address}
                </span>
              )}
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              HTML
            </span>
            <textarea
              value={html}
              onChange={(event) => setHtml(event.target.value)}
              onBlur={() => setTouched((old) => ({ ...old, html: true }))}
              aria-invalid={errorOf("html") ? true : undefined}
              placeholder={"<h1>Hello</h1>\n<p>This is my page.</p>"}
              spellCheck={false}
              className="min-h-44 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 font-mono text-xs leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
            />
            {errorOf("html") && (
              <span className="text-[11px] text-destructive">
                {errors.html}
              </span>
            )}
          </label>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!ready || busy}
              className="cursor-pointer"
            >
              {busy ? "Publishing…" : "Publish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
