import { AffineEditorContainer } from "@blocksuite/presets";
import React, { createContext, useContext, useEffect } from "react";
import { initEditor } from "../editor/editor";
import { Provider } from "../editor/provider/provider";

export interface YJsEditorContextType {
  editor: AffineEditorContainer | null;
  provider: Provider | null;
  changeProvider: (provider: Provider) => void;
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
  const [provider, setProvider] = React.useState<Provider | null>(null);

  const changeProvider = (provider: Provider) => {
    setProvider(provider);
  };

  useEffect(() => {
    initEditor().then(({ editor, provider }) => {
      setEditor(editor);
      setProvider(provider);
    });
  }, []);

  return (
    <YjsEditorContent.Provider
      value={{
        editor,
        provider,
        changeProvider,
      }}
    >
      {children}
    </YjsEditorContent.Provider>
  );
};

export default YjsEditorProvider;
