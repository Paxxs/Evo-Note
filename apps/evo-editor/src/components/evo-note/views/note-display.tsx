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
import logger from "@/lib/logger";

export default function NoteDisplay() {
  const [selectNote, setSelectNote] = useNote();
  const { editor, collection } = useEditor()!;
  const [isPage, setIsPage] = useState(true);
  const [doc, setDoc] = useState<Doc | null>(null);

  useEffect(() => {
    if (!collection || !editor) {
      logger.warn("😶 note-display: Editor or collection is not ready yet");
      return;
    }

    if (selectNote.selected !== null) {
      logger.debug("😶 note-display-currentNote.selected", selectNote.selected);
      const newDoc = collection.docs.get(selectNote.selected);
      if (newDoc) editor.doc = newDoc;
    } else {
      setSelectNote({
        selected: editor.doc.id,
      });
    }
    const updateDoc = () => {
      setDoc(editor.doc);
    };
    const disposable = [
      // editor.doc.slots.blockUpdated.on(() => {
      //   logger.debug("😶 note-display-EVENT: doc.slots.blockUpdated");
      //   updateDoc();
      // }),
      collection.slots.docUpdated.on(() => {
        logger.debug("😶 note-display-EVENT: collection.slots.docUpdated");
        updateDoc();
      }),
      editor.slots.docLinkClicked.on((docId) => {
        logger.debug(
          "😶 note-display-EVENT: editor.slots.docLinkClicked",
          docId,
        );
        updateDoc();
        if (docId) setSelectNote({ selected: docId.docId });
      }),
    ];

    return () => {
      disposable.forEach((d) => d.dispose());
    };
  }, [editor, collection, selectNote, setSelectNote]);

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
                  onClick={() => {
                    console.log("undo");
                    doc?.undo();
                  }}
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => doc?.redo()}>
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
              ? "h-[calc(100dvh-3rem-52.8px)]"
              : "min-h-[calc(100dvh-3rem-52.8px)]",
          )}
        />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
