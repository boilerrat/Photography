import { RollMeta } from '@/types';

/**
 * Creates a slug from a string by lowercasing and replacing spaces with hyphens
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a filename for a roll based on the metadata
 * Format: YYYY-MM-DD-<film>-<slug>.md
 */
export function generateFilename(meta: RollMeta): string {
  const date = meta.date;
  const filmSlug = createSlug(meta.filmStock);
  const rollSlug = createSlug(meta.rollId);
  
  return `${date}-${filmSlug}-${rollSlug}.md`;
}

/**
 * Extracts date from filename for sorting and display
 */
export function extractDateFromFilename(filename: string): string | null {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
  return match ? match[1] : null;
}
