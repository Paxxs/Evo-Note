import SideBarTitle from "../../ui/sider-bar-title";
import { FileList } from "../../ui/file-list";

export default function SidebarTrash() {
  return (
    <>
      <SideBarTitle title="Trash"></SideBarTitle>
      <div className="flex flex-col items-center justify-center px-3 align-baseline pt-20">
        <div>🥰</div>
        <div className="text-lg font-semibold whitespace-nowrap">
          This feature is not ready
        </div>
      </div>
      {/* <FileList
        className="pt-3"
        files={[
          {
            id: "notes/note_1.md",
            name: "Whispering Breeze",
            brief:
              "A walk in nature is a perfect moment to reflect on life's vastness and beauty. 我发现了一款非常好玩的视频游戏，几乎每晚都在玩。 Reading a book about space exploration ignites my imagination like nothing else. 今天我学习了如何使用Python进行数据分析，非常有趣。 The history of ancient civilizations is both fascinating and enlightening.",
            createdTime: "2020-05-07 01:24:49",
            lastModified: "2020-12-18 18:48:08",
            stars: false,
            tags: [],
          },
        ]}
      /> */}
    </>
  );
}
