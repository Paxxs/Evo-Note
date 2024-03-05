import { Separator } from "@/components/ui/separator";

export default function SideBarTitle({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="sticky top-0 z-10 flex flex-col mf-bg-blur">
        <div className="flex items-center px-4 py-2 max-h-[52px] min-h-[52px]">
          <h1 className="text-xl font-bold">{title}</h1>
          {children}
        </div>
        <Separator />
      </div>
    </>
  );
}
