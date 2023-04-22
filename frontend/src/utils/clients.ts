import { useEffect, useState } from "react";
import type { Code } from "~/types/code";

console.log({
  server: process.env.NEXT_PUBLIC_SERVER_HOST,
  port: process.env.NEXT_PUBLIC_SERVER_PORT,
});

const server = `http://${process.env.NEXT_PUBLIC_SERVER_HOST || "localhost"}:${
  process.env.NEXT_PUBLIC_SERVER_PORT || "8000"
}`;

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export const sendDataToApi = async (
  data: Code
): Promise<string | undefined> => {
  try {
    const response = await fetch(`${server}/gen/code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return (await response.json()) as string;
  } catch (error) {
    console.error("Error:", error);
  }
};
