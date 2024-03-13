import {
  DocCollection,
  BlobStorage,
  Generator,
  Schema,
} from "@blocksuite/store";
import { AffineSchemas } from "@blocksuite/blocks";
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
    const pageBlockId = doc.addBlock("affine:page", {});
    doc.addBlock("affine:surface", {}, pageBlockId);
    const noteId = doc.addBlock("affine:note", {}, pageBlockId);
    doc.addBlock("affine:paragraph", {}, noteId);
  });
  doc.resetHistory();
}
