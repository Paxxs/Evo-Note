import { memo, useEffect, useState } from "react";
import { useNote } from "../useNote";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ToggleIconBtn from "../ui/toggle-icon-btn";
import { TooltipProvider } from "@/components/ui/tooltip";
import EditorContainer from "../core/yjs-editor/components/EditorContainer";
import { useEditor } from "../core/yjs-editor/components/EditorProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Redo2, Undo2 } from "lucide-react";
import { type Doc } from "@blocksuite/store";
import logger from "@/lib/logger";
import "./note-display.css";

const HistoryManager = memo(function HistoryManager({ doc }: { doc: Doc }) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  useEffect(() => {
    logger.debug("🤖[HistoryManager] mounted", doc.id, doc.meta?.title);
    const updateUndoManagerState = () => {
      setTimeout(() => {
        const canUndo = doc.history.canUndo();
        const canRedo = doc.history.canRedo();
        logger.debug(
          "[HistoryManager] doc.history 😀 update state",
          `canUndo=${canUndo} canRedo=${canRedo}`,
        );
        setCanUndo(doc.history.canUndo());
        setCanRedo(doc.history.canRedo());
      }, 500);
    };
    updateUndoManagerState();
    const disposable = doc.slots.blockUpdated.on(() => {
      logger.debug("[HistoryManager] doc.history blockUpdated");
      updateUndoManagerState();
    });

    return () => {
      disposable.dispose();
    };
  }, [doc]);

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        disabled={!canUndo}
        onClick={() => {
          console.log("undo");
          doc.undo();
        }}
      >
        <Undo2 className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        disabled={!canRedo}
        onClick={() => doc.redo()}
      >
        <Redo2 className="w-4 h-4" />
      </Button>
    </>
  );
});

export default function NoteDisplay() {
  const [selectNote, setSelectNote] = useNote();
  const { editor, provider } = useEditor()!;
  const [isPage, setIsPage] = useState(true);
  const [doc, setDoc] = useState<Doc | null>(null);

  useEffect(() => {
    if (!editor || !provider) {
      logger.info("[note-display] Editor or collection is not ready yet");
      return;
    }
    logger.debug("😶 [note-display]: mounted");

    const id = editor.doc.id;
    // 确保第一次打开时候选中状态是编辑器的 doc
    if (selectNote.selected === null) {
      logger.debug(
        "[note-display] 应该是第一次打开，update selectNote.selected to doc.id:",
        id,
      );
      setSelectNote({
        selected: id,
      });
    } else if (selectNote.selected !== id) {
      // 选中的不是当前的
      logger.debug(
        "[note-display] update editor doc to selectNote.selected:",
        selectNote.selected,
      );
      provider.changeEditorDoc(selectNote.selected, editor);
    }

    setDoc(editor.doc);
  }, [editor, provider, selectNote.selected, setSelectNote]);

  return (
    editor &&
    doc && (
      <div className="flex h-full flex-col flex-grow">
        <ScrollArea className="h-dvh">
          <TooltipProvider delayDuration={0}>
            <div className="mf-bg-blur sticky z-10 top-0 flex flex-col justify-center border-b">
              <div className="flex gap-4 px-2 items-center justify-between max-h-[52px] min-h-[52px]">
                <div className="flex gap-0.5">
                  <HistoryManager doc={doc} />
                </div>
                <div className="flex gap-0.5">
                  <ToggleIconBtn
                    value={isPage}
                    onValueChange={(newState) => {
                      editor.mode = newState ? "page" : "edgeless";
                      setIsPage(newState);
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
    )
  );
}
