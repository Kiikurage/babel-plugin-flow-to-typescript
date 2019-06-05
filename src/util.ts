const onlyOnceFlagSet = new Set<string | number | boolean>();

export function warnOnlyOnce(key: string | number | boolean, message?: string) {
  if (!message) message = String(key);

  if (onlyOnceFlagSet.has(key)) return;
  onlyOnceFlagSet.add(key);
  console.warn(message);
}

export class UnsupportedError extends Error {}

UnsupportedError.prototype.name = UnsupportedError.name;
