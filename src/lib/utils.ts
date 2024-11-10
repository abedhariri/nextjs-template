import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string | undefined | null): string {
  if (!name) return "Not logged in";
  // Split the name by space to determine if it has both first and last name
  const nameParts = name.trim().split(" ");

  if (nameParts.length > 1) {
    // If there are multiple parts, return the first letter of each (assumes first name and last name)
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  } else {
    // If there is only one part, return the first two letters in uppercase
    return nameParts[0].substring(0, 2).toUpperCase();
  }
}
