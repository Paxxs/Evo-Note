"use client";

// import EvoEditor from "@/components/evo-note/evo-editor";
import EvoSkeleton from "@/components/evo-note/skeleton";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Page(): JSX.Element {
  const EvoEditor = useMemo(() => {
    return dynamic(() => import("@/components/evo-note/Editor"), {
      ssr: false,
      loading: () => <EvoSkeleton />,
    });
  }, []);
  return (
    <>
      <EvoEditor />
    </>
  );
}
