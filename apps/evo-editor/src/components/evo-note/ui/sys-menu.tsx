import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@/components/ui/menubar";
import React, { memo } from "react";

// 定义菜单项类型
type MenuItemType = "item" | "separator" | "sub";

// 定义基础菜单项接口
interface BaseMenuItem {
  type: MenuItemType;
  label?: string;
  shortcut?: string;
}

// 定义具体菜单项接口
interface Item extends BaseMenuItem {
  type: "item";
}

interface Separator extends BaseMenuItem {
  type: "separator";
}

interface SubMenu extends BaseMenuItem {
  type: "sub";
  items: MenuItem[];
}

type MenuItem = Item | Separator | SubMenu;

// 定义菜单数据接口
interface MenuData {
  title: string;
  items: MenuItem[];
}

interface sysMenuProps {
  className?: string;
  items: MenuData[];
}

const SysMenu = memo(function SysMenu({ className, items }: sysMenuProps) {
  console.log("SysMenu 重新渲染了");
  /**
   * Renders the menu items based on the provided data.
   *
   * @param {MenuItem[]} items - The array of menu items to be rendered.
   * @return {ReactNode} The rendered menu items as React components.
   */
  const renderMenuItem = (items: MenuItem[]) =>
    items.map((item, index) => {
      switch (item.type) {
        case "item":
          return (
            <MenubarItem key={index}>
              {item.label}
              {item.shortcut && (
                <MenubarShortcut>{item.shortcut}</MenubarShortcut>
              )}
            </MenubarItem>
          );
        case "separator":
          return <MenubarSeparator key={index} />;
        case "sub":
          return (
            <MenubarSub key={index}>
              <MenubarSubTrigger>{item.label}</MenubarSubTrigger>
              <MenubarSubContent>
                {renderMenuItem(item.items)}
              </MenubarSubContent>
            </MenubarSub>
          );
        default:
          return <></>;
      }
    });
  return (
    <Menubar className={className}>
      {items.map((item, index) => (
        <MenubarMenu key={index}>
          <MenubarTrigger className="text-muted-foreground hover:text-primary">
            {item.title}
          </MenubarTrigger>
          <MenubarContent>{renderMenuItem(item.items)}</MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
});

export { SysMenu, type MenuData };
