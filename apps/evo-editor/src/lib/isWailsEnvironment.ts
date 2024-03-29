declare global {
  interface Window {
    wails: any;
  }
}

export const isWailsEnvironment = (): boolean => {
  return typeof window !== "undefined" && typeof window.wails !== "undefined";
};
