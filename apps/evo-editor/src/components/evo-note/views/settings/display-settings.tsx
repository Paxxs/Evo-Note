"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import logger from "@/lib/logger";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

// const themeNames = themes.map((theme) => theme.name) as Theme["name"][];

// Create a union type from the theme names
// const themeNames = themes.map((theme) => theme.name);
const formSchema = z.object({
  //   style: z.string({
  //     required_error: "Style is required",
  //   }),
  //   color: z.enum(themeNames as [string, ...string[]], {
  //     required_error: "Color is required",
  //   }),
  radius: z.string({
    required_error: "Radius is required",
  }),
  mode: z.string({
    required_error: "Mode is required",
  }),
  translucent: z.boolean({
    required_error: "Translucent is required",
  }),
});

export default function DisplaySettings() {
  const {
    setTheme: setMode,
    resolvedTheme: mode,
    themes: nextThemes,
  } = useTheme();
  const [config, setConfig] = useConfig();
  const [isSubmit, setIsSubmit] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //   color: config.theme,
      radius: formatNumber(config.radius),
      mode: mode,
      translucent: config.translucent,
    },
  });

  function formatNumber(num: number): string {
    const intPart = Math.floor(num);
    if (num === intPart) {
      // 数字是整数，无需保留小数
      return num.toString();
    }

    const twoDecimals = Math.round(num * 100) / 100;
    const oneDecimal = Math.round(num * 10) / 10;

    if (twoDecimals === oneDecimal) {
      // 如果两位小数和一位小数的值相同，说明第二位小数是0
      return oneDecimal.toString();
    } else {
      // 保留两位小数
      return twoDecimals.toFixed(2);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // let color: Theme["name"] = values.color as Theme["name"];
    let radius = parseFloat(values.radius);
    logger.debug(
      "Display Settings onSubmit values:",
      values,
      //   color,
      radius,
      nextThemes,
    );

    setConfig({
      ...config,
      radius: radius,
      translucent: values.translucent,
    });
    setMode(values.mode);
    setIsSubmit(true);
    setTimeout(() => {
      setIsSubmit(false);
    }, 1000);
    toast.info("😀 Settings saved!", {
      position: "top-center",
      description: `The radius is set to ${radius} and the theme is set to ${values.mode}. Translucent mode is ${values.translucent ? "enabled" : "disabled"}.`,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-2">
        {/* <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((theme) => {
                    const isActive = field.value === theme.name;
                    return (
                      <span
                        key={theme.name}
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "sm",
                          }),
                          "justify-start",
                          isActive && "border-2 border-primary",
                        )}
                        onClick={() => {
                          field.onChange(theme.name);
                        }}
                        style={
                          {
                            "--theme-primary": `hsl(${
                              theme?.activeColor[
                                mode === "dark" ? "dark" : "light"
                              ]
                            })`,
                          } as React.CSSProperties
                        }
                      >
                        <span
                          className={cn(
                            "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]",
                          )}
                        >
                          {isActive && (
                            <CheckIcon className="h-3 w-3 text-white" />
                          )}
                        </span>
                        {theme.label}
                      </span>
                    );
                  })}
                </div>
              </FormControl>
              <FormDescription>
                Customize the accent color of the editor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="radius"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-start justify-between space-x-3 space-y-0 pt-1">
                <FormLabel>Radius</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-2/5">
                      <SelectValue placeholder="Select a radius" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["0", "0.3", "0.5", "0.75", "1"].map((value) => {
                      return (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <FormDescription>
                Customize the corner radius of the editor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-start justify-between space-x-3 space-y-0">
                <FormLabel>Visual Flavor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-2/5">
                      <SelectValue placeholder="Select a radius" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {nextThemes.map((value) => {
                      return (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <FormDescription>
                Adjust the visual style of your application to match your
                preference or system settings.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="translucent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Enable Translucent Effect</FormLabel>
                <FormDescription>
                  Lowers the window transparency to show beautiful acrylic blur
                  effect (App mode).
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">{isSubmit ? "😀 Saved!" : "Submit"}</Button>
      </form>
    </Form>
  );
}
