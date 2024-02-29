"use client";
import { Nav } from "@/components/evo-note/nav";
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
import SysMenu from "./sys-menu";
import { use, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { FileList } from "./file-list";

import { testFilesData } from "./test-files-data";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Item } from "@radix-ui/react-menubar";

interface EvoEditorProps {
  defaultLayout?: number[];
}

export default function EvoEditor({
  defaultLayout = [20, 30, 50],
}: EvoEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFileCollapsible, setIsFileCollapsible] = useState(false);
  const NavResizablePanelRef = useRef<ImperativePanelHandle>(null);
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
              <div className="flex h-[52px]"></div>
              <Separator />
              <Nav
                isCollapsed={isCollapsed}
                links={[
                  {
                    title: "Explorer",
                    label: "Explore your notes",
                    icon: Files,
                    variant: "default",
                  },
                  {
                    title: "Search",
                    label: "Find your notes",
                    icon: Search,
                    variant: "ghost",
                  },
                  {
                    title: "Copilot Chat",
                    label: "Chat with Copilot",
                    icon: BotMessageSquare,
                    variant: "ghost",
                  },
                  {
                    title: "Trash",
                    label: "Recover deleted notes",
                    icon: Trash2,
                    variant: "ghost",
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
              links={[
                {
                  title: "Settings",
                  label: "Customize your experience",
                  icon: Settings,
                  variant: "ghost",
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
            <Tabs defaultValue="all">
              <div className="flex px-4 py-2 items-center h-[52px]">
                <h1 className="text-xl font-bold">Files</h1>
                <TabsList className="ml-auto">
                  <TabsTrigger
                    value="all"
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="stared"
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    Stared
                  </TabsTrigger>
                </TabsList>
              </div>
              <Separator />
              <div className="h-3 "></div>
              <TabsContent value="all" className="m-0">
                <FileList files={testFilesData} />
              </TabsContent>
              <TabsContent value="stared" className="m-0">
                <FileList files={testFilesData.filter((item) => item.stars)} />
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
          <ResizablePanel defaultSize={defaultLayout[2]}>editor</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
