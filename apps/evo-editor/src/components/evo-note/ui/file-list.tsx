import { Badge } from "../../ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNote } from "../useNote";
import ContextMenu, { ContextMenuItemI } from "./context-menu";
import { Tag } from "@blocksuite/store";
import { useEditor } from "../core/yjs-editor/components/EditorProvider";
import logger from "@/lib/logger";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

// 定义单个标签的类型
// export type Tag = {
//   color: string;
//   id: string;
//   value: string;
// };

// 定义笔记项的类型
export type NoteItemType = {
  id: string;
  name: string;
  brief: string | string[];
  createdTime: number | string;
  lastModified: number | string;
  tags: Tag[]; // 不用自定义的了
};

interface FileListProps {
  className?: string;
  files: NoteItemType[];
  disableContextMenu?: boolean;
}

export const FileList = memo(function FileList({
  className,
  files,
  disableContextMenu = false,
}: FileListProps) {
  const [selectNote, setSelectNote] = useNote();
  const { editor, provider } = useEditor()!;

  const openNote = useCallback(
    (noteId: string) => {
      setSelectNote({
        selected: noteId,
      });
    },
    [setSelectNote],
  );

  const deleteNote = useCallback(
    (noteId: string) => {
      if (editor && provider) {
        // 是否是删除的当前选择的
        let isDeleteCurrentNote = selectNote.selected === noteId;

        provider
          .deleteDoc(noteId)
          .then((docId) => {
            if (docId != "") {
              // 文档已经删除
              logger.debug(
                "file-list: delete OpenClick provider.deleteDoc: docID",
                docId,
                `current selectNote: ${selectNote.selected} == ${noteId}`,
              );

              // 如果不是当前选择的则不用刷新
              if (isDeleteCurrentNote) {
                provider.changeEditorDoc(docId, editor);
                setSelectNote({ selected: docId });
              }
            }
          })
          .catch((err) => {
            logger.error(
              "file-list: delete OpenClick provider.deleteDoc Error",
              err,
            );
          });
      }
      logger.debug("file-list: delete OpenClick", noteId);
    },
    [editor, provider, selectNote.selected, setSelectNote],
  );

  return (
    <>
      {/* <ScrollArea
        className={cn("overflow-auto h-[calc(100vh-90px)] pt-4", className)}
      > */}
      <div className={cn("flex flex-col gap-2 p-4 pt-0 w-full", className)}>
        {files.map((note) => {
          return (
            <NoteItemWrapper
              key={note.id}
              note={note}
              selected={selectNote.selected === note.id}
              disableContextMenu={disableContextMenu}
              onOpenNote={openNote}
              onDeleteNote={deleteNote}
            />
          );
        })}
      </div>
      {/* </ScrollArea> */}
    </>
  );
});

const NoteItemWrapper = memo(function NoteItemWrapper({
  note,
  selected,
  disableContextMenu,
  onOpenNote,
  onDeleteNote,
}: {
  note: NoteItemType;
  selected: boolean;
  disableContextMenu?: boolean;
  onOpenNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}) {
  const { editor } = useEditor()!;
  const rootService = () => {
    return editor?.host.spec.getService("affine:page");
  };

  const contextMenuItems = useMemo(
    (): ContextMenuItemI[] => [
      {
        type: "item",
        label: "Open",
        onClick: () => onOpenNote(note.id),
      },
      {
        type: "separator",
      },
      {
        type: "radio",
        label: "Property",
        value: "createdTime",
        values: [
          {
            name: "L " + new Date(note.lastModified).toLocaleString(),
            value: "lastModified",
          },
          {
            name: "C " + new Date(note.createdTime).toLocaleString(),
            value: "createdTime",
          },
        ],
      },
      {
        type: "separator",
      },
      {
        type: "item",
        label: "Delete",
        onClick: () => onDeleteNote(note.id),
      },
    ],
    [note.id, onOpenNote, onDeleteNote, note.lastModified, note.createdTime],
  );

  return disableContextMenu ? (
    <NoteItemNode
      key={note.id}
      note={note}
      selected={selected}
      onClick={() => onOpenNote(note.id)}
    />
  ) : (
    <ContextMenu key={note.id} items={contextMenuItems}>
      <NoteItemNode
        note={note}
        selected={selected}
        onClick={() => onOpenNote(note.id)}
      />
    </ContextMenu>
  );
});

const NoteItemNode = memo(function NoteItemNode({
  note,
  selected,
  onClick,
}: {
  note: NoteItemType;
  selected: boolean;
  onClick?: (noteId: string) => void;
}) {
  const humanDate = useMemo(() => {
    return formatDistanceToNow(new Date(note.createdTime));
  }, [note.createdTime]);
  return (
    <button
      className={cn(
        "flex flex-col items-start gap-2 border p-3 rounded-lg hover:bg-accent transition-all text-sm text-left w-full",
        selected && "bg-muted", // 选中的文件
      )}
      onClick={() => {
        if (onClick) onClick(note.id);
      }}
    >
      {/* 水平 */}
      <div className="flex flex-row items-center w-full">
        <p className="font-semibold truncate max-w-full">{note.name}</p>
        {/* <div className="ml-auto text-xs text-muted-foreground">
        {formatDistanceToNow(new Date("2021-12-12"), {
          addSuffix: true,
        })}
      </div> */}
      </div>
      <div
        className={cn(
          "text-xs text-muted-foreground max-w-full",
          selected && "font-medium",
          typeof note.brief === "string" && "line-clamp-2",
        )}
      >
        {typeof note.brief === "string"
          ? note.brief.substring(0, 100) // 如果是文章，就截取前300个字符
          : note.brief.map((item, index) => {
              return <li key={index}>{item.substring(0, 30)}</li>; // 搜索结果才这样渲染
            })}
      </div>
      <div className="flex flex-row gap-2 items-center w-full flex-nowrap">
        <div className="space-x-1 whitespace-pre">
          {note.tags &&
            note.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag.id}
                variant={selected ? "default" : "outline"}
                className="gap-1 pl-1.5 font-normal"
                style={
                  !selected
                    ? {
                        backgroundColor: tag.color,
                      }
                    : {}
                }
              >
                {tag.value}
              </Badge>
            ))}
          {note.tags && note.tags.length > 2 && <span>...</span>}
        </div>
        <div
          className={cn(
            "ml-auto text-xs whitespace-pre",
            selected
              ? "text-gray-900 dark:text-zinc-200"
              : "text-muted-foreground",
          )}
        >
          {humanDate}
        </div>
      </div>
    </button>
  );
});
