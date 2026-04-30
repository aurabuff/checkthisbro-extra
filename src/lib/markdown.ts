import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
});

turndown.addRule("strikethrough", {
  filter: ["del", "s", "strike"],
  replacement: (content) => `~~${content}~~`,
});

export function convertToMarkdown(input: string, mode: "html" | "text") {
  const raw = input.trim();

  if (!raw) {
    return "";
  }

  if (mode === "html") {
    return normalizeMarkdown(turndown.turndown(raw));
  }

  return normalizeMarkdown(plainTextToMarkdown(raw));
}

function plainTextToMarkdown(text: string) {
  const lines = text.split(/\r?\n/);
  const transformed = lines.map((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return "";
    }

    if (/^#{1,6}\s/.test(trimmed)) {
      return trimmed;
    }

    if (/^[-*•]\s+/.test(trimmed)) {
      return `- ${trimmed.replace(/^[-*•]\s+/, "")}`;
    }

    if (/^\d+[.)]\s+/.test(trimmed)) {
      return trimmed.replace(/^(\d+)[.)]\s+/, "$1. ");
    }

    return trimmed;
  });

  return transformed.join("\n");
}

function normalizeMarkdown(markdown: string) {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
