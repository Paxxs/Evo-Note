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
      <div className="flex px-4 py-2 items-center h-[52px]">
        <h1 className="text-xl font-bold">{title}</h1>
        {children}
      </div>
      <Separator />
    </>
  );
}
