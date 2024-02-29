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
          <SysMenu />
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
                    title: "AI Chat",
                    label: "Chat with AI",
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
            minSize={18}
            collapsible={isFileCollapsible}
            defaultSize={defaultLayout[1]}
          >
            <div className="flex px-4 py-2 items-center h-[52px]">
              <h1 className="text-xl font-bold">Files</h1>
            </div>
            <Separator />
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
