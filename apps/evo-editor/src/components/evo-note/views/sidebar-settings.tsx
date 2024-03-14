import SettingsPage from "@/app/dashboard/preference/page";
import NiceDraw from "../ui/nice-draw";

interface SideBarSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SidebarSettings({
  open,
  onOpenChange,
}: SideBarSettingsProps) {
  return (
    <NiceDraw
      title="Preferences"
      description="Customize your experience"
      open={open}
      onOpenChange={onOpenChange}
    >
      <SettingsPage />
    </NiceDraw>
  );
}
