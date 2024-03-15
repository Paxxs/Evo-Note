import { useEffect, useState } from "react";
import { useNote } from "../useNote";
import { ModeToggle } from "../theme-toggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ToggleIconBtn from "../ui/toggle-icon-btn";
import { TooltipProvider } from "@/components/ui/tooltip";
import EditorContainer from "../core/yjs-editor/components/EditorContainer";
import { useEditor } from "../core/yjs-editor/components/EditorProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Redo2, Undo2 } from "lucide-react";
import { Doc } from "@blocksuite/store";

export default function NoteDisplay() {
  const [selectedNote] = useNote();
  const { editor, collection } = useEditor()!;
  const [doc, setDoc] = useState<Doc | null>(null);
  const [canRedo, setCanRedo] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  const [isPage, setIsPage] = useState(true);

  useEffect(() => {
    if (!editor) {
      console.log("Editor is not ready yet");
      return;
    }

    const updateDoc = () => {
      console.log("updateDoc", editor.doc, editor.doc.meta?.title);
      setDoc(editor.doc);
    };
    const updateRedoAndUndo = () => {
      setCanRedo(editor.doc.canRedo);
      setCanUndo(editor.doc.canUndo);
    };
    const disposable = [
      editor.doc.slots.blockUpdated.on(updateDoc),
      // collection.slots.docUpdated.on(updateDoc),
      editor.doc.slots.historyUpdated.on(updateRedoAndUndo),
    ];

    return () => {
      disposable.forEach((d) => d.dispose());
    };
  }, [editor]);

  return (
    <div className="flex h-full flex-col flex-grow">
      <ScrollArea className="h-dvh">
        <TooltipProvider delayDuration={0}>
          <div className="mf-bg-blur sticky z-10 top-0 flex flex-col justify-center border-b">
            <div className="flex gap-4 px-2 items-center justify-between max-h-[52px] min-h-[52px]">
              <div className="block">
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={!canUndo}
                  onClick={() => {
                    console.log("undo");
                    doc?.undo();
                  }}
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={!canRedo}
                  onClick={() => doc?.redo()}
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </div>
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
        <EditorContainer
          className={cn(
            "dark:bg-[#141414]",
            !isPage
              ? "h-[calc(100dvh-3rem-52px)]"
              : "min-h-[calc(100dvh-3rem-52px)]",
          )}
        />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
