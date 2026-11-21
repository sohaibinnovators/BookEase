const snapshotVersions = new Map<string, number>();
const snapshotCache = new Map<string, { version: number; value: unknown }>();

export function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Invalidate cached useSyncExternalStore snapshots after writes. */
export function invalidateStorageCache(key: string) {
  snapshotVersions.set(key, (snapshotVersions.get(key) ?? 0) + 1);
}

export function getCachedSnapshot<T>(key: string, compute: () => T): T {
  const version = snapshotVersions.get(key) ?? 0;
  const hit = snapshotCache.get(key);
  if (hit && hit.version === version) return hit.value as T;
  const value = compute();
  snapshotCache.set(key, { version, value });
  return value;
}

export function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T, eventName: string) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    invalidateStorageCache(key);
    window.dispatchEvent(new Event(eventName));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

/** Strip angle brackets from user-entered demo text (no HTML rendering). */
export function sanitizeUserText(input: string) {
  return input.replace(/[<>]/g, "").trim();
}

export function subscribeToKey(key: string, eventName: string, listener: () => void) {
  if (!canUseStorage()) return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) listener();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(eventName, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(eventName, listener);
  };
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
