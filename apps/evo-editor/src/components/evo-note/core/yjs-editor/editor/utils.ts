import {
  DocCollection,
  BlobStorage,
  Generator,
  Schema,
  Doc,
} from "@blocksuite/store";
import { AffineSchemas, createDefaultDoc } from "@blocksuite/blocks";
export function createCollection(id = "evo-note-example") {
  const schema = new Schema().register(AffineSchemas);
  const idGenerator = Generator.NanoID;
  const collection = new DocCollection({
    schema,
    id,
    // blobStorages:
    idGenerator,
  });
  return collection;
}

function createLogStorage(): BlobStorage {
  return {
    crud: {
      set: async (key: string, value: Blob) => {
        console.log("db set:", key, value);
        return key;
      },
      get: async (key: string) => {
        console.log("db get:", key);
        return null;
      },
      delete: async (key: string) => {
        console.log("db delete:", key);
      },
      list: async () => {
        console.log("db list");
        return [];
      },
    },
  };
}

export async function createEmptyDoc(
  collection: DocCollection,
  id: string = "page1",
) {
  const doc = collection.createDoc({
    id,
  });
  doc.load(() => {
    const pageBlockId = doc.addBlock("affine:page", {
      title: new doc.Text(""),
    });
    doc.addBlock("affine:surface", {}, pageBlockId);
    const noteId = doc.addBlock("affine:note", {}, pageBlockId);
    doc.addBlock("affine:paragraph", {}, noteId);
  });
  doc.resetHistory();
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
