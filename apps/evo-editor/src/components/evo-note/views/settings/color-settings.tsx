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
import { themes, Theme } from "@/registry/themes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useConfig } from "@/hooks/use-config";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

const themeNames = themes.map((theme) => theme.name);
const formSchema = z.object({
  color: z.enum(themeNames as [string, ...string[]], {
    required_error: "Color is required",
  }),
  navDarkAccent: z.boolean({
    required_error: "Navigation dark accent is required",
  }),
});
export default function ColorSettings() {
  const { resolvedTheme: mode } = useTheme();
  const [config, setConfig] = useConfig();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: config.theme,
      navDarkAccent: config.navDarkAccent,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let color: Theme["name"] = values.color as Theme["name"];
    setConfig({
      ...config,
      theme: color,
      navDarkAccent: values.navDarkAccent,
    });
    toast.info("😀 Settings saved!", {
      duration: 15 * 1000,
      description: `Color set to ${color}. ${values.navDarkAccent && "Navigation bar theme accent applied in dark mode."}}`,
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 px-2"
      >
        <div>
          <h3 className="mb-4 text-lg font-medium">Interface Color Settings</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Theme</FormLabel>
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
                    Set the application&apos;s color scheme.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="navDarkAccent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Use Theme Accent in Dark Mode</FormLabel>
                    <FormDescription>
                      Applies the theme color to the sidebar in dark mode.
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
          </div>
        </div>
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
