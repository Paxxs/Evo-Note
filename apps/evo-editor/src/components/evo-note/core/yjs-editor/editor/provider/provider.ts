import { Doc, DocCollection, Y } from "@blocksuite/store";
import { createEmptyDoc, createCollection, assertExists } from "../utils";
import { AffineEditorContainer } from "@blocksuite/presets";
import logger from "@/lib/logger";
import { getBackendUrl } from "@/lib/backendConfig";
import { createDefaultDoc } from "@blocksuite/blocks/dist/index.js";

const logIdentifier = "[Provider]";

export class Provider {
  collection!: DocCollection; // definite assignment assertion。
  doc!: Doc; // 可用的首Doc
  // 会被明确地赋值，且不会在构造函数里直接赋值。用于告诉编译器别警报
  private constructor(
    private backendUrl: string,
    private collectionId: string,
  ) {} // 私有的构造函数，让外部不能直接实例化

  /**
   * A static method to create a new Provider instance with optional backend URL and collection ID parameters.
   *
   * @param {Readonly<{
   *   backendUrl?: string;
   *   collectionId?: string;
   * }>} opts - Optional parameters for backend URL and collection ID.
   * @return {Promise<Provider>} - A Promise that resolves to a new Provider instance.
   */
  static async newProvider(
    opts: Readonly<{
      backendUrl?: string;
      collectionId?: string;
    }> = {},
  ): Promise<Provider> {
    let { backendUrl, collectionId = "evo-note-main" } = opts;
    if (!backendUrl) backendUrl = await getBackendUrl();

    try {
      const provider = new Provider(backendUrl, collectionId);

      logger.debug(`${logIdentifier}::newProvider()`, collectionId);
      provider.collection = await createCollection({ id: collectionId });

      logger.debug(`${logIdentifier}::newProvider()::waitForSynced()`);
      await provider.collection.waitForSynced();

      // 判断是否需要初始化
      const shouldInit = provider.collection.docs.size === 0;

      if (shouldInit) {
        logger.debug(`${logIdentifier}::newProvider()::init()`);
        provider.doc = createDefaultDoc(provider.collection);
      } else {
        logger.debug(
          `${logIdentifier}::newProvider() 😀 no need init(), size:`,
          provider.collection.docs.size,
        );

        // 不需要初始化就找一个根文档
        const firstPageId =
          provider.collection.docs.size > 0
            ? provider.collection.docs.keys().next().value
            : // 如果小于0，大概是正在加载吧，等待一下拿一个
              await new Promise<string>((resolve) => {
                provider.collection.slots.docAdded.once((id) => resolve(id));
              });

        logger.debug(
          `${logIdentifier}::newProvider()::firstPageId`,
          firstPageId,
        );

        const doc = provider.collection.getDoc(firstPageId);
        assertExists(doc);
        doc.load();
        // wait for data injected from provider
        if (!doc.root) {
          await new Promise((resolve) => doc.slots.rootAdded.once(resolve));
        }
        doc.resetHistory();
        provider.doc = doc;
      }
      return provider;
    } catch (error) {
      logger.error(`${logIdentifier}::createProvider() error:`, error);
      throw error;
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
  stopSync(): Promise<boolean> {
    const { store } = this.collection;

    const performOperations = async (): Promise<boolean> => {
      try {
        if (!store.docSync.canGracefulStop()) {
          await store.docSync.waitForGracefulStop();
        }
        store.awarenessSync.disconnect();
        store.awarenessStore.destroy();
        store.docSync.forceStop();
        return true;
      } catch (error) {
        throw error;
      }
    };

    return new Promise((resolve, reject) => {
      performOperations().then(resolve).catch(reject);
    });
  }
}
