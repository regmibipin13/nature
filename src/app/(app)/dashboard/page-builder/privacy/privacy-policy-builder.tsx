"use client";

import { RichTextEditor } from "@/components/text-editor/text-editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PrivacyFormData, privacySchema } from "./schema";

const defaultPrivacy: PrivacyFormData = {
  title: "Privacy Policy",
  content: "<p>Enter your privacy policy content here...</p>",
};

export function PrivacyPolicyBuilder({
  data,
  onSave,
}: {
  data: PrivacyFormData | null;
  onSave?: (data: PrivacyFormData) => Promise<{ success: boolean }>;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<PrivacyFormData>({
    resolver: zodResolver(privacySchema),
    defaultValues: data || defaultPrivacy,
  });

  const onSubmit = async (values: PrivacyFormData) => {
    setLoading(true);
    try {
      if (onSave) {
        const result = await onSave(values);
        if (!result.success) throw new Error("Failed to save");
        toast.success("Privacy Policy saved successfully!");
        return;
      }
    } catch {
      toast.error("Failed to save Privacy Policy");
    } finally {
      setLoading(false);
    }
  };

  const content = form.watch("content");

  return (
    <div className="w-full min-h-screen flex bg-gray-100">
      {/* Left Editor */}
      <aside className="w-1/2 h-screen p-8 bg-white overflow-y-auto flex flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex-1 flex flex-col"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col">
                  <FormLabel>Content</FormLabel>
                  <FormControl className="flex-1">
                    <RichTextEditor
                      value={field.value}
                      onChange={(val) => form.setValue("content", val)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Save Button */}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </aside>

      {/* Right Preview */}
      <main className="w-1/2 h-screen p-8 overflow-y-auto bg-gray-50">
        <div className="prose max-w-full">
          <h1 className="text-3xl font-bold mb-4">{form.getValues("title")}</h1>
          <div
            className="prose  break-words overflow-hidden [&_*]:max-w-full   [&_img]:w-full [&_img]:object-cover"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </main>
    </div>
  );
}
