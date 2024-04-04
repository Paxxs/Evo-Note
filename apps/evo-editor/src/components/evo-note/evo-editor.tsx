import {
  BotMessageSquare,
  Files,
  PlusCircle,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { Nav } from "@/components/evo-note/ui/nav";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "../ui/separator";
import { SysMenu, type MenuData } from "./ui/sys-menu";
import { Tabs, TabsContent } from "../ui/tabs";
import { SideBarNoteList } from "./views/sidebar/sidebar-note-list";
import SideBarSearch from "./views/sidebar/sidebar-search";
import SideBarAI from "./views/sidebar/sidebar-copilot";
import SidebarTrash from "./views/sidebar/sidebar-trash";
import SidebarSettings from "./views/sidebar/sidebar-settings";
import { AccountSwitcher } from "./ui/account-switcher";
import NoteDisplay from "./views/note-display";

// import dynamic from "next/dynamic";
import { useEditor } from "./core/yjs-editor/components/EditorProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { testFilesData } from "./test-files-data";
import ControlButton from "./ui/control-button";
import { useIsWailsEnvironment } from "@/hooks/use-is-wails-environment";
import { toast } from "sonner";
import { createDocBlock } from "./core/yjs-editor/editor/utils";
import { useNote } from "./useNote";
import { ModeToggle } from "./theme-toggle";
import {
  ImperativePanelHandle,
  getPanelGroupElement,
} from "react-resizable-panels";
import logger from "@/lib/logger";

interface EvoEditorProps {
  defaultLayout?: number[];
}

// TabsValue: Define the type for the tabs value
type TabsValue =
  | "notes"
  | "search"
  | "copilot"
  | "trash"
  | "preference"
  | "settings"
  | "newNote";

const sysMenuItem: MenuData[] = [
  {
    title: "File",
    items: [
      {
        type: "item",
        label: "New Note",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "Save",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "Perferences",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "Exit",
      },
    ],
  },
  {
    title: "Edit",
    items: [
      {
        type: "item",
        label: "Toggle Editor",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "[dev] Show diagnostic",
      },
    ],
  },
  {
    title: "View",
    items: [
      {
        type: "item",
        label: "Toggle Navbar",
      },
      {
        type: "item",
        label: "Toggle Sidebar",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "Toogle Fullscreen",
      },
      {
        type: "separator",
      },
      {
        type: "sub",
        label: "Appearance",
        items: [
          {
            type: "item",
            label: "Dark Mode",
          },
          {
            type: "item",
            label: "Light Mode",
          },
          {
            type: "item",
            label: "Auto Mode",
          },
        ],
      },
    ],
  },
  {
    title: "Help",
    items: [
      {
        type: "item",
        label: "Video Tutorials",
      },
      {
        type: "item",
        label: "Tips and Tricks",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "Feedback",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "About",
      },
    ],
  },
];

const workspace: {
  label: string;
  email: string;
  icon: React.ReactNode;
}[] = [
  {
    label: "V2Note",
    email: "Workspace",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>V2Note</title>
        <path d="M0 2.0H24l-12 21.05z" fill="currentColor" />
      </svg>
    ),
  },
];

const NAV_MAX_SIZE_IN_PIXELS = 180;
const NOTE_LIST_MAX_SIZE_IN_PIXELS = 400;

export default function EvoEditor({
  defaultLayout = [15, 25, 70],
}: EvoEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const [isFileCollapsible, setIsFileCollapsible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // 设置菜单

  const sideBarResizablePanelRef = useRef<ImperativePanelHandle>(null);
  // const [selectedNote] = useNote();

  const [tabsValue, setTabsValue] = useState<TabsValue>("notes");

  const isWails = useIsWailsEnvironment();
  const { editor } = useEditor()!;
  const [_, setSelectNote] = useNote();

  const [navMaxSize, setNavMaxSize] = useState<number>(20);
  const [noteListMaxSize, setNoteListMaxSize] = useState<number>(35);
  const groupElementRef = useRef<HTMLElement | null>(null);
  const resizeHandleWidth = useRef<number>(0);

  const handleResize = useCallback(
    (groupOffsetWidth: number | undefined, resizeHandleWidth: number) => {
      if (groupOffsetWidth) {
        let width = groupOffsetWidth - resizeHandleWidth;

        if (width > 0) {
          setNavMaxSize((NAV_MAX_SIZE_IN_PIXELS / width) * 100);
          setNoteListMaxSize((NOTE_LIST_MAX_SIZE_IN_PIXELS / width) * 100);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to avoid multiple resize events in a short time
      window.requestAnimationFrame(() => {
        handleResize(
          groupElementRef.current?.offsetWidth,
          resizeHandleWidth.current,
        );
      });
    });

    if (!groupElementRef.current) {
      groupElementRef.current = getPanelGroupElement("group");
      const resizeHandles = document.querySelectorAll<HTMLElement>(
        "[data-panel-resize-handle-id]",
      );
      resizeHandleWidth.current = Array.from(resizeHandles).reduce(
        (total, handle) => total + handle.offsetWidth,
        0,
      );
    } else {
      logger.debug("[Evo-Editor] 🤖 new resize observer");
      observer.observe(groupElementRef.current);
    }

    return () => observer.disconnect();
  }, [handleResize]);

  return (
    <>
      <div className="flex flex-col w-full bg-background">
        <div className="mf-system-menu flex flex-row items-center justify-between border-b select-none h-12">
          <SysMenu
            className="rounded-none shadow-none border-none h-8 pl-3"
            items={sysMenuItem}
          />
          <div className="flex-grow mf-draggable h-full">{/* 拖动区域 */}</div>
          <div className="flex flex-row items-center">
            <ModeToggle />
            {isWails && <ControlButton />}
          </div>
        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full items-stretch"
          id="group"
        >
          <ResizablePanel
            // ref={NavResizablePanelRef}
            // defaultSize={defaultLayout[0]}
            maxSize={navMaxSize}
            minSize={navMaxSize - 1}
            className={cn(
              "flex flex-col select-none",
              isCollapsed &&
                "min-w-[56px] transition-all duration-300 ease-in-out",
            )}
            collapsible={true}
            // collapsedSize={10}
            onCollapse={() => {
              setIsCollapsed(true);
            }}
            onExpand={() => {
              setIsCollapsed(false);
            }}
          >
            <div>
              <div
                className={cn(
                  "flex h-[52px] items-center justify-center",
                  isCollapsed ? "h-[52px]" : "px-2",
                )}
              >
                {/* <ModeToggle /> */}
                <AccountSwitcher
                  accounts={workspace}
                  isCollapsed={isCollapsed}
                />
              </div>
              <Separator />
              <Nav
                // className="mt-auto"
                isCollapsed={isCollapsed}
                keyValue={tabsValue}
                links={[
                  {
                    title: "New Note",
                    label: "Create a new note",
                    icon: PlusCircle,
                    variant: "ghost",
                    // herf: "/dashboard/preference",
                    keyValue: "newNote",
                  },
                ]}
                onClick={(keyValue) => {
                  if (keyValue === "newNote" && editor) {
                    editor.doc = createDocBlock(editor.doc.collection);
                    editor.doc.load();
                    editor.doc.resetHistory();
                    toast.success("New note created");
                    setSelectNote({
                      selected: editor.doc.id,
                    });
                  }
                }}
              />
              <Separator />
              <Nav
                onClick={(keyValue) => {
                  const panel = sideBarResizablePanelRef.current;
                  if (!panel) return;

                  // 如果展开状态且 tabsValue 与 keyValue 一致则收缩并return
                  if (panel.isExpanded() && keyValue === tabsValue) {
                    panel.collapse();
                    return;
                  } else {
                    // 如果是收缩状态的则展开，并更新状态
                    panel.expand();
                    setTabsValue(keyValue as TabsValue);
                  }
                }}
                isCollapsed={isCollapsed}
                keyValue={tabsValue}
                links={[
                  {
                    title: "Explorer",
                    label: "Explore your notes",
                    icon: Files,
                    variant: "ghost",
                    keyValue: "notes",
                  },
                  {
                    title: "Search",
                    label: "Find your notes",
                    icon: Search,
                    variant: "ghost",
                    keyValue: "search",
                  },
                  {
                    title: "Copilot Chat",
                    label: "Chat with Copilot",
                    icon: BotMessageSquare,
                    variant: "ghost",
                    keyValue: "copilot",
                  },
                  {
                    title: "Trash",
                    label: "Recover deleted notes",
                    icon: Trash2,
                    variant: "ghost",
                    keyValue: "trash",
                  },
                  // {
                  //   title: "Settings",
                  //   label: "Customize your experience",
                  //   icon: Settings,
                  //   variant: "ghost",
                  // },
                ]}
              />
            </div>
            {/* <Separator /> */}
            <Nav
              className="mt-auto"
              isCollapsed={isCollapsed}
              keyValue={tabsValue}
              links={[
                {
                  title: "Settings",
                  label: "Customize your experience",
                  icon: Settings,
                  variant: "ghost",
                  // herf: "/dashboard/preference",
                  keyValue: "settings",
                },
              ]}
              onClick={(keyValue) =>
                keyValue === "settings" && setIsSettingsOpen(true)
              }
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            ref={sideBarResizablePanelRef}
            minSize={20}
            maxSize={noteListMaxSize}
            collapsible={true}
            className="select-none transition-all duration-100 ease-in-out"
            // defaultSize={defaultLayout[1]}
          >
            <Tabs
              className="w-full max-w-full"
              defaultValue="notes"
              value={tabsValue}
              // onValueChange={(value) => setTabsValue(value as TabsValue)}
            >
              <TabsContent
                value="notes"
                className="mt-0 data-[state=inactive]:hidden"
                forceMount
              >
                <SideBarNoteList files={testFilesData} />
              </TabsContent>
              <TabsContent
                value="search"
                className="mt-0 data-[state=inactive]:hidden"
                forceMount
              >
                <SideBarSearch />
              </TabsContent>
              <TabsContent
                value="copilot"
                className="mt-0 data-[state=inactive]:hidden"
                forceMount
              >
                <SideBarAI />
              </TabsContent>
              <TabsContent
                value="trash"
                className="mt-0 data-[state=inactive]:hidden"
                forceMount
              >
                <SidebarTrash />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            minSize={40}
            collapsible={false}
            className="select-none"
          >
            <NoteDisplay />
          </ResizablePanel>
        </ResizablePanelGroup>
        <SidebarSettings
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>
    </>
  );
}
