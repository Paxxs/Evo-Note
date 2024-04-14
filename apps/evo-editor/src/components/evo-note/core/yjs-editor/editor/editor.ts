import { Provider } from "./provider/provider";
import { AffineEditorContainer } from "@blocksuite/presets";
import "@blocksuite/presets/themes/affine.css";
import { getBackendUrl } from "@/lib/backendConfig";
import logger from "@/lib/logger";
import {
  BookmarkService,
  EdgelessEditorBlockSpecs,
  EdgelessRootService,
  EmbedGithubService,
  EmbedLoomService,
  EmbedYoutubeService,
  ImageService,
  PageEditorBlockSpecs,
  PageRootService,
  // Service
} from "@blocksuite/blocks";
import { CanvasTextFonts } from "./fonts";
// import { DocEditorBlockSpecs, EdgelessEditorBlockSpecs, DocPageService, EdgelessPageService } from '@blocksuite/blocks';

export async function initEditor() {
  const backendUrl = await getBackendUrl();
  const provider = await Provider.newProvider({ backendUrl });
  const { doc } = provider;
  const editor = new AffineEditorContainer();

  // 覆盖默认的预览链接
  const linkPreviewUrl = `${backendUrl}/link-preview`;
  const ImageProxyUrl = `${backendUrl}/image`;

  // provide link preview endpoint to blocksuite
  ImageService.setImageProxyURL(ImageProxyUrl);
  BookmarkService.setLinkPreviewEndpoint(linkPreviewUrl);
  EmbedGithubService.setLinkPreviewEndpoint(linkPreviewUrl);
  EmbedYoutubeService.setLinkPreviewEndpoint(linkPreviewUrl);
  EmbedLoomService.setLinkPreviewEndpoint(linkPreviewUrl);

  // override default fonts
  const presets = getExampleSpecs();
  editor.pageSpecs = presets.pageModeSpecs;
  editor.edgelessSpecs = presets.edgelessModeSpecs;

  editor.doc = doc;
  editor.slots.docLinkClicked.on(({ docId }) => {
    logger.debug("🤖 [initEditor] docLinkClicked event", docId);
    provider.changeEditorDoc(docId, editor);
  });
  return { editor, provider };
}

class pageService extends PageRootService {
  override loadFonts(): void {
    this.fontLoader.load(CanvasTextFonts);
  }
}

class edgelessService extends EdgelessRootService {
  override loadFonts(): void {
    this.fontLoader.load(CanvasTextFonts);
  }
}

// https://github.com/toeverything/blocksuite/issues/6209
function getExampleSpecs() {
  // const docModeSpecs =
  let pageModeSpecs = PageEditorBlockSpecs.map((preset) => {
    if (preset.schema.model.flavour === "affine:page") {
      return {
        ...preset,
        service: pageService,
      };
    }
    return preset;
  });
  let edgelessModeSpecs = EdgelessEditorBlockSpecs.map((preset) => {
    if (preset.schema.model.flavour === "affine:page") {
      return {
        ...preset,
        service: edgelessService,
      };
    }
    return preset;
  });

  return {
    pageModeSpecs,
    edgelessModeSpecs,
  };
}
