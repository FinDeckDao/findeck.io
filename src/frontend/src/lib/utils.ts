import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasKey<K extends string>(
  obj: unknown,
  key: K
): obj is { [key in K]: unknown } {
  return typeof obj === "object" && obj !== null && key in obj;
}
