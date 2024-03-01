"use client";
import { Nav } from "@/components/evo-note/ui/nav";
import {
  BotMessageSquare,
  Files,
  Search,
  Settings,
  Trash2,
} from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "../ui/separator";
import SysMenu from "./ui/sys-menu";
import { use, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ImperativePanelHandle } from "react-resizable-panels";

import { testFilesData } from "./test-files-data";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Item } from "@radix-ui/react-menubar";
import { ModeToggle } from "./theme-toggle";
import { useNote } from "./useNote";
import { NoteList } from "./views/note-list";
import SideBarSearch from "./views/sidebar-search";
import SideBarAI from "./views/sidebar-copilot";
import SidebarTrash from "./views/sidebar-trash";

interface EvoEditorProps {
  defaultLayout?: number[];
}

// TabsValue: Define the type for the tabs value
type TabsValue = "notes" | "search" | "copilot" | "trash" | "preference";

export default function EvoEditor({
  defaultLayout = [20, 30, 50],
}: EvoEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFileCollapsible, setIsFileCollapsible] = useState(false);
  const NavResizablePanelRef = useRef<ImperativePanelHandle>(null);
  const [selectedNote] = useNote();

  const [tabsValue, setTabsValue] = useState<TabsValue>("notes");

  return (
    <>
      <div className="flex flex-col w-full">
        <div>
          <SysMenu
            className="rounded-none shadow-none"
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
                    label: "Copy",
                  },
                  {
                    type: "item",
                    label: "Cut",
                  },
                  {
                    type: "item",
                    label: "Paste",
                  },
                  {
                    type: "separator",
                  },
                  {
                    type: "item",
                    label: "Find",
                  },
                  {
                    type: "item",
                    label: "Find",
                  },
                ],
              },
              {
                title: "View",
                items: [
                  {
                    type: "item",
                    label: "Toggle Sidebar",
                  },
                  {
                    type: "separator",
                  },
                  {
                    type: "item",
                    label: "Toggle Navbar",
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
              "flex flex-col",
              isCollapsed &&
                "min-w-[56px] max-w-[56px] transition-all duration-300 ease-in-out "
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
              <div className="flex h-[52px]">
                <ModeToggle />
              </div>
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
                  herf: "/dashboard/preference",
                  keyValue: "settings",
                },
              ]}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            minSize={20}
            collapsible={isFileCollapsible}
            defaultSize={defaultLayout[1]}
          >
            <Tabs
              defaultValue="notes"
              value={tabsValue}
              onValueChange={(value) => setTabsValue(value as TabsValue)}
            >
              <TabsContent value="notes">
                <NoteList files={testFilesData} />
              </TabsContent>
              <TabsContent value="search">
                <SideBarSearch />
              </TabsContent>
              <TabsContent value="copilot">
                <SideBarAI />
              </TabsContent>
              <TabsContent value="trash">
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
            {selectedNote.selected}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
