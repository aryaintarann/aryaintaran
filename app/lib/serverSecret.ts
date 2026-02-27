import { readFileSync } from "node:fs";
import path from "node:path";

const secretCache = new Map<string, string | undefined>();

const fallbackSecretFileMap: Record<string, string> = {
  GEMINI_API_KEY: path.join(process.cwd(), ".docker", "secrets", "gemini_api_key.txt"),
  GOOGLE_TRANSLATE_API_KEY: path.join(process.cwd(), ".docker", "secrets", "google_translate_api_key.txt"),
};

export function getServerSecret(key: string): string | undefined {
  if (secretCache.has(key)) {
    return secretCache.get(key);
  }

  const fromFilePath = process.env[`${key}_FILE`]?.trim();
  if (fromFilePath) {
    try {
      const value = readFileSync(fromFilePath, "utf8").trim();
      const normalized = value || undefined;
      secretCache.set(key, normalized);
      return normalized;
    } catch {
      secretCache.set(key, undefined);
      return undefined;
    }
  }

  const directValue = process.env[key]?.trim();
  if (directValue) {
    secretCache.set(key, directValue);
    return directValue;
  }

  const fallbackFilePath = fallbackSecretFileMap[key];
  if (fallbackFilePath) {
    try {
      const value = readFileSync(fallbackFilePath, "utf8").trim();
      const normalized = value || undefined;
      secretCache.set(key, normalized);
      return normalized;
    } catch {
      // fallback file may not exist in non-docker env
    }
  }

  secretCache.set(key, undefined);
  return undefined;
}
