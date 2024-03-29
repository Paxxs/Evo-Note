import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileList, NoteItemType } from "../ui/file-list";
import SideBarTitle from "../ui/sider-bar-title";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useEditor } from "../core/yjs-editor/components/EditorProvider";
import { Doc, Tag } from "@blocksuite/store";
import { getPagePreviewText } from "../core/yjs-editor/editor/utils";
import assert from "assert";
import logger from "@/lib/logger";

export function SideBarNoteList({ files }: { files: NoteItemType[] }) {
  const { collection, editor } = useEditor()!;
  // const [notes, setNotes] = useState<NoteItemType[]>([]);
  const [notes, setNotes] = useState<NoteItemType[]>([]);
  // 尝试使用 Map，每次只更新指定 ID 的Doc数据

  useEffect(() => {
    if (!collection || !editor) return;

    /**
     * Generate a NoteItemType from a given Doc.
     *
     * @param {Doc} doc - the document to create the note from
     * @return {NoteItemType | undefined} the generated NoteItemType or undefined if collection or doc.meta is missing
     */
    const createNoteFromDoc = (doc: Doc): NoteItemType => {
      // if (!collection || !doc.meta) return;
      assert(collection, "Collection is missing");
      assert(doc.meta, "Doc meta is missing");

      // 生成 tags
      const tags = doc.meta.tags
        .map((tagId) => {
          // 先拿到 doc 的 tagsID
          const tagOptions = collection.meta.properties.tags?.options.find(
            (option) => option.id === tagId, // 然后去 collection 中查找对应的定义
          );
          return tagOptions;
        })
        .filter((tag) => tag != undefined) as Tag[]; // 最后过滤掉不存在的

      return {
        id: doc.meta.id,
        name: doc.meta.title || "Untitled",
        brief: getPagePreviewText(doc),
        createdTime: doc.meta.createDate,
        lastModified: doc.history?.lastChange || doc.meta.createDate,
        tags,
      };
    };

    /**
     * Updates all notes
     *
     * @return {void}
     */
    const updateNotes = (): void => {
      const docsArray = Array.from(collection.docs.values());
      logger.debug("sidebar-note-list: Updating Notes List");
      logger.debug("docMetas: ", collection.meta.docMetas);
      const notes: NoteItemType[] = docsArray.map((doc) =>
        createNoteFromDoc(doc),
      );
      setNotes(notes);

      // 放弃使用 Map
      // const updateNotes = new Map<string, NoteItemType>();
      // collection.docs.forEach((doc) => {
      //   if (!doc.meta) return;
      //   updateNotes.set(doc.meta.id, createNoteFromDoc(doc)); // 生成 NoteItemType
      // });
      // setNotes(updateNotes); // 更新 notes
    };

    // const updateNote = (doc: Doc): void => {
    //   if (!doc.meta) return;
    //   assert(doc.meta.id, "Doc meta is missing");
    //   setNotes((prevNotes) => {
    //     const newNotes = new Map(prevNotes);
    //     newNotes.set(doc.meta.id, createNoteFromDoc(doc));
    //     return newNotes;
    //   });
    // };
    if (notes.length === 0) {
      updateNotes();
    }

    const disposable = [
      collection.slots.docAdded.on((docId) => {
        logger.debug("sidebar-note-list: EVENT: docAdded", docId);
        updateNotes();
      }),
      collection.slots.docUpdated.on(updateNotes),
      collection.meta.docMetaUpdated.on(updateNotes),
      // collection.store.spaces.
    ];

    logger.debug("NoteList Component has been mounted");
    return () => {
      logger.debug("NoteList Component will be unmounted");
      disposable.forEach((d) => d.dispose());
    };
  }, [collection, editor, notes]);

  return (
    <Tabs defaultValue="all">
      <ScrollArea
        // 要减去顶部系统bar的高度
        className="h-[calc(100dvh-3rem)]"
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
            <FileList files={notes} />
          </TabsContent>
          <TabsContent value="stared" className="mt-3">
            <FileList
              files={notes.filter((item) => {
                return item.tags.some((tag) => tag.value === "stared");
              })}
            />
          </TabsContent>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </Tabs>
  );
}
