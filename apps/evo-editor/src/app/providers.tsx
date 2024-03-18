"use client";

import { type NoteItemType } from "@/components/evo-note/ui/file-list";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useConfig } from "@/hooks/use-config";
import useLocalStorage from "@/hooks/use-local-storage";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
} from "react";

// 定义我们的应用上下文
const AppContext = createContext<{
  notes: NoteItemType[];
  setNotes: Dispatch<SetStateAction<NoteItemType[]>>;
  // notes 列表
  // trash 列表
  // search 列表
}>({
  notes: [],
  setNotes: () => {},
});

export default function Provider({ children }: { children: ReactNode }) {
  // 用于全局上下文
  const [notes, setNotes] = useLocalStorage<NoteItemType[]>(
    "evo__notes",
    [],
  ) as [NoteItemType[], Dispatch<SetStateAction<NoteItemType[]>>];
  const [config] = useConfig();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // disableTransitionOnChange
    >
      <AppContext.Provider
        value={{
          notes,
          setNotes,
        }}
      >
        <div
          vaul-drawer-wrapper=""
          onContextMenu={(e) => {
            // 首先，将e.target断言为HTMLElement
            const targetElement = e.target as HTMLElement;
            // Allow context menu on any input
            if (targetElement) {
              if (["INPUT", "TEXTAREA"].includes(targetElement.tagName)) {
                return;
              }
              if (targetElement.parentElement?.tagName === "V-TEXT") {
                // block suit stuff
                return;
              }
              if (window.getSelection()?.toString()) {
                // Allow context menu on any text selection
                return;
              }
            }
            // Disable the context menu otherwise
            e.preventDefault();
          }}
        >
          {children}
          <Toaster richColors duration={4000} className="select-none" />
        </div>
        <ThemeSwitcher />
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a Provider");
  }
  return context;
}
