"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CollectionFormValues, collectionSchema } from "./schema";

export function CollectionForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<CollectionFormValues>;
  onSubmit: (
    values: CollectionFormValues
  ) => Promise<{ success: boolean; message: string }>;
}) {
  const form = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      id: "",
      name: "",
      slug: "",
      description: "",
      active: false,
      imageUrl: "",
      metaTitle: "",
      metaDescription: "",
      featured: false,
      ...defaultValues,
    },
  });

  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");

  useEffect(() => {
    if (nameValue && !slugValue && nameValue.length > 5) {
      form.setValue("slug", `${slugify(nameValue)}`);
    }
  }, [nameValue]);

  const router = useRouter();

  async function handleSubmit(values: CollectionFormValues) {
    if (!values.slug && values.name) {
      values.slug = `${slugify(values.name)}`;
    }

    try {
      const res = await onSubmit(values);
      if (res.success) {
        toast.success(res.message || "Collection saved successfully");
        router.push("/dashboard/collections");
      } else {
        toast.error(res.message || "Failed to save collection");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error submitting form:", error);
    }
  }

  const isEdit = Boolean(defaultValues?.id);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-8">
        {isEdit ? "Edit Collection" : "Create Collection"}
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-1 gap-8"
        >
          <input type="hidden" {...form.register("id")} />

          {/* General Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b pb-2">General</h2>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Collection name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug + Active */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="auto-generated if empty" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
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

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Provide a detailed description of this collection (max 500 characters)..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* SEO Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b pb-2">SEO</h2>

            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={60}
                      placeholder="Best Collection for Products..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/60 characters
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      maxLength={160}
                      placeholder="Short description that will show up in search results..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/160 characters
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className=" rounded-lg border p-3">
                  <div className="space-y-0.5 flex items-center justify-between">
                    <FormLabel>Is Featured</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  <div>
                    <FormDescription>
                      Mark this collection as featured to highlight it on the
                      homepage.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Image Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b pb-2">Image</h2>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value || ""}
                      control={form.control}
                      name="imageUrl"
                      type="single"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full"
            >
              {/* {isEdit ? "Update Collection" : "Save Collection"} */}
              {form.formState.isSubmitting
                ? "Saving..."
                : isEdit
                ? "Update Collection"
                : "Save Collection"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
