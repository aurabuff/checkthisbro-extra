export type TokenModel = "gpt4" | "gemini";

export function estimateTokens(text: string, model: TokenModel) {
  const cleaned = text.trim();

  if (!cleaned) {
    return 0;
  }

  const characters = cleaned.length;
  const words = cleaned.split(/\s+/).length;
  const punctuation = (cleaned.match(/[^\w\s]/g) ?? []).length;
  const codePenalty = (cleaned.match(/[{}()[\]<>_=;:/\\|]/g) ?? []).length;

  const base =
    model === "gpt4"
      ? characters / 4.0 + words * 0.12 + punctuation * 0.08 + codePenalty * 0.05
      : characters / 3.6 + words * 0.1 + punctuation * 0.07 + codePenalty * 0.04;

  return Math.max(1, Math.ceil(base));
}
