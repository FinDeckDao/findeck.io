import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Handles merging tailwind css rules.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Checks to see if a key that is the same as the string passed in exists.
export function hasKey<K extends string>(
  obj: unknown,
  key: K
): obj is { [key in K]: unknown } {
  return typeof obj === "object" && obj !== null && key in obj;
}
