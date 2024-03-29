import { AffineEditorContainer } from "@blocksuite/presets";
import { DocCollection } from "@blocksuite/store";
import React, { createContext, useContext, useEffect } from "react";
import { initEditor } from "../editor/editor";
import { Provider } from "../editor/provider/provider";

export interface YJsEditorContextType {
  editor: AffineEditorContainer | null;
  collection: DocCollection | null;
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
  const [collection, setCollection] = React.useState<DocCollection | null>(
    null,
  );
  const [provider, setProvider] = React.useState<Provider | null>(null);

  useEffect(() => {
    initEditor().then(({ editor, provider, collection }) => {
      setEditor(editor);
      setProvider(provider);
      setCollection(collection);
    });
  }, []);

  return (
    <YjsEditorContent.Provider
      value={{
        editor,
        collection,
        provider,
      }}
    >
      {children}
    </YjsEditorContent.Provider>
  );
};

export default YjsEditorProvider;
