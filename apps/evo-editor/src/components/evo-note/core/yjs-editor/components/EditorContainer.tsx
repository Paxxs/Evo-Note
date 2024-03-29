import { useEffect, useRef } from "react";
import { useEditor } from "./EditorProvider";
import { cn } from "@/lib/utils";

export default function EditorContainer({ className }: { className?: string }) {
  const { editor } = useEditor()!;
  const editorContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (editorContainerRef.current && editor) {
      editorContainerRef.current.innerHTML = "";
      editorContainerRef.current.appendChild(editor);
    }
  }, [editor]);
  return (
    <div
      className={cn("editor-container", className)}
      ref={editorContainerRef}
    ></div>
  );
}
