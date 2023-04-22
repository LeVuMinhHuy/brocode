import { useEffect, useState } from "react";
import type { Code } from "~/types/code";

const server = `http://${process.env.SERVER_HOST || "localhost"}:${
  process.env.SERVER_PORT || "8000"
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
