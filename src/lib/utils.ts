/* eslint-disable  @typescript-eslint/no-explicit-any */
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);

    return response.data;
  } catch (error: any) {
    console.error("Fetcher error:", error.message);
    throw error;
  }
};
