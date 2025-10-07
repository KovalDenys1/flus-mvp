const ALLOWED = ["linkedin.com", "github.com"];

export function isAllowedSocial(url: string): boolean {
  try {
    const u = new URL(url);
    return ALLOWED.some(d => u.hostname.endsWith(d));
  } catch { return false; }
}

export function stripPII(text: string): string {
  // email
  let out = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[e-post skjult]");
  out = out.replace(/\b(?:\+?\d[\s-]?){8,}\b/g, "[telefon skjult]");
  return out;
}