import { useConfig } from "@/hooks/use-config";
import SideBarTitle from "../../ui/sider-bar-title";

export default function SideBarAI() {
  const [config, _] = useConfig();
  return (
    <>
      <SideBarTitle title="Copilot Chat"></SideBarTitle>
      <iframe
        src={config.copilotUrl}
        className="w-full h-[calc(100dvh-52.8px-3rem)]"
        allow="autoplay; encrypted-media; fullscreen; clipboard-write;"
        sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation"
        loading="lazy"
      ></iframe>
    </>
  );
}
