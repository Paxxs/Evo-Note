import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";

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

export default function SysMenu({ className, items }: sysMenuProps) {
  return (
    <Menubar className={cn("rounded-none shadow-none", className)}>
      <MenubarMenu>
        <MenubarTrigger className="text-muted-foreground hover:text-primary">
          File
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="text-muted-foreground hover:text-primary">
          Edit
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="text-muted-foreground hover:text-primary">
          View
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="text-muted-foreground hover:text-primary">
          Help
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
