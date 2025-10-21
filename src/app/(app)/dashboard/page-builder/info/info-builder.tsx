"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FileUpload } from "@/components/file-upload";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { InfoData, infoSchema } from "./schema";

export function InfoDisplay({ data }: { data: InfoData }) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: data.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text */}
          <div className="lg:col-span-5">
            <div
              className="prose  break-words overflow-hidden [&_*]:max-w-full   [&_img]:w-full [&_img]:object-cover"
              dangerouslySetInnerHTML={{ __html: data.title }}
            />
            <div
              className="mt-8 prose  break-words overflow-hidden [&_*]:max-w-full   [&_img]:w-full [&_img]:object-cover"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>

          {/* Image Grid (2x2 square) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            {data.image1 && (
              <img
                src={data.image1}
                alt="Image 1"
                className="rounded-xl object-cover w-full aspect-square"
              />
            )}
            {data.image2 && (
              <img
                src={data.image2}
                alt="Image 2"
                className="rounded-xl object-cover w-full aspect-square"
              />
            )}
            {data.image3 && (
              <img
                src={data.image3}
                alt="Image 3"
                className="rounded-xl object-cover w-full aspect-square"
              />
            )}
            {data.image4 && (
              <img
                src={data.image4}
                alt="Image 4"
                className="rounded-xl object-cover w-full aspect-square"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function InfoFormBuilder({
  data,
  onSave,
}: {
  data?: Partial<InfoData>;
  onSave?: (data: InfoData) => Promise<{ success: boolean }>;
}) {
  const [loading, setLoading] = useState(false);

  const defaultData: InfoData = {
    title:
      "Clean, Beyond Reproach <em class='italic font-serif'>Skincare.</em>",
    description:
      "WE LOVE IT FOR MODERN UI DESIGN BECAUSE OF ITS SIMPLE, CLEAN, AND DISTINCTIVE GEOMETRIC STYLE...",
    image1: "/placeholder.png",
    image2: "/placeholder.png",
    backgroundColor: "#ffffff",
    ...data,
  };

  const form = useForm({
    resolver: zodResolver(infoSchema),
    defaultValues: defaultData,
  });

  const onSubmit = async (values: InfoData) => {
    try {
      setLoading(true);
      if (onSave) {
        const { success } = await onSave(values);
        success
          ? toast.success("Section saved successfully")
          : toast.error("Failed to save section");
      }
    } finally {
      setLoading(false);
    }
  };

  const infoData = form.watch();

  return (
    <Tabs defaultValue="editor" className="w-full h-full flex flex-col">
      {/* Header with Save Button + Tab Switcher */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
        <div className="flex items-center gap-2">
          <Edit className="text-gray-600" size={22} />
          <h2 className="text-lg font-semibold">Info Section</h2>
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
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <TabsContent value="editor" className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={() => (
                  <FormItem className="flex-1 flex flex-col">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={infoData.description}
                        onChange={(value) =>
                          form.setValue("description", value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Images */}
              {["image1", "image2", "image3", "image4"].map((name, i) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof InfoData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Image {i + 1}
                        {i > 1 && " (Optional)"}
                      </FormLabel>
                      <FormControl>
                        <FileUpload
                          bucketName="ecom"
                          control={form.control}
                          type="single"
                          value={field.value}
                          name={name as any}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {/* Background */}
              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Color</FormLabel>
                    <FormControl>
                      <Input type="color" className="h-12" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>

        <TabsContent
          value="preview"
          className="h-full w-full flex items-center justify-center bg-gray-50 p-6"
        >
          <div className="w-full max-w-7xl">
            <InfoDisplay data={infoData as InfoData} />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
