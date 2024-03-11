"use client";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useNote } from "../useNote";
import { ModeToggle } from "../theme-toggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ToggleIconBtn from "../ui/toggle-icon-btn";
import { TooltipProvider } from "@/components/ui/tooltip";
// import EditorContainer from "../core/yjs-editor/components/EditorContainer";

export default function NoteDisplay() {
  const [selectedNote] = useNote();
  // const Editor = useMemo(() => {
  //   return dynamic(() => import("../core/block/block-editor"), {
  //     ssr: false,
  //   });
  // }, []);
  const Editor = useMemo(() => {
    return dynamic(
      () => import("../core/yjs-editor/components/EditorContainer"),
      {
        ssr: false,
      },
    );
  }, []);

  // const YJSEditor = useMemo(() => {
  //   return dynamic(() => import("../core/yjs-editor/yjs-editor"), {
  //     ssr: false,
  //   });
  // }, []);
  return (
    <div className="flex h-full flex-col">
      <TooltipProvider delayDuration={0}>
        <ScrollArea className="h-dvh">
          <div className="mf-bg-blur sticky z-10 top-0 flex flex-col justify-center max-h-[52px] min-h-[52px] border-b">
            <div className="flex gap-4 px-2 items-center justify-between">
              <div className="block">{selectedNote.selected}</div>
              <div className="flex gap-4">
                <ModeToggle />
                <ToggleIconBtn />
              </div>
            </div>
            {/* <Separator /> */}
          </div>
          <Editor />
          {/* <EditorContainer /> */}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </TooltipProvider>
    </div>
  );
}
