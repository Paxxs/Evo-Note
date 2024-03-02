import SideBarTitle from "../ui/sider-bar-title";
import { FileList } from "../ui/file-list";

export default function SidebarTrash() {
  return (
    <>
      <SideBarTitle title="Trash"></SideBarTitle>
      <FileList
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
