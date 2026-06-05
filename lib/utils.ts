import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// mongodb+srv://rishabhgzp2004_db_user:l9RdvC1TTFf1gk0C@cluster0.mnozils.mongodb.net/
