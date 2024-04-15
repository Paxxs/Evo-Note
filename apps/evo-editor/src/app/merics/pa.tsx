"use client";

import { useConfig } from "@/hooks/use-config";
import { isWailsEnvironment } from "@/lib/isWailsEnvironment";
import Script from "next/script";

const Plausible = () => {
  const [config] = useConfig();
  return (
    <>
      <Script
        async
        defer
        data-domain={process.env.NEXT_PUBLIC_PA_DOMAIN + "evo.v2note.com"}
        event-wails={isWailsEnvironment()}
        event-commit={process.env.GIT_HASH}
        event-committer={process.env.LAST_GIT_AUTHOR}
        event-repository={process.env.REPOSITORY_URL}
        src={process.env.NEXT_PUBLIC_PLAUSIBLE}
      ></Script>
    </>
  );
};

export default Plausible;
