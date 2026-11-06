import { site } from "../config";

export function absoluteUrl(pathname: string, origin: URL | string | undefined = site.url): string {
  const base = origin instanceof URL ? origin : new URL(origin ?? site.url);
  return new URL(pathname, base).toString();
}
