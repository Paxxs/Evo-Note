import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileList, NoteItemType } from "../ui/file-list";
import SideBarTitle from "../ui/sider-bar-title";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function SideBarNoteList({ files }: { files: NoteItemType[] }) {
  return (
    <Tabs defaultValue="all">
      <ScrollArea
        // 要减去顶部系统bar的高度
        className="h-[calc(100dvh-2.25rem)]"
      >
        <div className="relative flex flex-col">
          <SideBarTitle title="Notes">
            <TabsList className="ml-auto">
              <TabsTrigger
                value="all"
                className="text-zinc-600  dark:text-zinc-200"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="stared"
                className="text-zinc-600  dark:text-zinc-200"
              >
                Stared
              </TabsTrigger>
            </TabsList>
          </SideBarTitle>
          {/* <div className="h-3 "></div> */}
          <TabsContent value="all" className="mt-3">
            <FileList files={files} />
          </TabsContent>
          <TabsContent value="stared" className="mt-3">
            <FileList files={files.filter((item) => item.stars)} />
          </TabsContent>
        </div>
        <ScrollBar orientation="vertical" className="top-10" />
      </ScrollArea>
    </Tabs>
  );
}
