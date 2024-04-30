import { Theme } from "@/registry/themes";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Config = {
  theme: Theme["name"];
  radius: number;
  navDarkAccent: boolean;
  translucent: boolean;
  copilotUrl: string;
};

const configAtom = atomWithStorage<Config>("config", {
  theme: "neutral",
  radius: 0.5,
  navDarkAccent: true, // 导航栏夜间模式是否显示背景色
  translucent: false,
  copilotUrl: "https://freegpt.nb.gl",
});

export function useConfig() {
  return useAtom(configAtom);
}
