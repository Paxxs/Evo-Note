import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useNote } from "../useNote";
import { ModeToggle } from "../theme-toggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ToggleIconBtn from "../ui/toggle-icon-btn";
import { TooltipProvider } from "@/components/ui/tooltip";
import EditorContainer from "../core/yjs-editor/components/EditorContainer";
import { useEditor } from "../core/yjs-editor/components/EditorProvider";

export default function NoteDisplay() {
  const [selectedNote] = useNote();
  const { editor } = useEditor()!;
  const [isPage, setIsPage] = useState(true);
  // const Editor = useMemo(() => {
  //   return dynamic(() => import("../core/block/block-editor"), {
  //     ssr: false,
  //   });
  // }, []);
  // const Editor = useMemo(() => {
  //   return dynamic(
  //     () => import("../core/yjs-editor/components/EditorContainer"),
  //     {
  //       ssr: false,
  //     },
  //   );
  // }, []);

  // const YJSEditor = useMemo(() => {
  //   return dynamic(() => import("../core/yjs-editor/yjs-editor"), {
  //     ssr: false,
  //   });
  // }, []);
  return (
    <div className="flex h-full flex-col flex-grow">
      <ScrollArea className="h-dvh">
        {/* TODO 这里的滚动没有工作 */}
        <TooltipProvider delayDuration={0}>
          <div className="mf-bg-blur sticky z-10 top-0 flex flex-col justify-center max-h-[52px] min-h-[52px] border-b">
            <div className="flex gap-4 px-2 items-center justify-between">
              <div className="block">{selectedNote.selected}</div>
              <div className="flex gap-4">
                <ModeToggle />
                <ToggleIconBtn
                  value={isPage}
                  onValueChange={(newState) => {
                    if (editor) {
                      editor.mode = newState ? "page" : "edgeless";
                      setIsPage(newState);
                    }
                    // setIsPage(isPage);
                  }}
                />
              </div>
            </div>
            {/* <Separator /> */}
          </div>
        </TooltipProvider>
        {/* <Editor /> */}
        <EditorContainer className="h-[calc(100dvh-2.25rem-52px)]" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
