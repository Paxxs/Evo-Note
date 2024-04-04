import { Button } from "@/components/ui/button";
import {
  useIsWailsEnvironment,
  useWails,
} from "@/hooks/use-is-wails-environment";
import {
  Quit,
  // cspell:words Minimise Maximise Minimised Maximised
  WindowIsMaximised,
  WindowMinimise,
  WindowToggleMaximise,
} from "@/wails/wailsjs/runtime/runtime";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useEditor } from "../core/yjs-editor/components/EditorProvider";
import { toast } from "sonner";

export default function ControlButton() {
  const { collection } = useEditor()!;
  const [isMinimised, setIsMinimised] = useState(true); // 默认窗口时最小的

  useWails(() => {
    WindowIsMaximised().then((isMaximised) => {
      setIsMinimised(!isMaximised);
    });
  });

  const maxOnClick = useCallback(() => {
    WindowToggleMaximise();
    setIsMinimised(!isMinimised);
  }, [isMinimised]);

  const minOnClick = useCallback(() => {
    WindowMinimise();
  }, []);

  const closeOnClick = useCallback(() => {
    if (collection) {
      toast.info("😀 Saving...");
      if (!collection.docSync.canGracefulStop()) {
        toast.info("😉 Just need one more time...");
        collection.docSync
          .waitForGracefulStop()
          .then(() => {
            toast.success("😀 Saved");
            Quit();
          })
          .catch((err) => {
            toast.error("😢 data save error:" + err);
            return;
          });
      }
    }
    Quit();
  }, [collection]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-none h-12 w-12 border-b"
        onClick={minOnClick}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-none h-12 w-12 border-b"
        onClick={maxOnClick}
      >
        {isMinimised ? (
          <Maximize2 className="h-4 w-4" />
        ) : (
          <Minimize2 className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-destructive rounded-none h-12 w-12 border-b"
        onClick={closeOnClick}
      >
        <X className="h-4 w-4" />
      </Button>
    </>
  );
}
