"use client";
import { AffineSchemas } from "@blocksuite/blocks";
import {
  BlobStorage,
  Generator,
  Schema,
  Workspace,
  Y,
} from "@blocksuite/store";

function createWorkspace(id = "evo-note-example") {
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

async function createEmptyDoc(workspace: Workspace) {
  const doc = workspace.createDoc({
    id: "page1",
  });
  doc.load(() => {
    const pageBlockId = doc.addBlock("affine:page", {});
    doc.addBlock("affine:surface", {}, pageBlockId);
    const noteId = doc.addBlock("affine:note", {}, pageBlockId);
    doc.addBlock("affine:paragraph", {}, noteId);
  });
  doc.resetHistory();
}

export class Provider {
  workspace!: Workspace; // definite assignment assertion。
  // 会被明确地赋值，且不会在构造函数里直接赋值。用于告诉编译器别警报
  private constructor() {} // 私有的构造函数，让外部不能直接实例化
  static async init() {
    return new Provider();
  }
  async start() {
    // TODO 后期加入数据库判断数据库是否有数据
    this.workspace = createWorkspace();
    this._connectWorkspace(); // 处理更新
    console.log("insertDocToDb", this.workspace.id);
    await createEmptyDoc(this.workspace);
  }
  private _connectWorkspace() {
    const { workspace } = this;
    workspace.doc.on("update", (update) => {
      console.log(
        "Workspace update:",
        "INSERT INTO updates (doc_id, update_data) VALUES (?, ?)",
        workspace.id,
        update,
      );
    });
    workspace.doc.on("subdocs", (subDoc) => {
      subDoc.added.forEach((doc: Y.Doc) => {
        console.log(
          "Workspace update: subdocs added:",
          "INSERT INTO docs (doc_id, root_doc_id) VALUES (?, ?)",
          doc.guid,
          workspace.id,
        );
      });
    });
  }
  private _connectSubDoc(doc: Y.Doc) {
    doc.on("update", async (update) => {
      console.log(
        "SubDoc update:",
        "INSERT INTO updates (doc_id, update_data) VALUES (?, ?)",
        doc.guid,
        update,
      );
    });
  }
}
