"use client";

import { getEmbedUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { herobuilderSchema, HeroData } from "./schema";

function HeroDisplay({ data }: { data: HeroData }) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: data.backgroundColor }}
    >
      <div className="mx-auto grid md:grid-cols-2 items-center">
        <div className="px-10 space-y-6 ">
          <div
            className="prose  break-words overflow-hidden [&_*]:max-w-full   [&_img]:w-full [&_img]:object-cover"
            dangerouslySetInnerHTML={{ __html: data.title }}
          />
          <div
            className="prose  break-words overflow-hidden [&_*]:max-w-full   [&_img]:w-full [&_img]:object-cover"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
          <a
            href="#"
            className="inline-flex items-center bg-black text-white rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider
                       transform transition-transform duration-200 hover:scale-105 hover:bg-gray-800"
          >
            {data.buttonText}
            <span className="ml-2 inline-flex justify-center items-center w-6 h-6 bg-white text-black rounded-full">
              →
            </span>
          </a>
        </div>

        {/* Right */}
        <div className="w-full h-full flex items-center justify-center">
          {data.mediaType === "image" && data.imageUrl && (
            <img
              src={data.imageUrl}
              alt="Hero"
              className="w-full object-cover md:object-contain h-full"
              width={1200}
              height={800}
            />
          )}
          {data.mediaType === "video" && data.videoUrl && (
            <div className="aspect-video w-full">
              <iframe
                src={getEmbedUrl(data.videoUrl)}
                title="Hero Video"
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function HeroFormBuilder({
  data,
  onSave,
}: {
  data?: Partial<HeroData>;
  onSave?: (data: HeroData) => Promise<{ success: boolean }>;
}) {
  const [loading, setLoading] = useState(false);

  const defaultHero: HeroData = {
    title: "True to Oneself, kind to Nature.",
    description:
      "UNRESERVEDLY HONEST PRODUCTS THAT TRULY WORK, AND BE KIND TO SKIN AND THE PLANET – NO EXCEPTIONS!",
    buttonText: "EXPLORE ALL PRODUCTS",
    mediaType: "image",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    videoUrl: "",
    backgroundColor: "#ffffff",
    ...data,
  };

  const form = useForm<HeroData>({
    resolver: zodResolver(herobuilderSchema),
    defaultValues: defaultHero,
  });

  const onSubmit = async (values: HeroData) => {
    try {
      setLoading(true);
      if (onSave) {
        const { success } = await onSave(values);
        if (success) {
          toast.success("Hero saved successfully");
        } else {
          toast.error("Failed to save hero");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const heroData = form.watch();

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col">
      <Tabs defaultValue="form" className="w-full flex-1 flex flex-col">
        {/* Tabs header */}
        <div className="border-b bg-white px-6 py-3 flex items-center justify-end gap-2">
          <TabsList>
            <TabsTrigger value="form">Form</TabsTrigger>
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

        {/* Tabs content */}
        <TabsContent value="form" className="flex-1 overflow-y-auto px-8 py-6">
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
                        onChange={(value) => field.onChange(value)}
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
                        value={heroData.description}
                        onChange={(value) =>
                          form.setValue("description", value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Button Text */}
              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Media Tabs */}
              <FormField
                control={form.control}
                name="mediaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media</FormLabel>
                    <FormControl>
                      <Tabs
                        value={field.value}
                        onValueChange={(v) => {
                          field.onChange(v);
                          if (v === "image") {
                            form.setValue("videoUrl", undefined);
                          } else {
                            form.setValue("imageUrl", undefined);
                          }
                        }}
                      >
                        <TabsList className="grid grid-cols-2 mb-2">
                          <TabsTrigger value="image">Image</TabsTrigger>
                          <TabsTrigger value="video">Video</TabsTrigger>
                        </TabsList>

                        <TabsContent value="image">
                          <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Upload Image</FormLabel>
                                <FormControl>
                                  <FileUpload
                                    bucketName="ecom"
                                    control={form.control}
                                    type="single"
                                    value={field.value}
                                    name="imageUrl"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabsContent>

                        <TabsContent value="video">
                          <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>YouTube/Vimeo URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://youtube.com/embed/xyz"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                      </Tabs>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Background Color */}
              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Color</FormLabel>
                    <FormControl>
                      <Input type="color" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </TabsContent>

        <TabsContent
          value="preview"
          className="flex-1 overflow-auto bg-gray-50"
        >
          <HeroDisplay data={heroData as any} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
