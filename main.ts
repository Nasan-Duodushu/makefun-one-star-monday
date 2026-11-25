// One Star for Monday — a one-star review of Monday written as if Monday
// were a restaurant. Gate: /output/entry.txt, UTF-8, 1-180 chars, at most 25 words.
import { mkdir, writeFile, chmod } from "node:fs/promises";
import { join } from "node:path";

const OUT = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const MAX_CHARS = 180;
const MAX_WORDS = 25;

// The review is four clauses: the rating, the menu, the service, the bill.
const CLAUSES = {
  rating: "One star.",
  menu: "Monday's menu is just 'meetings',",
  service: "the waiter brought my weekend back cold,",
  bill: "and I was charged for the coffee I needed to survive.",
};

function compose(clauses: Record<string, string>): string {
  return Object.values(clauses).join(" ").replace(/\s+/g, " ").trim();
}

function countWords(line: string): number {
  return line.split(" ").filter(Boolean).length;
}

function checkLine(line: string): void {
  if (/[\r\n]/.test(line)) throw new Error("review must be a single line");
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`review must be 1-${MAX_CHARS} chars, got ${line.length}`);
  }
  const words = countWords(line);
  if (words > MAX_WORDS) {
    throw new Error(`review must be at most ${MAX_WORDS} words, got ${words}`);
  }
  if (!/Monday/.test(line)) {
    throw new Error("the review must name the restaurant: Monday");
  }
  if (!line.startsWith("One star.")) {
    throw new Error("the review must open with its rating");
  }
}

async function main(): Promise<void> {
  const line = compose(CLAUSES);
  checkLine(line);
  await mkdir(OUT, { recursive: true });
  const target = join(OUT, "entry.txt");
  await writeFile(target, line + "\n", "utf8");
  await chmod(target, 0o644);
  console.log(`${line.length} chars, ${countWords(line)} words: ${line}`);
}

await main();
