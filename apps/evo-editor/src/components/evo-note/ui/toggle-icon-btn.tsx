import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CombineIcon, FileBarChart2 } from "lucide-react";

interface ToggleIconBtnProps {
  value?: boolean; // Optional boolean prop
  onValueChange?: (value: boolean) => void; // Optional function prop
}

export default function ToggleIconBtn({
  value = true, // Default to true, corresponding to "page"
  onValueChange,
}: ToggleIconBtnProps) {
  // Convert the boolean value to the string equivalents for the Tabs component
  const stringValue = value ? "page" : "edgeless";

  // Convert the onValueChange prop to handle string values from Tabs
  const handleValueChange = (value: string) => {
    // Invoke the onValueChange prop with true for "page" and false for "edgeless"
    onValueChange?.(value === "page");
  };
  return (
    <Tabs defaultValue={stringValue} onValueChange={handleValueChange}>
      <TabsList>
        <TabsTrigger value="page">
          <Tooltip>
            <TooltipTrigger asChild>
              <FileBarChart2 className="w-4" />
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={10} asChild>
              <p>页面模式</p>
            </TooltipContent>
          </Tooltip>
        </TabsTrigger>
        <TabsTrigger value="edgeless">
          <Tooltip>
            <TooltipTrigger asChild>
              <CombineIcon className="w-4" />
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={10} asChild>
              <p>无边界模式</p>
            </TooltipContent>
          </Tooltip>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
