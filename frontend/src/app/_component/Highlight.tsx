
function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function Highlight({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const words = query.trim().split(/\s+/).filter(Boolean).map(escapeRegExp);
  if (words.length === 0) return <>{text}</>;

  const matched = new RegExp(`^(${words.join("|")})$`, "i");

  return (
    <>
      {text.split(new RegExp(`(${words.join("|")})`, "gi")).map((part, at) =>
        matched.test(part) ? (
          <mark
            key={at}
            className="rounded-sm bg-yellow-200 px-0.5 text-foreground"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
