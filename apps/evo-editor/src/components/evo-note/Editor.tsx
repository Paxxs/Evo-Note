"use client";
import YjsEditorProvider from "./core/yjs-editor/components/EditorProvider";
import EvoEditor from "./evo-editor";

export default function Editor() {
  return (
    <YjsEditorProvider>
      <EvoEditor />
    </YjsEditorProvider>
  );
}
