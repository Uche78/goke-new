"use client";

interface Props {
  text: string;
  className?: string;
}

/**
 * Renders AI-generated text with proper paragraph and list formatting.
 * Splits on double newlines for paragraphs; detects lines starting with
 * -, •, or numbers as list items.
 */
export function FormattedText({ text, className = "" }: Props) {
  const safeText = typeof text === "string" ? text : Array.isArray(text) ? (text as string[]).join("\n") : String(text ?? "");
  const blocks = safeText.split(/\n{2,}/).filter(Boolean);

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter(Boolean);
        const isList = lines.every((l) => /^[-•*]|\d+\./.test(l.trimStart()));

        if (isList) {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {lines.map((line, j) => (
                <li key={j} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <span>{line.replace(/^[-•*]\s*|\d+\.\s*/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Mixed block — render each line, treating bullet lines as list items
        const hasMixed = lines.some((l) => /^[-•*]|\d+\./.test(l.trimStart()));
        if (hasMixed) {
          return (
            <div key={i} className="space-y-1.5">
              {lines.map((line, j) => {
                const isBullet = /^[-•*]|\d+\./.test(line.trimStart());
                if (isBullet) {
                  return (
                    <div key={j} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      <span>{line.replace(/^[-•*]\s*|\d+\.\s*/, "")}</span>
                    </div>
                  );
                }
                return (
                  <p key={j} className="text-muted-foreground leading-relaxed">{line}</p>
                );
              })}
            </div>
          );
        }

        return (
          <p key={i} className="text-muted-foreground leading-relaxed">{block}</p>
        );
      })}
    </div>
  );
}
