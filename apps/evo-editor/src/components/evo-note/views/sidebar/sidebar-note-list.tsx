import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileList, NoteItemType } from "../../ui/file-list";
import SideBarTitle from "../../ui/sider-bar-title";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useEditor } from "../../core/yjs-editor/components/EditorProvider";
import { Doc, Tag } from "@blocksuite/store";
import { getPagePreviewText } from "../../core/yjs-editor/editor/utils";
import assert from "assert";
import logger from "@/lib/logger";
import { useNote } from "../../useNote";

const ControlTab = memo(function ControlTab() {
  return (
    <TabsList className="ml-auto">
      <TabsTrigger value="all" className="text-zinc-600  dark:text-zinc-200">
        All
      </TabsTrigger>
      <TabsTrigger value="stared" className="text-zinc-600  dark:text-zinc-200">
        Stared
      </TabsTrigger>
    </TabsList>
  );
});

export const SideBarNoteList = memo(function SideBarNoteList() {
  const { editor, provider } = useEditor()!;
  const [notes, setNotes] = useState<NoteItemType[]>([]);
  const [selectedNote] = useNote();

  const staredFiles = useMemo(() => {
    return notes.filter((item) =>
      item.tags.some((tag) => tag.value === "stared"),
    );
  }, [notes]);

  /**
   * Generate a NoteItemType from a given Doc.
   *
   * @param {Doc} doc - the document to create the note from
   * @return {NoteItemType | undefined} the generated NoteItemType or undefined if collection or doc.meta is missing
   */
  const createNoteFromDoc = useCallback(
    (doc: Doc): NoteItemType => {
      assert(doc.meta, "Doc meta is missing");
      assert(provider, "Provider is not ready");
      const { collection } = provider;
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
    },
    [provider],
  );

  /**
   * Updates all notes
   *
   * @return {void}
   */
  const updateNotes = useCallback((): void => {
    if (!provider) return;
    const { collection } = provider;
    const docsArray = Array.from(collection.docs.values());
    logger.debug("[sidebar-note-list]: Updating All Notes List");
    logger.debug("[sidebar-note-list]: docMetas: ", collection.meta.docMetas);
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
  }, [provider, createNoteFromDoc]);

  const generateNoteByDocId = useCallback(
    function generateNoteByDocId(docId: string) {
      if (!provider) return null;
      const { collection } = provider;
      const doc = collection!.getDoc(docId);
      if (doc) {
        return createNoteFromDoc(doc);
      }
      return null;
    },
    [provider, createNoteFromDoc],
  );

  useEffect(() => {
    if (!provider) return;
    logger.debug(
      "[sidebar-note-list] useEffect: provider is changed, update notes",
    );
    updateNotes();
  }, [provider, updateNotes]);

  useEffect(() => {
    if (!provider || !editor) return;

    // const updateNote = (doc: Doc): void => {
    //   if (!doc.meta) return;
    //   assert(doc.meta.id, "Doc meta is missing");
    //   setNotes((prevNotes) => {
    //     const newNotes = new Map(prevNotes);
    //     newNotes.set(doc.meta.id, createNoteFromDoc(doc));
    //     return newNotes;
    //   });
    // };
    const disposable = [
      // 添加时候
      provider.collection.slots.docAdded.on((docId) => {
        logger.debug("[sidebar-note-list] EVENT: docAdded", docId);
        const note = generateNoteByDocId(docId);
        if (note) {
          setNotes((prevNotes) => [...prevNotes, note]);
        }
      }),
      // 删除时候
      provider.collection.slots.docRemoved.on((docId) => {
        logger.debug("[sidebar-note-list] EVENT: docRemoved", docId);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== docId));
      }),
      // 更新时候
      provider.collection.slots.docUpdated.on(() => {
        // doc 标题、标签更新时候会触发
        logger.debug("[sidebar-note-list] EVENT: collection.slots.docUpdated");
        setTimeout(() => {
          const updateNote = generateNoteByDocId(editor.doc.id);
          if (updateNote) {
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === updateNote.id ? updateNote : note,
              ),
            );
          }
        }, 300);
      }),
    ];

    return () => {
      logger.debug("[sidebar-note-list] EVENT: disposable all");
      disposable.forEach((d) => d.dispose());
    };
  }, [provider, editor, generateNoteByDocId, updateNotes]);

  useEffect(() => {
    if (!provider || !selectedNote.selected || !editor) return;
    logger.debug(
      `[sidebar-note-list] register editor doc event, selected:${selectedNote.selected},editor:${editor.doc.id}`,
    );
    const disposable = provider.collection.docs
      .get(selectedNote.selected)
      ?.slots.blockUpdated.on((e) => {
        logger.debug("[sidebar-note-list] EVENT: blockUpdated", e);
        setTimeout(() => {
          const updateNote = generateNoteByDocId(editor.doc.id);
          if (updateNote) {
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === updateNote.id ? updateNote : note,
              ),
            );
          }
        }, 300);
      });

    return () => {
      logger.debug(
        `[sidebar-note-list] EVENT: disposable current doc,selected:${selectedNote.selected},editor:${editor.doc.id}`,
      );
      disposable?.dispose();
    };
  }, [provider, selectedNote.selected, editor, generateNoteByDocId]);

  useEffect(() => {
    logger.debug("NoteList Component has been mounted");
    return () => {
      logger.debug("NoteList Component will be unmounted");
    };
  }, []);
  return (
    <Tabs defaultValue="all">
      <ScrollArea
        // 要减去顶部系统bar的高度
        className="h-[calc(100dvh-3rem)]"
      >
        <div className="relative flex flex-col w-full">
          <SideBarTitle title="Notes">
            <ControlTab />
          </SideBarTitle>
          {/* <div className="h-3 "></div> */}
          <TabsContent value="all" className="mt-3 max-w-full">
            <FileList files={notes} />
          </TabsContent>
          <TabsContent value="stared" className="mt-3 max-w-full">
            <FileList files={staredFiles} />
          </TabsContent>
        </div>
      </ScrollArea>
    </Tabs>
  );
});
