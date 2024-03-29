import { DocCollection, Y } from "@blocksuite/store";
import { createEmptyDoc, createCollection, assertExists } from "../utils";
import { AffineEditorContainer } from "@blocksuite/presets";
import logger from "@/lib/logger";

const logIdentifier = "[Provider]";

export class Provider {
  collection!: DocCollection; // definite assignment assertion。
  // 会被明确地赋值，且不会在构造函数里直接赋值。用于告诉编译器别警报
  private constructor(
    private backendUrl: string,
    private collectionId: string,
  ) {} // 私有的构造函数，让外部不能直接实例化
  static async init(backendUrl: string, id: string = "evo-note-main") {
    return new Provider(backendUrl, id);
  }
  async connect() {
    logger.debug(`${logIdentifier}::connect()`);
    this.collection = await createCollection();

    logger.debug(`${logIdentifier}::connect()::waitForSynced()`);
    await this.collection.waitForSynced();

    // 判断是否需要初始化
    const shouldInit = this.collection.docs.size === 0;

    if (shouldInit) {
      logger.debug(`${logIdentifier}::connect()::init()`);
      return createEmptyDoc(this.collection);
    } else {
      logger.debug(
        `${logIdentifier}::connect() 😀 no need init(), size:`,
        this.collection.docs.size,
      );

      // 不需要初始化就找一个根文档
      const firstPageId =
        this.collection.docs.size > 0
          ? this.collection.docs.keys().next().value
          : // 如果小于0，大概是正在加载吧，等待一下拿一个
            await new Promise<string>((resolve) => {
              this.collection.slots.docAdded.once((id) => resolve(id));
            });

      logger.debug(`${logIdentifier}::connect()::firstPageId`, firstPageId);

      const doc = this.collection.getDoc(firstPageId);
      assertExists(doc);
      doc.load();
      // wait for data injected from provider
      if (!doc.root) {
        await new Promise((resolve) => doc.slots.rootAdded.once(resolve));
      }
      doc.resetHistory();
      return doc;
    }
  }

  /**
   * Deletes a document from the collection.
   *
   * @param {string} docId - The ID of the document to be deleted.
   * @return {Promise<string>} - 如果返回空，代表没有文档可以删除。删除成功会返回一个可用的文档的id
   */
  async deleteDoc(docId: string): Promise<string> {
    const { backendUrl, collectionId, collection } = this;
    if (collection.docs.size > 1) {
      // 至少有两个文档才能删除
      await fetch(`${backendUrl}/collection/${collectionId}/doc/${docId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            logger.debug(
              `${logIdentifier}::deleteDoc::error !response.ok`,
              response,
            );
            throw new Error(`${logIdentifier} Failed to delete doc ${docId}`);
          }
        })
        .catch((error) => {
          logger.debug(`${logIdentifier}::deleteDoc::error`, error);
          throw error;
        });
      collection.removeDoc(docId);
      return collection.docs.keys().next().value;
    }
    return "";
  }
  changeEditorDoc(docId: string, editor: AffineEditorContainer) {
    logger.debug(`${logIdentifier}::changeEditorDoc()`, docId);
    const doc = this.collection.getDoc(docId);
    assertExists(doc);
    doc.load();
    editor.doc = doc;
  }
}
