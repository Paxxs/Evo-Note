import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { useIsWailsEnvironment } from "@/hooks/use-is-wails-environment";
import { Environment } from "@/wails/wailsjs/runtime/runtime";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const AboutDialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
>(({ ...props }, ref) => {
  const isWails = useIsWailsEnvironment();
  const [environmentInfo, setEnvironmentInfo] = useState({
    platform: "Unknown",
    arch: "Unknown",
    buildType: "Unknown",
  });

  useEffect(() => {
    if (isWails) {
      Environment().then((info) => {
        setEnvironmentInfo((old) => {
          return {
            ...old,
            platform: `${info.platform}_${info.arch}`,
            buildType: info.buildType,
          };
        });
      });
    }
  }, [isWails]);
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader className="select-none">
          <div className="flex gap-2 items-center">
            <AlertCircle className="w-5 h-5" />
            About
          </div>
        </DialogHeader>
        <DialogDescription>
          <div className="select-none">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground">
              v2Note
            </h3>
            <hr />
            <p>A Cutting-Edge, Privacy-Centric Note-taking Experience.</p>
            <br />
            <br />
          </div>
          {(isWails && (
            <>
              <p>Mode: Application</p>
              <p>OS: {environmentInfo.platform}</p>
              <p>Build Type: {environmentInfo.buildType}(App)</p>
            </>
          )) || <p>Mode: Browser</p>}
          <p>Build Type: {process.env.NODE_ENV}(V2Note)</p>
          <p>Commit: {process.env.GIT_HASH}</p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
});

AboutDialog.displayName = DialogPrimitive.Root.displayName;

export default AboutDialog;
