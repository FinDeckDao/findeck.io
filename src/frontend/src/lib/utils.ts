import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

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

// Date formatter.
export const formatDate = (dateValue: bigint) => {
  try {
    // Convert nanoseconds to milliseconds
    const milliseconds = Number(dateValue / BigInt(1000000));

    const date = new Date(milliseconds);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return format(date, "PPP");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};
