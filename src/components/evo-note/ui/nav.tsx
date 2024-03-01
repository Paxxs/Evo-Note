"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    herf?: string;
    keyValue: string; // 用来确定选中状态
  }[];
  className?: string;
  keyValue?: string; // 选中状态显示
  onClick?: (keyValue: string) => void;
}
export function Nav({
  isCollapsed,
  links,
  keyValue,
  className,
  onClick,
}: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        "group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2",
        className
      )}
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          return (
            <TooltipProvider key={index} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {isCollapsed ? ( // 收缩只显示图标
                    <Link
                      href={link.herf ? link.herf : "#"}
                      className={cn(
                        buttonVariants({
                          variant:
                            keyValue === link.keyValue ? "default" : "ghost",
                          size: "icon",
                        }),
                        // "h-10"
                        "h-11 w-11",
                        link.variant === "default" &&
                          "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                      )}
                      onClick={() => onClick && onClick(link.keyValue)}
                    >
                      <link.icon className="h-6 w-6" />
                      <span className="sr-only">{link.title}</span>
                    </Link>
                  ) : (
                    // 未收缩时候显示长条
                    <Link
                      key={index}
                      href={link.herf ? link.herf : "#"}
                      className={cn(
                        buttonVariants({
                          variant:
                            keyValue === link.keyValue ? "default" : "ghost",
                          size: "lg",
                        }),
                        "justify-start",
                        "h-11 pl-3",
                        keyValue === link.keyValue &&
                          "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
                      )}
                      onClick={() => onClick && onClick(link.keyValue)}
                    >
                      <link.icon className="mr-2 h-6 w-6" />
                      {link.title}
                    </Link>
                  )}
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex gap-4 items-center"
                >
                  {isCollapsed && link.title}
                  {link.label && (
                    <span
                      className={cn(
                        isCollapsed && "text-muted-foreground",
                        "ml-auto"
                      )}
                    >
                      {link.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>
    </div>
  );
}
