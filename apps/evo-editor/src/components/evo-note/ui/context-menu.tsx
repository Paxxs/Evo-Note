import {
  ContextMenu as ShadcnContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import React from "react";

// 菜单类型
type ContextMenuType = "item" | "checkbox" | "radio" | "separator" | "sub";

// 基础菜单项接口
interface BaseContextMenuItem {
  type: ContextMenuType;
  label?: string | JSX.Element;
  shortcut?: string;
  disabled?: boolean;
}

// 定义具体菜单接口
interface Item extends BaseContextMenuItem {
  type: "item";
  onClick?: (event: React.MouseEvent, item: Item) => void;
}

interface CheckboxItem extends BaseContextMenuItem {
  type: "checkbox";
  checked: boolean;
  onClick?: (event: React.MouseEvent, item: CheckboxItem) => void;
}

interface RadioItem extends BaseContextMenuItem {
  type: "radio";
  label: string; // 用于显示大标题或者组标签
  value: string; // 当前选择的选项的value
  values: {
    name: string; // 显示给用户的选项名
    value: string; // 选项的实际值
  }[];
  onClick?: (event: React.MouseEvent, value: string, item: RadioItem) => void; // 点击事件回调，传递选中项的value
}

interface SeparatorItem {
  type: "separator";
}

interface SubMenuItem extends BaseContextMenuItem {
  type: "sub";
  items: ContextMenuItemI[]; // 使用联合类型来表示子菜单项可以是任何类型的菜单项
}

// 使用联合类型来定义可以接受的菜单项
type ContextMenuItemI =
  | Item
  | CheckboxItem
  | RadioItem
  | SeparatorItem
  | SubMenuItem;

// 定义菜单Props
interface MenuProps {
  items: ContextMenuItemI[];
  className?: string;
  children: React.ReactNode;
}

export default function ContextMenu({ items, className, children }: MenuProps) {
  const renderMenuItem = (item: ContextMenuItemI, index: number) => {
    switch (item.type) {
      case "item":
        return (
          <ContextMenuItem
            key={index}
            onClick={(e) => item.onClick?.(e, item)}
            disabled={item.disabled}
            inset
          >
            {item.label}
            {item.shortcut && (
              <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
            )}
          </ContextMenuItem>
        );
      case "sub":
        return (
          <ContextMenuSub key={index}>
            <ContextMenuSubTrigger inset>{item.label}</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              {item.items.map((subItem, key) => renderMenuItem(subItem, key))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        );
      case "separator":
        return <ContextMenuSeparator key={index} />;
      case "checkbox":
        return (
          <ContextMenuCheckboxItem checked={item.checked} key={index}>
            {item.label}
            {item.shortcut && (
              <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
            )}
          </ContextMenuCheckboxItem>
        );
      case "radio":
        return (
          <ContextMenuRadioGroup value={item.value} key={index}>
            <ContextMenuLabel inset>{item.label}</ContextMenuLabel>
            <ContextMenuSeparator />
            {item.values.map((option) => (
              <ContextMenuRadioItem
                key={option.value}
                value={option.value}
                onClick={(e) => item.onClick?.(e, option.value, item)}
              >
                {option.name}
              </ContextMenuRadioItem>
            ))}
          </ContextMenuRadioGroup>
        );
    }
  };
  return (
    <ShadcnContextMenu>
      <ContextMenuTrigger className={className}>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {items.map((item, index) => renderMenuItem(item, index))}
      </ContextMenuContent>
    </ShadcnContextMenu>
  );
}
