"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage(): JSX.Element {
  return (
    <>
      <div className="w-full">
        <Tabs
          defaultValue="editor"
          orientation="vertical"
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="display">界面设置</TabsTrigger>
            <TabsTrigger value="editor">笔记设置</TabsTrigger>
            <TabsTrigger value="about">关于</TabsTrigger>
          </TabsList>
          <TabsContent value="display">
            <div>sdfasdf</div>
          </TabsContent>
          <TabsContent value="editor">
            <div>fggggg</div>
          </TabsContent>
          <TabsContent value="about">
            <div>3eeee</div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
