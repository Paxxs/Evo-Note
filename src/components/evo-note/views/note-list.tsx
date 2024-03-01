import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileList, NoteItemType } from "../ui/file-list";
import SideBarTitle from "../ui/sider-bar-title";

export function NoteList({ files }: { files: NoteItemType[] }) {
  return (
    <Tabs defaultValue="all">
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
      <div className="h-3 "></div>
      <TabsContent value="all" className="m-0">
        <FileList files={files} />
      </TabsContent>
      <TabsContent value="stared" className="m-0">
        <FileList files={files.filter((item) => item.stars)} />
      </TabsContent>
    </Tabs>
  );
}
