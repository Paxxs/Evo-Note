import React from "react";

export default function Layout({
  settings,
  children,
}: {
  settings: React.ReactNode;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex h-dvh w-dvw">
      {settings}
      {children}
    </div>
  );
}
