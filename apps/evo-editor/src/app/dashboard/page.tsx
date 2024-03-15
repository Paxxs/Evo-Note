// "use client";

// import EvoEditor from "@/components/evo-note/evo-editor";
import EvoSkeleton from "@/components/evo-note/skeleton";
import dynamic from "next/dynamic";

export default function Page(): JSX.Element {
  const EvoEditor = dynamic(() => import("@/components/evo-note/Editor"), {
    ssr: false,
    loading: () => <EvoSkeleton />,
  });
  return (
    <div className="flex w-full" vaul-drawer-wrapper="">
      <EvoEditor />
    </div>
  );
}
