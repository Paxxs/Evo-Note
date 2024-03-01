// "use client";

// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef } from "react";
// import { createPortal } from "react-dom";

// export function Modal({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const dialogRef = useRef<HTMLDialogElement>(null);

//   useEffect(() => {
//     if (!dialogRef.current?.open) {
//       dialogRef.current?.showModal();
//     }
//   }, []);

//   function onDismiss() {
//     router.back();
//   }

//   return createPortal(
//     <div className="settings-modal-backdrop">
//       <dialog
//         ref={dialogRef}
//         className="modal backdrop:bg-white/30 backdrop:backdrop-blur-sm dark:backdrop:bg-black/30 relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md"
//         onClose={onDismiss}
//       >
//         <div className="flex justify-end p-2">
//           <Button onClick={onDismiss}>x</Button>
//         </div>
//         <div className="p-6 pt-0">{children}</div>
//       </dialog>
//     </div>,
//     document.getElementById("modal-root")!
//   );
// }
"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  useEffect(() => {
    console.log("open", open);
    if (!open) {
      setTimeout(() => router.back(), 500);
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>偏好选项</DrawerTitle>
            <DrawerDescription>配置编辑器</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
