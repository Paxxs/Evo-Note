import {
  DocCollection,
  BlobStorage,
  Generator,
  Schema,
  Doc,
  StoreOptions,
} from "@blocksuite/store";
import { AffineSchemas, createDefaultDoc } from "@blocksuite/blocks";
import logger from "@/lib/logger";
import { DocSource } from "./provider/source";
import { mergeUpdates, diffUpdate, encodeStateVectorFromUpdate } from "yjs";
import { getBackendUrl } from "@/lib/backendConfig";

const logID = "[Utils]";

export async function createCollection(
  name = "Evo Workspace",
  id = "evo-note-main",
) {
  const backendUrl = await getBackendUrl().then((url) => {
    return url;
  });

  logger.debug(`${logID}::createCollection()`, backendUrl, id, name);

  fetch(`${backendUrl}/collection/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then((res) => {
      if (!res.ok) {
        logger.error(
          `${logID}::create collection's response error ${id}-${name}`,
          res,
        );
        throw new Error(`${logID} Failed to create collection`);
      }
    })
    .catch((err) => {
      logger.error(`${logID}::Failed to create collection ${id}-${name}`, err);
      throw err;
    });

  const schema = new Schema().register(AffineSchemas);
  const idGenerator = Generator.NanoID;

  const docSources: StoreOptions["docSources"] = {
    main: new RemoteDocSource(backendUrl, id),
  };

  const collection = new DocCollection({
    schema,
    id,
    blobStorages: [() => createRemoteBlobStorage(backendUrl, id)],
    docSources,
    idGenerator,
    defaultFlags: {
      enable_synced_doc_block: true,
      enable_expand_database_block: true,
    },
  });
  logger.debug(`${logID}::::createCollection(): Start the data sync process`);
  collection.start();
  return collection;
}

// Doc 更新数据的结构，里面只有 update 是有用的。
export type UpdateMessage = {
  timestamp: number;
  update: Uint8Array;
};

/**
 * Serializes an array of update messages into a JSON string.
 *
 * @param {UpdateMessage[]} updates - The array of update messages to be serialized.
 * @return {string} A JSON string representing the serialized update messages.
 */
export function serializeUpdates(updates: UpdateMessage[]): string {
  return JSON.stringify(
    updates.map((update) => ({
      ...update, // 保留其他属性
      update: Array.from(update.update), // 将 Uint8Array 转换为数字数组以便于序列化
    })),
  );
}

/**
 * Deserializes an array of UpdateMessage objects from a serialized string(blob).
 *
 * @param {string} serializeUpdates - The serialized string representing an array of UpdateMessage objects.
 * @return {UpdateMessage[]} An array of UpdateMessage objects.
 */
export function deserializeUpdates(serializeUpdates: string): UpdateMessage[] {
  const updates: { timestamp: number; update: number[] }[] =
    JSON.parse(serializeUpdates);
  return updates.map((update) => ({
    timestamp: update.timestamp,
    update: new Uint8Array(update.update), // 将数字数组转换回 Uint8Array
  }));
}

/**
 * Creates a remote blob storage.
 *
 * @param {string} backendUrl - The backend URL.
 * @param {string} collectionID - The collection ID.
 * @return {BlobStorage} The created remote blob storage.
 */
function createRemoteBlobStorage(
  backendUrl: string,
  collectionID: string,
): BlobStorage {
  const localCache = new Map<string, Blob>();
  return {
    crud: {
      delete: async (key) => {
        logger.debug(`${logID}:: RemoteBlobStorage: DELETE`, key);
        await fetch(`${backendUrl}/collection/${collectionID}/blob/${key}`, {
          method: "DELETE",
        }).then((res) => {
          if (!res.ok) {
            logger.error(
              `${logID}💥:: RemoteBlobStorage: DELETE error`,
              key,
              res,
            );
            throw new Error("RemoteBlobStorage ERR:" + res.statusText);
          }
          localCache.delete(key);
        });
      },
      get: async (key) => {
        logger.debug(`${logID}:: RemoteBlobStorage: GET`, key);
        if (localCache.has(key)) {
          return localCache.get(key) as Blob;
        }
        const blob = await fetch(
          `${backendUrl}/collection/${collectionID}/blob/${key}`,
          {
            method: "GET",
          },
        ).then((res) => {
          if (!res.ok) {
            logger.error(`${logID}💥:: RemoteBlobStorage: GET error`, key, res);
            // throw new Error("RemoteBlobStorage ERR:" + res.statusText);
            return null;
          }
          return res.blob();
        });
        if (blob) localCache.set(key, blob);
        return blob;
      },
      set: async (key, value) => {
        logger.debug(`${logID}:: RemoteBlobStorage: SET`, key, value.type);
        localCache.set(key, value);

        await fetch(`${backendUrl}/collection/${collectionID}/blob/${key}`, {
          method: "PUT",
          headers: {
            "Content-Type": value.type,
          },
          body: await value.arrayBuffer(),
        }).then((res) => {
          if (!res.ok) {
            logger.error(`${logID}💥:: RemoteBlobStorage: SET error`, key, res);
            throw new Error("RemoteBlobStorage ERR:" + res.statusText);
          }
        });
        return key;
      },
      list: async () => {
        logger.debug(`${logID}:: RemoteBlobStorage: LIST`);
        const keys: string[] = await fetch(
          `${backendUrl}/collection/${collectionID}/blob`,
          {
            method: "GET",
          },
        ).then((res) => {
          if (!res.ok) {
            logger.error(`${logID}💥:: RemoteBlobStorage: LIST error`, res);
            // throw new Error("RemoteBlobStorage ERR:" + res.statusText);
            return Array.from(localCache.keys());
          }
          return res.json();
        });
        return keys;
      },
    },
  };
}

async function pullDocUpdates(
  backendUrl: string,
  collectionId: string,
  docId: string,
) {
  const rawData = await fetch(
    `${backendUrl}/collection/${collectionId}/doc/${docId}`,
    {
      method: "GET",
    },
  ).then((response) => {
    if (!response.ok) {
      logger.error(`${logID}💥:: pullDocUpdates: response error`, response);
      // throw new Error(`Failed to fetch doc ${docId}`);
      return "";
    }
    return response.text();
  });
  if (rawData === "") {
    logger.debug(`${logID}:: pullDocUpdates: rawData is empty`);
    return [];
  }
  const data = deserializeUpdates(rawData);
  logger.debug(`${logID}:: pullDocUpdates: data`, data);
  return data;
}

/**
 * Represents a source of documents that can be pulled from or pushed to a remote server.
 */
class RemoteDocSource implements DocSource {
  name: string = "RemoteDocSource";
  mergeCount = 1;
  collectionID: string;
  backendUrl: string;

  /**
   * Constructs a new RemoteDocSource instance.
   *
   * @param {string} backendUrl - The URL of the backend server.
   * @param {string} collectionID - The ID of the collection to access.
   */
  constructor(backendUrl: string, collectionID: string) {
    this.collectionID = collectionID;
    this.backendUrl = backendUrl;
  }

  async pull(
    docId: string,
    state: Uint8Array,
  ): Promise<{ data: Uint8Array; state?: Uint8Array } | null> {
    logger.debug(`${logID}:: RemoteDocSource: pull`, this.collectionID, docId);
    const remoteUpdates = await pullDocUpdates(
      this.backendUrl,
      this.collectionID,
      docId,
    );
    logger.debug(
      `${logID}:: RemoteDocSource: pull: remoteUpdates`,
      remoteUpdates,
    );
    if (remoteUpdates.length === 0) {
      logger.debug("RemoteDocSource:pull: remote data is empty");
      return null;
    }

    // 如果不为空，合并更新
    const update = mergeUpdates(remoteUpdates.map(({ update }) => update));

    const diff = state.length ? diffUpdate(update, state) : update;
    return { data: diff, state: encodeStateVectorFromUpdate(update) };
  }

  async push(docId: string, data: Uint8Array): Promise<void> {
    logger.debug(`${logID}:: RemoteDocSource: push`, this.collectionID, docId);
    const remoteUpdates = await pullDocUpdates(
      this.backendUrl,
      this.collectionID,
      docId,
    );
    // 直接添加本次的更新
    let rows: UpdateMessage[] = [
      ...remoteUpdates,
      {
        timestamp: Date.now(),
        update: data,
      },
    ];

    if (this.mergeCount && rows.length > this.mergeCount) {
      // 如果大小大于合并阈值，则合并
      const merged = mergeUpdates(rows.map(({ update }) => update));
      rows = [
        {
          timestamp: Date.now(),
          update: merged,
        },
      ];
    }

    // 发送给远程服务器
    await fetch(
      `${this.backendUrl}/collection/${this.collectionID}/doc/${docId}`,
      {
        method: "PUT",
        body: serializeUpdates(rows),
      },
    ).then((res) => {
      if (!res.ok) {
        logger.error(`${logID}💥:: RemoteDocSource: push error`, res);
        throw new Error("RemoteDocSource ERR:" + res.statusText);
      }
    });
  }

  subscribe(cb: (docId: string, data: Uint8Array) => void): () => void {
    logger.debug(`${logID}:: RemoteDocSource: subscribe`);
    return () => {};
  }
}

/**
 * Asserts that a value exists and is not null or undefined.
 *
 * @param {T | null | undefined} val - The value to check.
 * @param {string | Error} [message="val does not exist"] - The error message or object to throw if the assertion fails.
 * @throws {Error} Throws an error if the value is null or undefined.
 */
export function assertExists<T>(
  val: T | null | undefined,
  message: string | Error = "val does not exist",
): asserts val is T {
  if (val === null || val === undefined) {
    if (message instanceof Error) {
      throw message;
    }
    const errorCode = "ERR_VALUE_NOT_EXISTS";
    throw new Error(`${errorCode}: ${message}`);
  }
}

/**
 * Creates an empty document in the specified collection.
 *
 * @param {DocCollection} collection - The collection in which to create the document.
 * @param {string} [id="doc-home"] - The optional ID for the new document.
 * @return {Doc} The newly created empty document.
 */
export function createEmptyDoc(
  collection: DocCollection,
  id: string = "doc-home",
): Doc {
  const doc = collection.createDoc({ id });
  doc.load(() => {
    const pageBlockId = doc.addBlock("affine:page", {
      title: new doc.Text(""),
    });
    doc.addBlock("affine:surface", {}, pageBlockId);
    const noteId = doc.addBlock("affine:note", {}, pageBlockId);
    doc.addBlock("affine:paragraph", {}, noteId);
  });
  doc.resetHistory();
  return doc;
}

/**
 * Generate a document block for a given collection.
 *
 * @param {DocCollection} collection - the collection to create a document block for
 * @return {Doc} the created document block
 */
export const createDocBlock = (collection: DocCollection): Doc => {
  const id = collection.idGenerator();
  return createDefaultDoc(collection, { id, title: "" });
};

/**
 * Retrieves a preview text from the given document with a specified maximum length and search block count.
 *
 * @param {Doc} doc - The document object to extract the preview text from.
 * @param {number} [maxPreviewLength=150] - The maximum length of the preview text.
 * @param {number} [maxSearchBlockCount=30] - The maximum number of blocks to search for the preview text.
 * @return {string} The extracted preview text within the specified constraints.
 */
export const getPagePreviewText = (
  doc: Doc,
  maxPreviewLength: number = 150,
  maxSearchBlockCount: number = 30,
): string => {
  const docRoot = doc.root;
  if (!docRoot) {
    return "";
  }
  const preview: string[] = [];
  const queue = [docRoot];
  while (queue.length && maxPreviewLength > 0 && maxSearchBlockCount-- > 0) {
    const current = queue.shift();
    if (!current) {
      console.log("current is null");
      break;
    }
    if (current.flavour === "affine:surface") {
      // The surface block is a special block that contains canvas data,
      // it should not be included in the preview.
      continue;
    }
    if (current.children) {
      queue.unshift(...current.children);
    }
    if (current.role !== "content") continue;

    if (current.text) {
      // Text block e.g. paragraph/heading/list/code
      const text = current.text.toString();
      if (!text.length) continue;
      maxPreviewLength -= text.length;
      preview.push(text);
    } else {
      // Other block e.g. image/attachment/bookmark
      const type = current.flavour.split("affine:")[1] ?? null;
      if (type) {
        maxPreviewLength -= type.length;
        preview.push(`[${type}]`);
      }
    }
  }
  return preview.join(" ").slice(0);
};
