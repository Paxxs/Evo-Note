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
  }[];
  className?: string;
}
export function Nav({ isCollapsed, links, className }: NavProps) {
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
                      href="#"
                      className={cn(
                        buttonVariants({ variant: link.variant, size: "icon" }),
                        // "h-10"
                        "h-11 w-11"
                      )}
                    >
                      <link.icon className="h-6 w-6" />
                      <span className="sr-only">{link.title}</span>
                    </Link>
                  ) : (
                    // 未收缩时候显示长条
                    <Link
                      key={index}
                      href="#"
                      className={cn(
                        buttonVariants({ variant: link.variant, size: "lg" }),
                        "justify-start",
                        "h-11 pl-3"
                      )}
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
