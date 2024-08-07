import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface NiceDrawProps {
  title: string | JSX.Element;
  description?: string | JSX.Element;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function NiceDraw({
  title,
  description,
  children,
  open,
  onOpenChange,
}: NiceDrawProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80%]">
        <DrawerHeader className="sm:text-center">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerTitle>{description}</DrawerTitle>}
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
