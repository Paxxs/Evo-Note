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
    href?: string;
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
  const NavLink = ({
    keyValue,
    href,
    className,
    key,
    children,
    onClick,
  }: {
    keyValue: string;
    href?: string;
    className?: string;
    key?: string;
    children?: React.ReactNode;
    onClick?: (keyValue: string) => void;
  }) => {
    const Tag = href ? Link : "a";
    // 根据是否有链接来决定使用Link还是a标签，因为如果编辑器是动态导入的，使用Link会导致第一次点击时候刷新页面（不知道为甚
    return (
      <Tag
        href={href ? href : "#"}
        className={className}
        key={key}
        onClick={() => onClick && onClick(keyValue)}
      >
        {children}
      </Tag>
    );
  };
  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        "group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2",
        className,
      )}
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          return (
            <TooltipProvider key={index} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="grid">
                  {isCollapsed ? ( // 收缩只显示图标
                    <NavLink
                      keyValue={link.keyValue}
                      href={link.href}
                      className={cn(
                        buttonVariants({
                          variant:
                            keyValue === link.keyValue ? "default" : "ghost",
                          size: "icon",
                        }),
                        // "h-10"
                        "h-11 w-11",
                        keyValue === link.keyValue &&
                          "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                      )}
                      onClick={onClick}
                    >
                      <link.icon className="h-6 w-6" />
                      <span className="sr-only">{link.title}</span>
                    </NavLink>
                  ) : (
                    // 未收缩时候显示长条
                    <NavLink
                      keyValue={link.keyValue}
                      href={link.href}
                      className={cn(
                        buttonVariants({
                          variant:
                            keyValue === link.keyValue ? "default" : "ghost",
                          size: "lg",
                        }),
                        "justify-start",
                        "h-11 pl-3",
                        keyValue === link.keyValue &&
                          "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                      )}
                      onClick={onClick}
                    >
                      <link.icon className="mr-2 h-6 w-6" />
                      {link.title}
                    </NavLink>
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
                        "ml-auto",
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
