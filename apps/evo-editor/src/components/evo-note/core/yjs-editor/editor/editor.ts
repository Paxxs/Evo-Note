import { Doc } from "@blocksuite/store";
import { Provider } from "./provider/provider";
import { AffineEditorContainer } from "@blocksuite/presets";
import "@blocksuite/presets/themes/affine.css";

export async function initEditor() {
  // TODO 数据库连接，并拿数据
  const provider = await Provider.init();
  await provider.start();

  let doc: Doc | null = null;
  const { collection } = provider;
  collection.docs.forEach((d) => {
    doc = doc ?? d;
  });
  if (!doc) throw Error("doc not found");

  const editor = new AffineEditorContainer();
  editor.doc = doc;
  editor.slots.docLinkClicked.on(({ docId }) => {
    const target = <Doc>collection.getDoc(docId);
    editor.doc = target;
  });
  return { editor, provider, collection };
}
