import SideBarTitle from "../../ui/sider-bar-title";

export default function SideBarAI() {
  return (
    <>
      <SideBarTitle title="Copilot Chat"></SideBarTitle>
      <iframe
        src="https://freegpt.nb.gl"
        className="w-full h-[calc(100dvh-52.8px-3rem)]"
        allow="autoplay; encrypted-media; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy"
      ></iframe>
    </>
  );
}
