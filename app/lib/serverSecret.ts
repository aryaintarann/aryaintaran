import { readFileSync } from "node:fs";

const secretCache = new Map<string, string | undefined>();

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

  secretCache.set(key, undefined);
  return undefined;
}
