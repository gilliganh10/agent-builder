import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Readable light surfaces for inputs on gray panels (light: white fill). */
export const formControlSurface =
  "bg-white text-foreground shadow-sm dark:bg-zinc-950 dark:text-zinc-50";
