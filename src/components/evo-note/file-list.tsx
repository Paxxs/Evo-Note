import { Sparkle, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNote } from "./useNote";

export type NoteItemType = {
  id: string;
  name: string;
  brief: string;
  createdTime: string;
  lastModified: string;
  stars?: boolean; // 是否收藏
};

interface FileListProps {
  className?: string;
  files?: NoteItemType[];
}

export function FileList({ className, files }: FileListProps) {
  const [selectNote, setSelectNote] = useNote();
  return (
    <ScrollArea className={cn("h-screen", className)}>
      <div className="flex flex-col gap-2 pt-0 p-4">
        {files?.map((note, index) => {
          return (
            <button
              key={index}
              className={cn(
                "flex flex-col items-start gap-2 border p-3 rounded-lg hover:bg-accent transition-all text-sm text-left",
                selectNote.selected === note.id && "bg-muted" // 选中的文件
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
              <div className="text-xs text-muted-foreground line-clamp-2">
                {note.brief.substring(0, 300)}
              </div>
              <div className="flex flex-row gap-2 items-center w-full">
                {note.stars && (
                  <Badge
                    variant={
                      selectNote.selected === note.id ? "default" : "secondary"
                    }
                    className="gap-1 pl-1.5"
                  >
                    <Sparkle className="w-3.5 h-3.5" />
                    Stared
                  </Badge>
                )}
                <div
                  className={cn(
                    "ml-auto text-xs",
                    selectNote.selected === note.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(note.lastModified))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
