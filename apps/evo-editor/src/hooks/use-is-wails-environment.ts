import { useEffect } from "react";

declare global {
  interface Window {
    wails: any;
  }
}

export const useIsWailsEnvironment = (): boolean => {
  //   const [isWails, setIsWails] = useState(false);

  //   useEffect(() => {
  //     setIsWails(
  //       typeof window !== "undefined" && typeof window.wails !== "undefined",
  //     );
  //   }, []);

  //   return isWails;
  const isWails =
    typeof window !== "undefined" && typeof window.wails !== "undefined";
  return isWails;
};

/**
 * 使用 TypeScript 明确函数参数类型和可选性
 *
 * @param wailsFn - 在Wails环境下执行的函数，可选
 * @param nonWailsFn - 在非Wails环境下执行的函数，可选
 */
export const useWails = (
  wailsFn?: () => void,
  nonWailsFn?: () => void,
): void => {
  const isWails = useIsWailsEnvironment();

  useEffect(() => {
    if (isWails) {
      wailsFn?.();
    } else {
      nonWailsFn?.();
    }
  }, [isWails, wailsFn, nonWailsFn]);
};
