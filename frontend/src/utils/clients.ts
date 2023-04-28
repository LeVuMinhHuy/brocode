import { useEffect, useState } from "react";
import type { Code, ResponseData } from "~/types/code";

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

    await response.json();

    return true;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const sendDataToApi = async (
  data: Code
): Promise<ResponseData | undefined> => {
  try {
    console.log({ data });
    const response = await fetch(`${server}/gen/code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return (await response.json()) as ResponseData;
  } catch (error) {
    console.error("Error:", error);
  }
};
