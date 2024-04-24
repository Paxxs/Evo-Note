"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface IconLogoProps extends React.ComponentProps<"svg"> {
  onClick?: () => void; // 单击事件处理函数
  onDoubleClick?: () => void; // 双击事件处理函数
}

function IconLogo({
  className,
  onClick,
  onDoubleClick,
  ...props
}: IconLogoProps) {
  const [animation, setAnimation] = useState("");
  let clickCount = 0;
  let singleClickTimer: ReturnType<typeof setTimeout>;

  const handleClick = () => {
    clickCount++;
    if (clickCount === 1) {
      singleClickTimer = setTimeout(() => {
        setAnimation("animate-bounce-twice-scale");
        clickCount = 0;
        setTimeout(() => setAnimation(""), 600); // Reset animation after it completes
        if (onClick) {
          onClick(); // 调用外部传入的单击处理函数
        }
      }, 200); // Delay for distinguishing double click
    } else if (clickCount === 2) {
      clearTimeout(singleClickTimer);
      clickCount = 0;
      if (onDoubleClick) {
        onDoubleClick(); // 调用外部传入的双击处理函数
      }
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(singleClickTimer);
    };
  }, []); // 这里警告只能忽略，因为是想让组件卸载时候清除，防止内存泄漏。

  return (
    <svg
      fill="currentColor"
      viewBox="0 0 256 256"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-4 w-4", className, animation)}
      onClick={handleClick}
      {...props}
    >
      <circle cx="128" cy="128" r="128" fill="black"></circle>
      <circle cx="80" cy="128" r="18" fill="white"></circle>
      <circle cx="176" cy="128" r="18" fill="white"></circle>
    </svg>
  );
}

export { IconLogo };
