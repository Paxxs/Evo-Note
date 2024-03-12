import { Workspace, BlobStorage, Generator, Schema } from "@blocksuite/store";
import { AffineSchemas } from "@blocksuite/blocks";
export function createWorkspace(id = "evo-note-example") {
  const schema = new Schema().register(AffineSchemas);
  const idGenerator = Generator.NanoID;
  const workspace = new Workspace({
    schema,
    id,
    // blobStorages:
    idGenerator,
  });
  return workspace;
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
  workspace: Workspace,
  id: string = "page1",
) {
  const doc = workspace.createDoc({
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
