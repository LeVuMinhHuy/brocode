import { useEffect, useState } from "react";
import axios from "axios";

const server = `${
  process.env.NEXT_PUBLIC_SERVER_HOST ||
  "https://vothinguyenhue--example-axolotl-inference-web.modal.run"
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
  data: string
): Promise<string | undefined> => {
  try {
    const response = await axios.get(
      `https://vothinguyenhue--example-axolotl-inference-web.modal.run/`,
      {
        params: { input: data },
      }
    );

    return response.data as string;
  } catch (error) {
    console.error("Error:", error);
    return undefined;
  }
};
