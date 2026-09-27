export interface SanitizeOptions {
  strict?: boolean;
}

const SAFE_TAGS = new Set([
  "b", "i", "u", "strong", "em", "s", "del", "ins", "mark", "sub", "sup",
  "p", "br", "ul", "ol", "li", "blockquote", "code", "pre", "span",
  "h1", "h2", "h3", "h4", "h5", "h6", "table", "thead", "tbody", "tr", "td", "th",
]);

const SAFE_ATTRS = new Set([
  "class", "style", "href", "title", "alt", "src", "width", "height", "colspan", "rowspan",
]);

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function naiveSanitize(html: string): string {
  if (typeof window === "undefined") return stripTags(html);
  const doc = new DOMParser().parseFromString(html, "text/html");
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (
        node.textContent?.replace(
          /[<>&"]/g,
          (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] ?? c)
        ) ?? ""
      );
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    if (!SAFE_TAGS.has(tag)) {
      return Array.from(node.childNodes).map(walk).join("");
    }
    const attrs = Array.from(el.attributes)
      .filter((a) => SAFE_ATTRS.has(a.name) && !a.value.startsWith("javascript:"))
      .map((a) => `${a.name}="${a.value.replace(/"/g, "&quot;")}"`)
      .join(" ");
    const inner = Array.from(node.childNodes).map(walk).join("");
    return attrs ? `<${tag} ${attrs}>${inner}</${tag}>` : `<${tag}>${inner}</${tag}>`;
  };
  return Array.from(doc.body.childNodes).map(walk).join("");
}

export function sanitizeHtml(html: string, opts: SanitizeOptions = {}): string {
  if (!html) return "";
  const { strict = true } = opts;
  if (
    typeof window !== "undefined" &&
    (window as unknown as { DOMPurify?: { sanitize: (h: string, cfg?: object) => string } }).DOMPurify
  ) {
    const DP = (window as unknown as { DOMPurify: { sanitize: (h: string, cfg?: object) => string } }).DOMPurify;
    return DP.sanitize(
      html,
      strict
        ? {
            ALLOWED_TAGS: Array.from(SAFE_TAGS),
            ALLOWED_ATTR: Array.from(SAFE_ATTRS),
          }
        : undefined
    );
  }
  return naiveSanitize(html);
}
