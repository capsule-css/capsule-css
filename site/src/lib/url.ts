const BASE = import.meta.env.BASE_URL;

export function url(path: string): string {
  return `${BASE}${path.replace(/^\/+/, "")}`;
}
