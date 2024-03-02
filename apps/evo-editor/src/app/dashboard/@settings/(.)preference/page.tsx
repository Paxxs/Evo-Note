import SettingsPage from "@/app/dashboard/preference/page";
import { Modal } from "./modal";

export default function Page() {
  return (
    <Modal>
      <div>
        <SettingsPage />
      </div>
    </Modal>
  );
}
