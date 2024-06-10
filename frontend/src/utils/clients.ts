import { useEffect, useState } from "react";
import axios from "axios";
import { Model } from "~/pages";

const serverPublic = `${
  process.env.NEXT_PUBLIC_SERVER_PUBLIC_HOST ||
  "https://tedvuminhhuy--example-axolotl-inference-web.modal.run"
}`;

const serverPrivate = `${
  process.env.NEXT_PUBLIC_SERVER_PRIVATE_HOST ||
  "https://levuminhhuycompsci--example-axolotl-inference-web.modal.run"
}`;

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export const healthCheckPublicApi = async (): Promise<boolean | undefined> => {
  try {
    const response = await fetch(`${serverPublic}`, {
      method: "GET",
    });

    await response.json();

    return true;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const healthCheckPrivateApi = async (): Promise<boolean | undefined> => {
  try {
    const response = await fetch(`${serverPrivate}`, {
      method: "GET",
    });

    await response.json();

    return true;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const sendDataToApi = async (
  data: string,
  model: Model
): Promise<string | undefined> => {
  try {
    let modelEndpoint = "";
    let updatedData = data;

    if (model === Model.PRIVATE) {
      modelEndpoint = serverPrivate;
      updatedData = `[INST] ${data} [/INST]`;
    }

    if (model === Model.PUBLIC) {
      modelEndpoint = serverPublic;
    }

    if (!modelEndpoint) {
      return undefined;
    }

    updatedData = encodeURIComponent(updatedData);

    const response = await axios.get(`${modelEndpoint}`, {
      params: { input: updatedData },
    });

    return decodeURIComponent(response.data as string);
  } catch (error) {
    console.error("Error:", error);
    return undefined;
  }
};
