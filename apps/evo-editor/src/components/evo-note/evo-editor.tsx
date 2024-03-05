"use client";
import {
  BotMessageSquare,
  Files,
  Maximize2,
  Minimize2,
  Minus,
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
import SidebarSettins from "./views/sidebar-settins";
import { AccountSwitcher } from "./ui/account-switcher";
import { Button } from "../ui/button";
import NoteDisplay from "./views/note-display";

import dynamic from "next/dynamic";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { testFilesData } from "./test-files-data";

interface EvoEditorProps {
  defaultLayout?: number[];
}

// TabsValue: Define the type for the tabs value
type TabsValue = "notes" | "search" | "copilot" | "trash" | "preference";

export default function EvoEditor({
  defaultLayout = [20, 25, 75],
}: EvoEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFileCollapsible, setIsFileCollapsible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // 设置菜单

  const NavResizablePanelRef = useRef<ImperativePanelHandle>(null);
  // const [selectedNote] = useNote();

  const [tabsValue, setTabsValue] = useState<TabsValue>("notes");

  const Editor = useMemo(() => {
    return dynamic(() => import("./core/block/block-editor"), {
      ssr: false,
    });
  }, []);

  return (
    <>
      <div className="flex flex-col w-full bg-background">
        <div className="mf-system-menu flex flex-row items-center justify-between border-b select-none h-9">
          <SysMenu
            className="rounded-none shadow-none border-none h-8"
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
          <div className="flex flex-row">
            <Button variant="ghost" size="icon" className="rounded-none">
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-none">
              {/* <Maximize2 className="h-4 w-4" /> */}
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-destructive rounded-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full items-stretch"
        >
          <ResizablePanel
            ref={NavResizablePanelRef}
            defaultSize={defaultLayout[0]}
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
                          <path d="M0 2.0H24l-12 21.05z" fill="currentColor" />
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
                    variant: "default",
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
          <ResizableHandle withHandle />
          <ResizablePanel
            minSize={20}
            collapsible={isFileCollapsible}
            defaultSize={defaultLayout[1]}
            className="select-none"
          >
            <Tabs
              defaultValue="notes"
              value={tabsValue}
              onValueChange={(value) => setTabsValue(value as TabsValue)}
            >
              <TabsContent value="notes" className="mt-0">
                <SideBarNoteList files={testFilesData} />
              </TabsContent>
              <TabsContent value="search" className="mt-0">
                <SideBarSearch />
              </TabsContent>
              <TabsContent value="copilot" className="mt-0">
                <SideBarAI />
              </TabsContent>
              <TabsContent value="trash" className="mt-0">
                <SidebarTrash />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle
            withHandle
            onDragging={() => {
              if (NavResizablePanelRef.current?.isCollapsed()) {
                setIsFileCollapsible(true);
              } else {
                setIsFileCollapsible(false);
              }
            }}
          />
          <ResizablePanel defaultSize={defaultLayout[2]}>
            <NoteDisplay />
          </ResizablePanel>
        </ResizablePanelGroup>
        <SidebarSettins
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>
    </>
  );
}
