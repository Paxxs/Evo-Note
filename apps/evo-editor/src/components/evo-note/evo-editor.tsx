"use client";
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
import SysMenu from "./ui/sys-menu";
import { Tabs, TabsContent } from "../ui/tabs";
import { SideBarNoteList } from "./views/sidebar-note-list";
import SideBarSearch from "./views/sidebar-search";
import SideBarAI from "./views/sidebar-copilot";
import SidebarTrash from "./views/sidebar-trash";
import SidebarSettings from "./views/sidebar-settings";
import { AccountSwitcher } from "./ui/account-switcher";
import NoteDisplay from "./views/note-display";

// import dynamic from "next/dynamic";
import YjsEditorProvider from "./core/yjs-editor/components/EditorProvider";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { testFilesData } from "./test-files-data";
import ControlButton from "./ui/control-button";
import { useIsWailsEnvironment } from "@/hooks/use-is-wails-environment";

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

export default function EvoEditor({
  defaultLayout = [15, 25, 70],
}: EvoEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const [isFileCollapsible, setIsFileCollapsible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // 设置菜单

  // const NavResizablePanelRef = useRef<ImperativePanelHandle>(null);
  // const [selectedNote] = useNote();

  const [tabsValue, setTabsValue] = useState<TabsValue>("notes");

  const isWails = useIsWailsEnvironment();

  // const Editor = useMemo(() => {
  //   return dynamic(() => import("./core/block/block-editor"), {
  //     ssr: false,
  //   });
  // }, []);
  // const EditorProvider = dynamic(
  //   () => import("./core/yjs-editor/components/EditorProvider"),
  //   {
  //     ssr: false,
  //   },
  // );

  return (
    <>
      <YjsEditorProvider>
        <div
          className="flex flex-col w-full bg-background"
          onContextMenu={(e) => {
            // 首先，将e.target断言为HTMLElement
            const targetElement = e.target as HTMLElement;
            // Allow context menu on any input
            if (targetElement) {
              if (["INPUT", "TEXTAREA"].includes(targetElement.tagName)) {
                return;
              }
              if (targetElement.parentElement?.tagName === "V-TEXT") {
                // block suit stuff
                return;
              }
              if (window.getSelection()?.toString()) {
                // Allow context menu on any text selection
                return;
              }
            }
            // Disable the context menu otherwise
            e.preventDefault();
          }}
        >
          <div className="mf-system-menu flex flex-row items-center justify-between border-b select-none h-12">
            <SysMenu
              className="rounded-none shadow-none border-none h-8 pl-3"
              items={[
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
              ]}
            />
            <div className="flex-grow mf-draggable h-full">
              {/* 拖动区域 */}
            </div>
            <div className="flex flex-row">{isWails && <ControlButton />}</div>
          </div>
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full items-stretch"
          >
            <ResizablePanel
              // ref={NavResizablePanelRef}
              // defaultSize={defaultLayout[0]}
              maxSize={20}
              minSize={15}
              className={cn(
                "flex flex-col select-none",
                isCollapsed &&
                  "min-w-[56px] max-w-[56px] transition-all duration-300 ease-in-out",
              )}
              collapsible={true}
              collapsedSize={4}
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
                    accounts={[
                      {
                        label: "V2Note",
                        email: "Workspace",
                        icon: (
                          <svg
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>V2Note</title>
                            <path
                              d="M0 2.0H24l-12 21.05z"
                              fill="currentColor"
                            />
                          </svg>
                        ),
                      },
                    ]}
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
                  onClick={(keyValue) =>
                    keyValue === "settings" && setIsSettingsOpen(true)
                  }
                />
                <Separator />
                <Nav
                  onClick={(keyValue) => setTabsValue(keyValue as TabsValue)}
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
              minSize={20}
              maxSize={30}
              // collapsible={isFileCollapsible}
              collapsible={true}
              // defaultSize={defaultLayout[1]}
            >
              <Tabs
                className="w-full border-r"
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
      </YjsEditorProvider>
    </>
  );
}
