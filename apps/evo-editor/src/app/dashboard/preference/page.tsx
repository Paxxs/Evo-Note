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
      <Tabs defaultValue="display" orientation="vertical" asChild>
        <div className="flex-1 w-full items-start px-9 py-0 overflow-auto md:max-w-3xl md:mx-auto">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="color">Color</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="ai">Copilot</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <div className="my-4">
            <TabsContent value="display">
              <DisplaySettings />
            </TabsContent>
            <TabsContent value="color">
              <ColorSettings />
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
          </div>
        </div>
      </Tabs>
    </>
  );
}
