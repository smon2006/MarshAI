import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Sleep function for rate limiting
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
