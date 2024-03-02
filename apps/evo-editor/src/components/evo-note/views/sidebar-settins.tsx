import SettingsPage from "@/app/dashboard/preference/page";
import NiceDraw from "../ui/nice-draw";

interface SideBarSettinsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SidebarSettins({
  open,
  onOpenChange,
}: SideBarSettinsProps) {
  return (
    <NiceDraw
      title="Preferences"
      discription="Customize your experience"
      open={open}
      onOpenChange={onOpenChange}
    >
      <SettingsPage />
    </NiceDraw>
  );
}
