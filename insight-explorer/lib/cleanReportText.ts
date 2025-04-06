import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

// Create a jsdom window for DOMPurify to run in Node.
const window = new JSDOM("").window;
const domPurify = DOMPurify(window);

// Remove common markdown symbols.
function stripMarkdown(text: string): string {
  return text
    // Remove markdown headings (e.g., "# Heading")
    .replace(/^\s*#+\s+/gm, "")
    // Remove bold and italic markers (e.g., **bold**, __bold__, *italic*, _italic_)
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove inline code markers (e.g., `code`)
    .replace(/`(.*?)`/g, "$1")
    // Remove strikethrough markers (e.g., ~~text~~)
    .replace(/~~(.*?)~~/g, "$1")
    // Remove blockquote markers (e.g., "> ")
    .replace(/^>\s+/gm, "")
    // Remove markdown links, keeping just the link text.
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

// Remove duplicate consecutive lines.
function removeDuplicateLines(text: string): string {
  const lines = text.split("\n");
  const uniqueLines = lines.filter((line, index) => index === 0 || line.trim() !== lines[index - 1].trim());
  return uniqueLines.join("\n");
}

/**
 * Cleans the raw report text by sanitizing HTML, stripping markdown, and removing duplicate lines.
 * @param rawText - The raw text from DeepSeek.
 * @returns The cleaned plain text.
 */
export function cleanReportText(rawText: string): string {
  // Remove any unwanted HTML.
  const sanitized = domPurify.sanitize(rawText);
  // Remove markdown formatting.
  const plainText = stripMarkdown(sanitized);
  // Remove duplicate lines.
  const finalText = removeDuplicateLines(plainText);
  return finalText.trim();
}
