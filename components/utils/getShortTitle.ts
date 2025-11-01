// utils/getShortTitle.ts

const STOPWORDS = [
  "for", "the", "of", "in", "on", "to", "by", "with", "and", "at", "from",
  "a", "an", "apply", "online", "check", "now", "various", "posts", "out"
];

/**
 * Shortens long titles by removing filler words and limiting to 4–6 key terms.
 * Example:
 *  "MPESB Group 2 Sub Group 3 Recruitment 2025 Apply Online for Various Posts"
 *   → "MPESB Group 2 Sub Group 3 Recruitment 2025"
 */
export function getShortTitle(title: string): string {
  if (!title) return "";

  const words = title
    .split(" ")
    .filter(w => w && !STOPWORDS.includes(w.toLowerCase()));

  // Limit to first 5–6 meaningful words
  const shortWords = words.slice(0, 6);
  return shortWords.join(" ");
}
