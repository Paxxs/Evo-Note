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
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 p-2">
        <div className="block">{selectedNote.selected}</div>
        <div className="block">
          <ModeToggle />
        </div>
      </div>
      <Separator />
      <ScrollArea>
        <Editor />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
