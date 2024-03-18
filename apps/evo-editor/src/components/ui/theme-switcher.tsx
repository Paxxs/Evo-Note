"use client";

import { useConfig } from "@/hooks/use-config";
import { useEffect } from "react";

export function ThemeSwitcher() {
  const [config] = useConfig();

  useEffect(() => {
    document.body.classList.forEach((className) => {
      // 删除旧主题
      if (className.match(/theme-/)) {
        document.body.classList.remove(className);
      }
      const radiusValue = `${config.radius}rem`;
      // 设置全局弧度：
      document.body.style.setProperty("--radius", radiusValue);
      document.body.classList.add(`theme-${config.theme}`);
    });
  }, [config]);
  return null;
}
