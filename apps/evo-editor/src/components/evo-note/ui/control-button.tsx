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
import { useEffect, useState } from "react";

export default function ControlButton() {
  const [isMinimised, setIsMinimised] = useState(true); // 默认窗口时最小的
  useWails(() => {
    WindowIsMaximised().then((isMaximised) => {
      if (isMaximised) {
        setIsMinimised(false);
      } else {
        setIsMinimised(true);
      }
    });
  });
  useEffect(() => {}, []);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-none h-12 w-12 border-b"
        onClick={() => {
          WindowMinimise();
        }}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-none h-12 w-12 border-b"
        onClick={() => {
          console.log("被点击");
          WindowToggleMaximise();
          setIsMinimised(!isMinimised);
        }}
      >
        {isMinimised ? (
          <Maximize2 className="h-4 w-4" />
        ) : (
          <Minimize2 className="h-4 w-4" />
        )}
        {/* <Maximize2 className="h-4 w-4" /> */}
        {/* <Minimize2 className="h-4 w-4" /> */}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-destructive rounded-none h-12 w-12 border-b"
        onClick={() => {
          Quit();
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </>
  );
}
