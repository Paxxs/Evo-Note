import { Input } from "@/components/ui/input";
import SideBarTitle from "../ui/sider-bar-title";
import { Search } from "lucide-react";
import { FileList, NoteItemType } from "../ui/file-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { testFilesData } from "../test-files-data";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash-es";
import logger from "@/lib/logger";
import { useEditor } from "../core/yjs-editor/components/EditorProvider";

export default function SideBarSearch() {
  const [searchText, setSearchText] = useState("");
  const [files, setFiles] = useState<NoteItemType[]>([]);
  const { collection } = useEditor()!;
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value);
  };
  const debounceSearch = useMemo(() => {
    return debounce(handleChange, 600);
  }, []);

  useEffect(() => {
    if (collection && searchText) {
      logger.debug("searchText", searchText);
      const filesMap = new Map<string, NoteItemType>();

      const result = collection.search(searchText) as unknown as Map<
        string,
        { space: string; content: string }
      >; // 他返回类型有问题

      result.forEach((value, key) => {
        const doc = collection.getDoc(value.space);
        if (doc) {
          const existingFile = filesMap.get(doc.id);
          if (existingFile) {
            // 如果搜到重复一篇文章中的内容，合并
            if (typeof existingFile.brief === "string") {
              existingFile.brief = [`${key}: - ${value.content}`];
            } else {
              existingFile.brief.push(`${key}: - ${value.content}`);
            }
          } else {
            const newFile: NoteItemType = {
              id: doc.id,
              name: doc.meta?.title || "Untitled",
              brief: `${key}: - ${value.content}`,
              createdTime: doc.meta?.createDate || 0,
              lastModified: doc.history?.lastChange || 0,
              tags: [], // 懒得写了
            };
            filesMap.set(doc.id, newFile);
          }
        }
      });
      setFiles(Array.from(filesMap.values()));
    }
    return () => {
      debounceSearch.cancel();
    };
  }, [collection, searchText, debounceSearch]);
  return (
    <>
      <ScrollArea
        // 要减去顶部系统bar的高度
        className="h-[calc(100dvh-3rem)]"
      >
        <SideBarTitle title="Search"></SideBarTitle>
        <div className="sticky top-[52.8px] bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/75">
          <form>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-8"
                // value={searchText}
                onChange={debounceSearch}
              />
            </div>
          </form>
        </div>
        <FileList files={files} disableContextMenu />
      </ScrollArea>
    </>
  );
}
