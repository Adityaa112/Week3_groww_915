export function extractBearerToken(input: unknown): string | undefined {
  const visited = new Set<unknown>();

  function normalize(value: string): string | undefined {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (trimmed.toLowerCase().startsWith("bearer ")) {
      const raw = trimmed.slice(7).trim();
      return raw || undefined;
    }
    return trimmed;
  }

  function looksLikeJwt(value: string): boolean {
    return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
  }

  function walk(node: unknown): string | undefined {
    if (node == null) return undefined;
    if (typeof node === "string") {
      const normalized = normalize(node);
      if (!normalized) return undefined;
      if (looksLikeJwt(normalized)) return normalized;
      return undefined;
    }

    if (typeof node !== "object") return undefined;
    if (visited.has(node)) return undefined;
    visited.add(node);

    if (Array.isArray(node)) {
      for (const item of node) {
        const found = walk(item);
        if (found) return found;
      }
      return undefined;
    }

    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      const lower = key.toLowerCase();
      if (typeof value === "string" && (lower.includes("token") || lower.includes("bearer") || lower.includes("jwt"))) {
        const normalized = normalize(value);
        if (normalized) return normalized;
      }
    }

    for (const value of Object.values(node as Record<string, unknown>)) {
      const found = walk(value);
      if (found) return found;
    }

    return undefined;
  }

  return walk(input);
}

