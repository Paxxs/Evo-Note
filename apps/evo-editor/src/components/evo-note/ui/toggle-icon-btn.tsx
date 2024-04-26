import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CombineIcon, FileBarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ToggleIconBtnProps {
  value?: boolean; // Optional boolean prop
  onValueChange?: (value: boolean) => void; // Optional function prop
}

export default function ToggleIconBtn({
  value = true, // Default to true, corresponding to "page"
  onValueChange,
}: ToggleIconBtnProps) {
  const stringValue = value ? "page" : "edgeless";

  const [editorMode, setEditorMode] = useState<string>(stringValue);

  // Convert the onValueChange prop to handle string values from Tabs
  const handleValueChange = (value: string) => {
    // Invoke the onValueChange prop with true for "page" and false for "edgeless"
    setEditorMode(value);
    onValueChange?.(value === "page");
  };

  const iconVariants = {
    page: {
      initial: {
        rotate: 0,
        scale: 1,
      },
      clicked: {
        rotate: [0, -10, 0], // Rotate left then back to center
        scale: [1, 1.3, 1],
        transition: { duration: 0.4 },
      },
    },
    edgeless: {
      initial: {
        rotate: 0,
        scale: 1,
      },
      clicked: {
        rotate: [0, 10, 0], // Rotate right then back to center
        scale: [1, 1.3, 1],
        transition: { duration: 0.4 },
      },
    },
  };

  return (
    <Tabs defaultValue={stringValue} onValueChange={handleValueChange}>
      <TabsList>
        <TabsTrigger value="page">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                animate={editorMode === "page" ? "clicked" : "initial"}
                variants={iconVariants.page}
              >
                <FileBarChart2 className="w-4" />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={10} asChild>
              <p>Page Mode</p>
            </TooltipContent>
          </Tooltip>
        </TabsTrigger>
        <TabsTrigger value="edgeless">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                variants={iconVariants.edgeless}
                animate={editorMode === "edgeless" ? "clicked" : "initial"}
              >
                <CombineIcon className="w-4" />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={10} asChild>
              <p>Edgeless Mode</p>
            </TooltipContent>
          </Tooltip>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
