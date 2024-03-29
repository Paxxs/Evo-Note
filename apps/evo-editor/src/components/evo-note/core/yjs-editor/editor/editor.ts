import { Doc } from "@blocksuite/store";
import { Provider } from "./provider/provider";
import { AffineEditorContainer } from "@blocksuite/presets";
import "@blocksuite/presets/themes/affine.css";
import { getBackendUrl } from "@/lib/backendConfig";
import logger from "@/lib/logger";

export async function initEditor() {
  const backendUrl = await getBackendUrl();
  const provider = await Provider.init(backendUrl);
  const doc = await provider.connect();

  const { collection } = provider;
  const editor = new AffineEditorContainer();
  editor.doc = doc;
  editor.slots.docLinkClicked.on(({ docId }) => {
    logger.debug("🤖 [initEditor] docLinkClicked event", docId);
    provider.changeEditorDoc(docId, editor);
  });
  return { editor, provider, collection };
}
