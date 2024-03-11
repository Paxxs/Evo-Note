"use client";
import { AffineEditorContainer } from "@blocksuite/presets";
import { Workspace } from "@blocksuite/store";
import React, { createContext, useContext, useEffect } from "react";
import { initEditor } from "../editor/editor";
import { Provider } from "../editor/provider/provider";

export interface YJsEditorContextType {
  editor: AffineEditorContainer | null;
  workspace: Workspace | null;
  provider: Provider | null;
}

export const YjsEditorContent = createContext<YJsEditorContextType | null>(
  null,
);

export function useEditor() {
  return useContext(YjsEditorContent);
}

const YjsEditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [editor, setEditor] = React.useState<AffineEditorContainer | null>(
    null,
  );
  const [workspace, setWorkspace] = React.useState<Workspace | null>(null);
  const [provider, setProvider] = React.useState<Provider | null>(null);

  useEffect(() => {
    // TODO 初始化编辑器，拿到对象
    initEditor().then(({ editor, provider, workspace }) => {
      setEditor(editor);
      setProvider(provider);
      setWorkspace(workspace);
    });
  }, []);

  return (
    <YjsEditorContent.Provider
      value={{
        editor,
        workspace,
        provider,
      }}
    >
      {children}
    </YjsEditorContent.Provider>
  );
};

export default YjsEditorProvider;
