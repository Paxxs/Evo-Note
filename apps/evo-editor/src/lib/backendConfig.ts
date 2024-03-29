import { GetBackendAPIURL } from "@/wails/wailsjs/go/app/App";
import { isWailsEnvironment } from "./isWailsEnvironment";
import { API_PREFIX } from "./constants";

let backendUrl: string | null = null;

export const getBackendUrl = async (): Promise<string> => {
  if (backendUrl) return backendUrl; // 如果有缓存，则直接返回

  if (isWailsEnvironment()) {
    const url = await GetBackendAPIURL();
    backendUrl = `${url}${API_PREFIX}`;
  } else {
    backendUrl = `${window.location.origin}${API_PREFIX}`;
  }
  return backendUrl;
};
