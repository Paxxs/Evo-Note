"use client";
import type {
  BlockNoteEditor,
  DefaultBlockSchema,
  PartialBlock,
} from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import "./style.css";
import testData from "./test-data.json";

import { useTheme } from "next-themes";

export default function BlockEditor() {
  const editor = useBlockNote({
    defaultStyles: false,
    domAttributes: {
      //   blockGroup: {
      //     class:
      //       "prose prose-neutral dark:prose-invert prose-sm xl:prose-base prose-h2:border-b",
      //   },
      inlineContent: {
        "data-placeholder": "Enter text or type '/' for commands :)",
        // 需要配合 css
      },
    },
    onEditorReady(editor) {
      //   editor.insertBlocks(, editor.topLevelBlocks[0]);
      //   console.log(testData);
    },
    initialContent: testData as any,
    onEditorContentChange: (editor) => {
      console.log(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
  });
  const { resolvedTheme } = useTheme();
  return (
    <BlockNoteView
      className="bg-background"
      //   className="h-screen bg-muted"
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
