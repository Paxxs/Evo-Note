import { Badge } from "../../ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNote } from "../useNote";
import ContextMenu from "./context-menu";
import { Tag } from "@blocksuite/store";
import { useEditor } from "../core/yjs-editor/components/EditorProvider";
import logger from "@/lib/logger";
import { memo, useEffect, useState } from "react";

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

export function FileList({
  className,
  files,
  disableContextMenu = false,
}: FileListProps) {
  const [selectNote, setSelectNote] = useNote();
  const { editor, provider } = useEditor()!;
  const NoteItem = memo(NoteItemNode);
  // console.log("note:", files);
  return (
    <>
      {/* <ScrollArea
        className={cn("overflow-auto h-[calc(100vh-90px)] pt-4", className)}
      > */}
      <div className={cn("flex flex-col gap-2 p-4 pt-0 ", className)}>
        {files.map((note, index) => {
          return disableContextMenu ? (
            <NoteItem note={note} />
          ) : (
            <ContextMenu
              key={index}
              items={[
                {
                  type: "item",
                  label: "Open",
                  onClick: (event, item) => {
                    setSelectNote({
                      selected: files[index].id,
                    });
                    console.log("OpenClick", event, item);
                  },
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
                  onClick: (event, item) => {
                    if (editor && provider) {
                      // 是否是删除的当前选择的
                      let isDeleteCurrentNote = selectNote.selected === note.id;

                      provider
                        .deleteDoc(note.id)
                        .then((docId) => {
                          if (docId != "") {
                            // 文档已经删除
                            logger.debug(
                              "file-list: delete OpenClick provider.deleteDoc: docID",
                              docId,
                              `current selectNote: ${selectNote.selected} == ${note.id}`,
                            );

                            // 如果不是当前选择的则不用刷新
                            if (isDeleteCurrentNote) {
                              provider.changeEditorDoc(docId, editor);
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
                    logger.debug("file-list: delete OpenClick", event, item);
                  },
                },
              ]}
            >
              <NoteItem note={note} />
            </ContextMenu>
          );
        })}
      </div>
      {/* </ScrollArea> */}
    </>
  );
}

function NoteItemNode({ note }: { note: NoteItemType }) {
  const [selectNote, setSelectNote] = useNote();
  // const { editor } = useEditor()!;
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(selectNote.selected === note.id);
  }, [selectNote.selected, note.id]);

  return (
    <button
      className={cn(
        "flex flex-col items-start gap-2 border p-3 rounded-lg hover:bg-accent transition-all text-sm text-left w-full",
        selected && "bg-muted", // 选中的文件
      )}
      onClick={() =>
        setSelectNote({
          selected: note.id,
        })
      }
    >
      <div className="gap-1 flex flex-col w-full">
        {/* 水平 */}
        <div className="flex flex-row items-center">
          <p className="font-semibold truncate">{note.name}</p>
          {/* <div className="ml-auto text-xs text-muted-foreground">
        {formatDistanceToNow(new Date("2021-12-12"), {
          addSuffix: true,
        })}
      </div> */}
        </div>
      </div>
      <div
        className={cn(
          "text-xs text-muted-foreground line-clamp-2",
          selected && "font-medium",
        )}
      >
        {typeof note.brief === "string"
          ? note.brief.substring(0, 300) // 如果是文章，就截取前300个字符
          : note.brief.map((item, index) => {
              return <li key={index}>{item.substring(0, 100)}</li>; // 搜索结果才这样渲染
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
                  selectNote.selected !== note.id
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
          {formatDistanceToNow(new Date(note.lastModified))}
        </div>
      </div>
    </button>
  );
}
