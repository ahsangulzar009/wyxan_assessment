export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        The small web
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        Type an address to begin
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Every page you visit is recorded against the person you are browsing as.
      </p>
    </div>
  );
}
