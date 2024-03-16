import { Input } from "@/components/ui/input";
import SideBarTitle from "../ui/sider-bar-title";
import { Search } from "lucide-react";
import { FileList } from "../ui/file-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { testFilesData } from "../test-files-data";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash-es";
import logger from "@/lib/logger";
import { useEditor } from "../core/yjs-editor/components/EditorProvider";

export default function SideBarSearch() {
  const [searchText, setSearchText] = useState("");
  const { collection } = useEditor()!;
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value);
  };
  const debounceSearch = useMemo(() => {
    return debounce(handleChange, 500);
  }, []);

  useEffect(() => {
    if (searchText) {
      logger.debug("searchText", searchText);
      if (collection) {
        collection.search(searchText).forEach((value, key) => {
          logger.debug("==searchResult", key, value);
          // editor?.host.std.selection.set()
        });
      }
    }
    return () => {
      debounceSearch.cancel();
    };
  });
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
        <FileList files={testFilesData} />
      </ScrollArea>
    </>
  );
}
