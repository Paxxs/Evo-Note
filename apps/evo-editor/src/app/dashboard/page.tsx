"use client";

// import EvoEditor from "@/components/evo-note/evo-editor";
import dynamic from "next/dynamic";

export default function Page(): JSX.Element {
  const EvoEditor = dynamic(() => import("@/components/evo-note/evo-editor"), {
    ssr: false,
  });
  return (
    <div className="flex w-full" vaul-drawer-wrapper="">
      <EvoEditor />
    </div>
  );
}
