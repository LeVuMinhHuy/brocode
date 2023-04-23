import { useEffect, useState } from "react";
import type { Code } from "~/types/code";

const server = `${process.env.NEXT_PUBLIC_SERVER_HOST || "http://localhost"}:${
  process.env.NEXT_PUBLIC_SERVER_PORT || ""
}`;

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export const healthCheckApi = async (): Promise<boolean | undefined> => {
  try {
    const response = await fetch(`${server}`, {
      method: "GET",
    });

    const data = (await response.json()) as string;

    console.log({ data });

    return true;
  } catch (error) {
    console.error("Error:", error);
  }
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
