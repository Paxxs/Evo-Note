"use client";
import { MovingButton } from "@/components/ui/moving-border";
import { Spotlight } from "@/components/ui/spotlight";
import { useIsWailsEnvironment } from "@/hooks/use-is-wails-environment";
import {
  BrowserOpenURL,
  WindowSetLightTheme,
  WindowSetDarkTheme,
} from "@/wails/wailsjs/runtime/runtime";
import { useTheme } from "next-themes";
import Image from "next/image";

// import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  // next 主题
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const isWails = useIsWailsEnvironment();
  function goEditor() {
    router.push("/dashboard");
  }
  function openBlog() {
    if (isWails) {
      BrowserOpenURL("https://www.morfans.cn");
    } else {
      window.open("https://www.morfans.cn", "_blank");
    }
  }

  useEffect(() => {
    if (!isWails) return;
    resolvedTheme === "dark" ? WindowSetDarkTheme() : WindowSetLightTheme();
  }, [resolvedTheme, isWails]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 justify-between select-none mf-draggable bg-background/[0.75] bg-grid-black/[0.02] dark:bg-grid-white/[0.02]">
      <Spotlight
        fill={resolvedTheme === "dark" ? "white" : "violet"} // 使用深蓝色作为亮色模式的填充色
        className="-top-40 left-0 md:left-60 md:-top-20"
      />
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:p-4 lg:dark:bg-zinc-800/30">
          应用施工中.... &nbsp;
          <code className="font-bold">v2Note.com</code>
        </p>
      </div>

      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b  from-sky-500 to-indigo-500 dark:from-neutral-50 dark:to-neutral-400">
          v2Note <br /> the way to Note.
        </h1>
        <p className="mt-4 font-normal text-base text-gray-700 dark:text-neutral-300 max-w-lg text-center mx-auto">
          A Cutting-Edge, Privacy-Centric Note-taking Experience
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[0]">
        <div className="hover:scale-105 active:scale-95 transition duration-300 ease-in-out  ">
          <MovingButton
            className="bg-white/60 dark:bg-slate-900/60 text-black dark:text-white border-neutral-200 dark:border-slate-800 "
            onClick={goEditor}
          >
            <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
              src="/next.svg"
              alt="Next Logo"
              width={65}
              height={16}
              priority
            />
          </MovingButton>
        </div>
      </div>
      {/* <MovingButton className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800">
        GO
      </MovingButton> */}

      <div className="mb-32 grid text-center gap-4 lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link
          href="/dashboard"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_self"
          rel="noopener noreferrer"
          prefetch
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            v2Note{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Experience the next-generation note-taking experience.
          </p>
        </Link>

        <a
          href="#"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          onClick={openBlog}
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Blog{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            中文字体显示测试，我能吞下玻璃而不伤身体。
          </p>
        </a>
      </div>
    </main>
  );
}
