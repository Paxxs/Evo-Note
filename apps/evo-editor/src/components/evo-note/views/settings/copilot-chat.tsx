import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useConfig } from "@/hooks/use-config";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  copilotUrl: z
    .string({
      required_error: "Copilot URL is required",
    })
    .url({
      message: "Copilot URL is invalid",
    }),
});

export default function CopilotSettings() {
  const [config, setConfig] = useConfig();
  const [isSubmit, setIsSubmit] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      copilotUrl: config.copilotUrl,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setConfig({
      ...config,
      copilotUrl: values.copilotUrl,
    });
    console.log("copilotUrl", values);

    setIsSubmit(true);
    setTimeout(() => {
      setIsSubmit(false);
    }, 1000);
  }

  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center pt-8">
        🤖 Copilot is currently under development.
      </h3>
      <br />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-2">
          <FormField
            control={form.control}
            name="copilotUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Copilot Backend</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." onChange={field.onChange} />
                </FormControl>
                <FormDescription>Setting Copilot Backend.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{isSubmit ? "😀 Saved!" : "Submit"}</Button>
        </form>
      </Form>
    </>
  );
}
