import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useNote } from "../useNote";
import { ModeToggle } from "../theme-toggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function NoteDisplay() {
  const [selectedNote] = useNote();
  const Editor = useMemo(() => {
    return dynamic(() => import("../core/block/block-editor"), {
      ssr: false,
    });
  }, []);
  // const YJSEditor = useMemo(() => {
  //   return dynamic(() => import("../core/yjs-editor/yjs-editor"), {
  //     ssr: false,
  //   });
  // }, []);
  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="h-dvh">
        <div className="mf-bg-blur sticky z-10 top-0 flex flex-col  max-h-[52px]">
          <div className="flex gap-4 p-2 items-center justify-between">
            <div className="block">{selectedNote.selected}</div>
            <div className="block">
              <ModeToggle />
            </div>
          </div>
          <Separator />
        </div>
        <Editor />
        <ScrollBar orientation="vertical" className="mt-[52px] z-20" />
      </ScrollArea>
    </div>
  );
}
