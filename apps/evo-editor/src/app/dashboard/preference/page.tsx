"use client";
import About from "@/components/evo-note/views/settings/about";
import ColorSettings from "@/components/evo-note/views/settings/color-settings";
import DisplaySettings from "@/components/evo-note/views/settings/display-settings";
import NoteSettings from "@/components/evo-note/views/settings/note-settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage(): JSX.Element {
  return (
    <>
      <div className="w-full">
        <Tabs defaultValue="color" orientation="vertical" className="">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="color">Color</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="ai">Copilot</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[60dvh]">
            <TabsContent value="color">
              <ColorSettings />
            </TabsContent>
            <TabsContent value="display">
              <DisplaySettings />
            </TabsContent>
            <TabsContent value="notes">
              <NoteSettings />
            </TabsContent>
            <TabsContent value="ai">
              <div>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center pt-8">
                  🤖 Copilot Settings not available.
                </h3>
              </div>
            </TabsContent>
            <TabsContent value="about">
              <About />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </>
  );
}
