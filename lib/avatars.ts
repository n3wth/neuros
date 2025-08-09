/**
 * Simple avatar generation using DiceBear
 * No complex color systems - just clean, consistent avatars
 */

export function getAvatar(seed: string | number): string {
  const seedStr = typeof seed === 'string' ? seed : seed.toString();
  return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(seedStr)}&backgroundColor=transparent`;
}

export function getMultipleAvatars(count: number, baseSeed: string = 'user'): string[] {
  return Array.from({ length: count }, (_, i) => getAvatar(`${baseSeed}-${i}`));
}