import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type NotFoundProps = {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
};

export default function NotFound({
  icon,
  eyebrow,
  title,
  body,
  actionLabel,
  onAction,
}: NotFoundProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 pb-16">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-muted">
          {icon}
        </span>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-2 wrap-break-word text-xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        <Button
          onClick={onAction}
          className="mt-6 cursor-pointer rounded-full"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
