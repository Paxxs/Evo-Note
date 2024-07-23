"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface WorkspaceSwitcherProps {
  isCollapsed: boolean;
  workspaces: {
    label: string;
    id: string;
    icon: React.ReactNode;
  }[];
  value?: string; // 设置选中项 id
  onChange?: (value: string) => void;
}

export const WorkspaceSwitcher = React.memo(function WorkspaceSwitcher({
  isCollapsed,
  workspaces,
  value,
  onChange,
}: WorkspaceSwitcherProps) {
  const [selectedWorkdpace, setSelectedWorkspace] = React.useState<string>(
    value || workspaces[0].id,
  );

  function handleChange(value: string) {
    setSelectedWorkspace(value);
    onChange?.(value);
  }

  return (
    <Select defaultValue={selectedWorkdpace} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "flex h-10 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-10 w-10 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          {
            workspaces.find((collection) => collection.id === selectedWorkdpace)
              ?.icon
          }
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {
              workspaces.find(
                (collection) => collection.id === selectedWorkdpace,
              )?.label
            }
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {workspaces.map((collection) => (
          <SelectItem key={collection.id} value={collection.id}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {collection.icon}
              {collection.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
