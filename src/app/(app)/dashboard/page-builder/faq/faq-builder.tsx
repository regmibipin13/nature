"use client";

import { FileUpload } from "@/components/file-upload";
import { RichTextEditor } from "@/components/text-editor/text-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FAQFormData, FAQSchema } from "./schema";

const defaultFAQ: FAQFormData = {
  headline: "",
  imageUrl: "/hero.webp",
  accordionItems: [
    { title: "First question", content: "Answer for the first question." },
    { title: "Second question", content: "Answer for the second question." },
  ],
};

export function FAQBuilderForm({
  data,
  onsave,
}: {
  data?: FAQFormData | null;
  onsave?: (data: FAQFormData) => Promise<{ success: boolean }>;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FAQFormData>({
    resolver: zodResolver(FAQSchema),
    defaultValues: data ?? defaultFAQ,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "accordionItems",
  });

  const saveFaq = async (values: FAQFormData) => {
    setLoading(true);
    try {
      if (onsave) {
        const save = await onsave(values);
        if (save.success) toast.success("Successfully saved");
        else throw new Error("Failed to save FAQ");
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast.error("Error saving FAQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="editor" className="w-full h-full flex flex-col">
      {/* Header with Tabs + Save */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
        <div className="flex items-center gap-2">
          <Edit className="text-gray-600" size={22} />
          <h2 className="text-lg font-semibold">FAQ Section</h2>
        </div>
        <div className="flex items-center gap-4">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <Button
            type="submit"
            size="sm"
            className="bg-black text-white hover:bg-gray-800"
            onClick={form.handleSubmit(saveFaq)}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Save FAQ"}
          </Button>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-auto">
        {/* Editor Tab */}
        <TabsContent value="editor" className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(saveFaq)} className="space-y-6">
              {/* Headline */}
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        bucketName="ecom"
                        type="single"
                        control={form.control}
                        name="imageUrl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Accordion Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">FAQ Items</h3>
                  <Button
                    type="button"
                    onClick={() =>
                      append({
                        title: "New Question",
                        content: "Answer for the new question.",
                      })
                    }
                  >
                    Add Item
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-md relative space-y-4"
                  >
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>

                    <FormField
                      control={form.control}
                      name={`accordionItems.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item {index + 1} Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`accordionItems.${index}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item {index + 1} Content</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </form>
          </Form>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent
          value="preview"
          className="h-full w-full flex items-center justify-center bg-gray-50 p-6"
        >
          <div className="w-full max-w-5xl">
            <FAQSectionDisplay data={form.watch()} />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

interface FAQSectionDisplayProps {
  data: FAQFormData;
}

function FAQSectionDisplay({ data }: FAQSectionDisplayProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="overflow-hidden w-full rounded-lg">
          <img
            src={data.imageUrl === "" ? "/hero.webp" : data.imageUrl}
            alt="FAQ Image"
            width={1200}
            height={800}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <div
            className="prose break-words overflow-hidden [&_*]:max-w-full   [&_img]:w-full [&_img]:object-cover"
            dangerouslySetInnerHTML={{ __html: data.headline }}
          />

          <Accordion type="multiple" className="space-y-2">
            {data.accordionItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>
                  <p>{item.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
