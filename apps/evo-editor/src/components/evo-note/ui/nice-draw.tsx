import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface NiceDrawProps {
  title: string | JSX.Element;
  discription?: string | JSX.Element;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function NiceDraw({
  title,
  discription,
  children,
  open,
  onOpenChange,
}: NiceDrawProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80%]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {discription && <DrawerTitle>{discription}</DrawerTitle>}
          </DrawerHeader>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
