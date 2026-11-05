"use client";

import { useRef } from "react";

type SiteFrameProps = {
  html: string;
  title: string;
  onFollow: (address: string) => void;
};

function addressFromHref(href: string | null): string | null {
  let value = (href ?? "").trim().toLowerCase();

  if (!value || value.startsWith("#")) return null;
  if (/^(javascript|mailto|tel|data|blob):/.test(value)) return null;

  value = value
    .replace(/^https?:\/\//, "")
    .replace(/^\/\//, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  return value || null;
}

export default function SiteFrame({ html, title, onFollow }: SiteFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  function handleLoad() {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    doc.addEventListener(
      "click",
      (event) => {
        const link = (event.target as Element | null)?.closest?.("a[href]");
        if (!link) return;

        const address = addressFromHref(link.getAttribute("href"));
        if (!address) return;

        event.preventDefault();
        onFollow(address);
      },
      true,
    );

    doc.addEventListener("submit", (event) => event.preventDefault(), true);
  }

  return (
    <iframe
      ref={frameRef}
      title={title}
      srcDoc={html}
      sandbox="allow-same-origin"
      referrerPolicy="no-referrer"
      onLoad={handleLoad}
      className="h-full w-full border-0"
    />
  );
}
