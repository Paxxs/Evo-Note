import {
  BotMessageSquare,
  Files,
  PlusCircle,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { Nav } from "@/components/evo-note/ui/nav";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "../ui/separator";
import { SysMenu, type MenuData } from "./ui/sys-menu";
import { Tabs, TabsContent } from "../ui/tabs";
import { SideBarNoteList } from "./views/sidebar/sidebar-note-list";
import SideBarSearch from "./views/sidebar/sidebar-search";
import SideBarAI from "./views/sidebar/sidebar-copilot";
import SidebarTrash from "./views/sidebar/sidebar-trash";
import SidebarSettings from "./views/sidebar/sidebar-settings";
import {
  WorkspaceSwitcher,
  type WorkspaceSwitcherProps,
} from "./ui/account-switcher";
import NoteDisplay from "./views/note-display";

// import dynamic from "next/dynamic";
import { useEditor } from "./core/yjs-editor/components/EditorProvider";
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

import ControlButton from "./ui/control-button";
import { useIsWailsEnvironment } from "@/hooks/use-is-wails-environment";
import { toast } from "sonner";
import { createDocBlock } from "./core/yjs-editor/editor/utils";
import { useNote } from "./useNote";
import { ModeToggle } from "./theme-toggle";
import {
  ImperativePanelHandle,
  getPanelGroupElement,
} from "react-resizable-panels";
import logger from "@/lib/logger";
import { Provider } from "./core/yjs-editor/editor/provider/provider";
import {
  Environment,
  Quit,
  WindowFullscreen,
  WindowSetDarkTheme,
  WindowSetLightTheme,
  WindowUnfullscreen,
} from "@/wails/wailsjs/runtime/runtime";
import { useTheme } from "next-themes";
import {
  FullScreen,
  FullScreenHandle,
  useFullScreenHandle,
} from "react-full-screen";
import { IconLogo } from "../ui/icons";
import { useRouter } from "next/navigation";
import AboutDialog from "./ui/aboutDialog";

declare global {
  interface Window {
    editor: any;
    doc: any;
    collection: any;
  }
}

interface EvoEditorProps {
  defaultLayout?: number[];
}

// TabsValue: Define the type for the tabs value
type TabsValue =
  | "notes"
  | "search"
  | "copilot"
  | "trash"
  | "preference"
  | "settings"
  | "newNote";

const sysMenuItem: MenuData[] = [
  {
    title: "Notes",
    items: [
      {
        type: "item",
        label: "New Note",
        actionKey: "new_note",
      },
      {
        type: "item",
        label: "New Workspace",
        actionKey: "new_workspace",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "Preferences",
        actionKey: "settings",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "Exit",
        actionKey: "exit",
      },
    ],
  },
  {
    title: "View",
    items: [
      {
        type: "item",
        label: "Toggle Navbar",
        actionKey: "toggle_navbar",
      },
      {
        type: "item",
        label: "Toggle Sidebar",
        actionKey: "toggle_sidebar",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "Fullscreen",
        actionKey: "fullscreen",
      },
      {
        type: "separator",
      },
      {
        type: "sub",
        label: "Appearance",
        items: [
          {
            type: "item",
            label: "Dark Mode",
            actionKey: "dark_mode",
          },
          {
            type: "item",
            label: "Light Mode",
            actionKey: "light_mode",
          },
          {
            type: "item",
            label: "Auto Mode",
            actionKey: "auto_mode",
          },
        ],
      },
    ],
  },
  {
    title: "Help",
    items: [
      {
        type: "item",
        label: "Video Tutorials",
        actionKey: "video_tutorials",
      },
      {
        type: "item",
        label: "Tips and Tricks",
        actionKey: "tips_tricks",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "Feedback",
        actionKey: "feedback",
      },
      {
        type: "item",
        label: "[dev] Attach Windows",
        actionKey: "show_diagnostic",
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "About",
        actionKey: "about",
      },
    ],
  },
];

const workspace: WorkspaceSwitcherProps["workspaces"] = [
  {
    label: "V2Note",
    id: "evo-note-main",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>V2Note</title>
        <path d="M0 2.0H24l-12 21.05z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "test2",
    id: "test2",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>V2Note</title>
        <path d="M0 2.0H24l-12 21.05z" fill="currentColor" />
      </svg>
    ),
  },
];

const NAV_MAX_SIZE_IN_PIXELS = 180;
const NOTE_LIST_MAX_SIZE_IN_PIXELS = 400;

export default function EvoEditor({
  defaultLayout = [15, 25, 70],
}: EvoEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const [isFileCollapsible, setIsFileCollapsible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // 设置菜单

  const sideBarResizablePanelRef = useRef<ImperativePanelHandle>(null);
  const navBarResizablePanelRef = useRef<ImperativePanelHandle>(null);
  // const [selectedNote] = useNote();

  const [tabsValue, setTabsValue] = useState<TabsValue>("notes");

  const isWails = useIsWailsEnvironment();
  const { editor, provider, changeProvider } = useEditor()!;
  const [_, setSelectNote] = useNote();

  const [navMaxSize, setNavMaxSize] = useState<number>(20);
  const [noteListMaxSize, setNoteListMaxSize] = useState<number>(35);
  const groupElementRef = useRef<HTMLElement | null>(null);
  const resizeHandleWidth = useRef<number>(0);
  const [currentWorkspace, setCurrentWorkspace] = useState("evo-note-main"); // 改成 Atom

  const { setTheme, resolvedTheme } = useTheme();

  const fullscreenHandle = useFullScreenHandle();
  const router = useRouter();

  const [aboutOpen, setAboutOpen] = useState(false);

  const handleResize = useCallback(
    (groupOffsetWidth: number | undefined, resizeHandleWidth: number) => {
      if (groupOffsetWidth) {
        let width = groupOffsetWidth - resizeHandleWidth;

        if (width > 0) {
          setNavMaxSize((NAV_MAX_SIZE_IN_PIXELS / width) * 100);
          setNoteListMaxSize((NOTE_LIST_MAX_SIZE_IN_PIXELS / width) * 100);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to avoid multiple resize events in a short time
      window.requestAnimationFrame(() => {
        handleResize(
          groupElementRef.current?.offsetWidth,
          resizeHandleWidth.current,
        );
      });
    });

    if (!groupElementRef.current) {
      groupElementRef.current = getPanelGroupElement("group");
      const resizeHandles = document.querySelectorAll<HTMLElement>(
        "[data-panel-resize-handle-id]",
      );
      resizeHandleWidth.current = Array.from(resizeHandles).reduce(
        (total, handle) => total + handle.offsetWidth,
        0,
      );
    } else {
      logger.debug("[Evo-Editor] 🤖 new resize observer");
      observer.observe(groupElementRef.current);
    }

    return () => observer.disconnect();
  }, [handleResize]);

  useEffect(() => {
    if (!isWails) return;
    resolvedTheme === "dark" ? WindowSetDarkTheme() : WindowSetLightTheme();
  }, [resolvedTheme, isWails]);

  const onChangeWorkspace = async (workspaceId: string) => {
    if (!provider || !editor) return;

    if (workspaceId === provider.collection.id) return;

    logger.debug("[Evo-Editor] 🤖 onChangeWorkspace: ", workspaceId);

    try {
      toast.info("📦 Saving Workspace Notes...");
      await provider.stopSync();
    } catch (error) {
      logger.error("[Evo-Editor] 🤖 stopSync error: ", error);
      toast.error("🚨 Stop sync error: " + error);
      return;
    }

    try {
      const newProvider = await Provider.newProvider({
        collectionId: workspaceId,
      });

      changeProvider(newProvider);
      setSelectNote({ selected: null });
      editor.doc = newProvider.doc;
      setCurrentWorkspace(newProvider.collection.id);

      toast.success("🎉 Loading success!");
    } catch (error) {
      logger.error("[Evo-Editor] 🤖 Error loading new provider: ", error);
      toast.error("🚨 Error loading new workspace: " + error);
    }
  };

  const closeEditor = useCallback(async () => {
    if (!provider) return;

    await provider.stopSync().catch((err) => {
      toast.error("😢 data save error:" + err);
      return;
    });
    if (!isWails) router.push("/");
    else Quit();
  }, [provider, isWails, router]);

  const handleMenuAction = (actionKey: string) => {
    const logMessage = `[Evo-Editor] 🤖 handleMenuAction: ${actionKey}`;
    switch (actionKey) {
      case "new_note":
        logger.debug(logMessage);
        createNewNote();
        break;
      case "new_workspace":
        logger.debug(logMessage);
        break;
      case "settings":
        logger.debug(logMessage);
        setIsSettingsOpen(true);
        break;
      case "exit":
        logger.debug(logMessage);
        closeEditor();
        break;
      case "show_diagnostic":
        logger.debug(logMessage);
        if (!editor || !provider) break;
        window.editor = editor;
        window.doc = editor.doc;
        window.collection = provider.collection;
        toast.info("attaching to window");
        break;
      case "toggle_navbar":
        logger.debug(logMessage);
        togglePanel(navBarResizablePanelRef);
        break;
      case "toggle_sidebar":
        logger.debug(logMessage);
        togglePanel(sideBarResizablePanelRef);
        break;
      case "fullscreen":
        logger.debug(logMessage);
        fullscreenHandle.enter();
        break;
      case "dark_mode":
        logger.debug(logMessage);
        setTheme("dark");
        break;
      case "light_mode":
        logger.debug(logMessage);
        setTheme("light");
        break;
      case "auto_mode":
        logger.debug(logMessage);
        setTheme("system");
        break;
      case "video_tutorials":
        logger.debug(logMessage);
        break;
      case "tips_tricks":
        logger.debug(logMessage);
        break;
      case "feedback":
        logger.debug(logMessage);
        break;
      case "about":
        logger.debug(logMessage);
        setAboutOpen(true);
        break;
      default:
        console.log("Action not recognized", actionKey);
    }
  };

  const createNewNote = useCallback(() => {
    if (!editor || !provider) return;
    editor.doc = createDocBlock(provider.collection);
    editor.doc.load();
    // editor.doc.resetHistory();
    toast.success("New note created");
    setSelectNote({
      selected: editor.doc.id,
    });
  }, [editor, setSelectNote, provider]);

  const handleFullScreenChange = useCallback(
    (state: boolean, handle: FullScreenHandle) => {
      if (!isWails) return;
      if (state) {
        WindowFullscreen();
      } else {
        WindowUnfullscreen();
      }
    },
    [isWails],
  );

  function togglePanel(panelRef: RefObject<ImperativePanelHandle>) {
    const panel = panelRef.current;
    if (!panel) return;

    if (panel.isExpanded()) {
      panel.collapse();
    } else {
      panel.expand();
    }
  }

  return (
    <>
      <div
        className={cn(
          "flex flex-col w-full",
          isWails ? "bg-background/95" : "bg-background",
        )}
      >
        <div className="mf-system-menu flex flex-row items-center justify-between border-b select-none h-12 pl-4">
          <IconLogo
            className={cn("w-5 h-5")}
            onDoubleClick={() => fullscreenHandle.enter()}
          />
          <SysMenu
            className="rounded-none shadow-none border-none h-8 pl-3 bg-transparent"
            items={sysMenuItem}
            onMenuSelect={handleMenuAction}
          />
          <div className="flex-grow mf-draggable h-full">{/* 拖动区域 */}</div>
          <div className="flex flex-row items-center">
            <ModeToggle />
            {isWails && <ControlButton onCloseBtnClick={closeEditor} />}
          </div>
        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full items-stretch"
          id="group"
        >
          <ResizablePanel
            ref={navBarResizablePanelRef}
            // defaultSize={defaultLayout[0]}
            maxSize={navMaxSize}
            minSize={navMaxSize - 1}
            className={cn(
              "flex flex-col select-none",
              isCollapsed &&
                "min-w-[56px] transition-all duration-300 ease-in-out",
            )}
            collapsible={true}
            // collapsedSize={10}
            onCollapse={() => {
              setIsCollapsed(true);
            }}
            onExpand={() => {
              setIsCollapsed(false);
            }}
          >
            <div>
              <div
                className={cn(
                  "flex h-[52px] items-center justify-center",
                  isCollapsed ? "h-[52px]" : "px-2",
                )}
              >
                {/* <ModeToggle /> */}
                <WorkspaceSwitcher
                  workspaces={workspace}
                  isCollapsed={isCollapsed}
                  onChange={onChangeWorkspace}
                  value={currentWorkspace}
                />
              </div>
              <Separator />
              <Nav
                // className="mt-auto"
                isCollapsed={isCollapsed}
                keyValue={tabsValue}
                links={[
                  {
                    title: "New Note",
                    label: "Create a new note",
                    icon: PlusCircle,
                    variant: "ghost",
                    // herf: "/dashboard/preference",
                    keyValue: "newNote",
                  },
                ]}
                onClick={(keyValue) => {
                  keyValue === "newNote" && createNewNote();
                }}
              />
              <Separator />
              <Nav
                onClick={(keyValue) => {
                  const panel = sideBarResizablePanelRef.current;
                  if (!panel) return;

                  // 如果展开状态且 tabsValue 与 keyValue 一致则收缩并return
                  if (panel.isExpanded() && keyValue === tabsValue) {
                    panel.collapse();
                    return;
                  } else {
                    // 如果是收缩状态的则展开，并更新状态
                    panel.expand();
                    setTabsValue(keyValue as TabsValue);
                  }
                }}
                isCollapsed={isCollapsed}
                keyValue={tabsValue}
                links={[
                  {
                    title: "Explorer",
                    label: "Explore your notes",
                    icon: Files,
                    variant: "ghost",
                    keyValue: "notes",
                  },
                  {
                    title: "Search",
                    label: "Find your notes",
                    icon: Search,
                    variant: "ghost",
                    keyValue: "search",
                  },
                  {
                    title: "Copilot Chat",
                    label: "Chat with Copilot",
                    icon: BotMessageSquare,
                    variant: "ghost",
                    keyValue: "copilot",
                  },
                  {
                    title: "Trash",
                    label: "Recover deleted notes",
                    icon: Trash2,
                    variant: "ghost",
                    keyValue: "trash",
                  },
                ]}
              />
            </div>
            {/* <Separator /> */}
            <Nav
              className="mt-auto"
              isCollapsed={isCollapsed}
              keyValue={tabsValue}
              links={[
                {
                  title: "Settings",
                  label: "Customize your experience",
                  icon: Settings,
                  variant: "ghost",
                  // herf: "/dashboard/preference",
                  keyValue: "settings",
                },
              ]}
              onClick={(keyValue) =>
                keyValue === "settings" && setIsSettingsOpen(true)
              }
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            ref={sideBarResizablePanelRef}
            minSize={20}
            maxSize={noteListMaxSize}
            collapsible={true}
            className="select-none"
            // defaultSize={defaultLayout[1]}
          >
            <Tabs
              className="w-full max-w-full"
              defaultValue="notes"
              value={tabsValue}
              // onValueChange={(value) => setTabsValue(value as TabsValue)}
            >
              <TabsContent
                value="notes"
                className="mt-0 data-[state=inactive]:hidden"
                forceMount
              >
                <SideBarNoteList />
              </TabsContent>
              <TabsContent
                value="search"
                className="mt-0 data-[state=inactive]:hidden"
                forceMount
              >
                <SideBarSearch />
              </TabsContent>
              <TabsContent
                value="copilot"
                className="mt-0 data-[state=inactive]:hidden"
                forceMount
              >
                <SideBarAI />
              </TabsContent>
              <TabsContent
                value="trash"
                className="mt-0 data-[state=inactive]:hidden"
                forceMount
              >
                <SidebarTrash />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            minSize={40}
            collapsible={false}
            className="select-none"
          >
            <FullScreen
              handle={fullscreenHandle}
              onChange={handleFullScreenChange}
              className="bg-background"
            >
              <NoteDisplay />
            </FullScreen>
          </ResizablePanel>
        </ResizablePanelGroup>
        <SidebarSettings
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
        <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      </div>
    </>
  );
}
