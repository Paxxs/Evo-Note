import { Input } from "@/components/ui/input";
import SideBarTitle from "../ui/sider-bar-title";
import { Search } from "lucide-react";
import { SideBarNoteList } from "./sidebar-note-list";
import { FileList } from "../ui/file-list";

export default function SideBarSearch() {
  return (
    <>
      <SideBarTitle title="Search"></SideBarTitle>
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <FileList
        files={[
          {
            id: "notes/note_1.md",
            name: "Whispering Breeze",
            brief:
              "A walk in nature is a perfect moment to reflect on life's vastness and beauty. 我发现了一款非常好玩的视频游戏，几乎每晚都在玩。 Reading a book about space exploration ignites my imagination like nothing else. 今天我学习了如何使用Python进行数据分析，非常有趣。 The history of ancient civilizations is both fascinating and enlightening.",
            createdTime: "2020-05-07 01:24:49",
            lastModified: "2020-12-18 18:48:08",
            stars: false,
          },
          {
            id: "notes/note_2.md",
            name: "Lunar Serenade",
            brief:
              "A walk in nature is a perfect moment to reflect on life's vastness and beauty. 今天我学习了如何使用Python进行数据分析，非常有趣。 我尝试用水彩画风景，虽然不专业，但很享受过程。 Learning a new language opens up a window to a different culture and world view. The history of ancient civilizations is both fascinating and enlightening.",
            createdTime: "2022-09-25 22:53:55",
            lastModified: "2021-07-13 11:37:29",
            stars: false,
          },
        ]}
      />
    </>
  );
}
