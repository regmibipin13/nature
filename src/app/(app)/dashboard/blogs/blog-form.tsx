"use client";

import { FileUpload } from "@/components/file-upload";
import { RichTextEditor } from "@/components/text-editor/text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputTags } from "@/components/ui/input-tags";
import { MultiSelect } from "@/components/ui/mult-select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAlertDialog } from "@/hooks/alert-dialog/use-alert-dialog";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  FileText,
  FolderOpen,
  ImageIcon,
  Save,
  Send,
  Settings,
  Tag,
  Trash,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BlogFormValues, blogSchema } from "./blog.schema";

const supabase = createClient();

export function BlogForm() {
  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      categories: [],
      tags: [],
      featuredImage: "",
      status: "draft",
      metaDescription: "",
      slug: "",
      visibility: "public",
    },
  });

  const [showPreview, setShowPreview] = React.useState(false);
  const [loading, setLoading] = React.useState<{
    draft: boolean;
    publish: boolean;
  }>({
    draft: false,
    publish: false,
  });

  const availableCategories = [
    "Cold-Pressed Oils",
    "Recipes & Cooking Ideas",
    "Health & Nutrition",
    "Skin & Hair Care",
    "Behind the Brand",
    "Sustainability & Lifestyle",
    "Product Update & News",
  ];

  const { id } = useParams();
  const router = useRouter();

  const onSubmit = async (data: BlogFormValues) => {
    const isDraft = data.status === "draft";
    setLoading((prev) => ({ ...prev, [isDraft ? "draft" : "publish"]: true }));
    try {
      const { error } = await supabase.from("Blog").upsert({
        id: id || undefined,
        ...data,
      });
      if (error) {
        toast.error(`Error saving post: ${error.message}`);
      } else {
        toast.success(`Post saved as ${data.status}`);
        router.push("/dashboard/blogs");
      }
    } finally {
      setLoading((prev) => ({
        ...prev,
        [isDraft ? "draft" : "publish"]: false,
      }));
    }
  };

  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .trim() // remove leading/trailing spaces first
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-") // replace spaces with single dash
      .replace(/-+/g, "-"); // collapse multiple dashes

    // append random string to ensure uniqueness
    const randomString = Math.random().toString(36).substring(2, 6);
    return `${slug}-${randomString}`;
  };

  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);

  const title = form.watch("title");

  // Auto-generate slug whenever title changes (unless user edited slug)
  React.useEffect(() => {
    if (title) {
      form.setValue("slug", generateSlug(title), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [title, slugManuallyEdited, form]);

  // Detect manual slug edits
  React.useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === "slug") {
        setSlugManuallyEdited(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    async function fetchBlog() {
      if (!id) return;
      const { data, error } = await supabase
        .from("Blog")
        .select("*")
        .eq("id", id)
        .single();
      if (data && !error) {
        form.reset({
          title: data.title || "",
          content: data.content || "",
          excerpt: data.excerpt || "",
          categories: data.categories || [],
          tags: data.tags || [],
          featuredImage: data.featuredImage || "",
          status: data.status || "draft",
          metaDescription: data.metaDescription || "",
          visibility: data.visibility || "public",
          slug: data.slug || generateSlug(data.title || ""),
          metaTitle: data.metaTitle || "",
        });
      }
    }
    fetchBlog();
  }, [form, id]);

  const { openDialog } = useAlertDialog();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        <div className="min-h-screen bg-white">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-brand-primary">
                    {id ? "Edit Post" : "Create New Post"}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Write and publish your blog post
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="w-full sm:w-auto"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    form.setValue("status", "draft");
                    form.handleSubmit(onSubmit)();
                  }}
                  type="button"
                  className="w-full sm:w-auto border-gray-300"
                  disabled={loading.draft}
                >
                  {loading.draft ? (
                    <span className="mr-2 animate-spin">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    </span>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Draft
                </Button>
                <Button
                  onClick={() => {
                    form.setValue("status", "published");
                    form.handleSubmit(onSubmit)();
                  }}
                  type="button"
                  disabled={loading.publish}
                  className="w-full sm:w-auto"
                >
                  {loading.publish ? (
                    <span className="mr-2 animate-spin">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    </span>
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Publish
                </Button>
                {id && (
                  <Button
                    variant="destructive"
                    onClick={() =>
                      openDialog({
                        title: `Delete "${form.getValues("title")}"`,
                        description: "Deleting this blog post is irreversible.",
                        onConfirm: async () => {
                          const deleted = await supabase
                            .from("Blog")
                            .delete()
                            .eq("id", id)
                            .select()
                            .single();
                          if (deleted.data && !deleted.error) {
                            toast.success("Blog post deleted");
                            router.push("/dashboard/blogs");
                          } else {
                            toast.error(
                              `Error deleting post: ${deleted.error?.message}`
                            );
                          }
                        },
                      })
                    }
                    type="button"
                    className="w-full sm:w-auto border-gray-300"
                    disabled={loading.draft}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete Post
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 min-h-screen">
            {/* Main Content */}
            <div className="w-full lg:flex-1 space-y-4 sm:space-y-6  min-w-xs">
              {/* Title */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="flex-1 flex flex-col">
                        <FormControl>
                          <Input
                            placeholder="Add title"
                            {...field}
                            className="max-w-2xl !text-2xl sm:!text-3xl font-bold border-none p-0 focus-visible:ring-0 placeholder:text-gray-400 h-auto leading-tight text-brand-primary break-words whitespace-normal"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem className="flex-1 flex flex-col mt-4">
                        <FormLabel className="text-sm text-gray-600">
                          Permalink / Slug
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="post-slug"
                            {...field}
                            className="border-none max-w-2xl p-0 focus-visible:ring-0 text-blue-600 break-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              {/* Content Editor */}
              <Card>
                <CardContent className="p-4 sm:p-6">
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
                </CardContent>
              </Card>
              {/* Excerpt */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <FileText className="w-5 h-5 mr-2" />
                    Excerpt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Write an excerpt..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-2">
                          Excerpts are optional hand-crafted summaries of your
                          content.
                        </p>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-4 sm:space-y-6 lg:sticky lg:top-24">
              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Featured Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            bucketName="ecom"
                            control={form.control}
                            type="single"
                            value={field.value}
                            name="featuredImage"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <FolderOpen className="w-5 h-5 mr-2" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <MultiSelect
                          options={availableCategories.map((c) => ({
                            label: c,
                            value: c,
                          }))}
                          placeholder="Select categories..."
                          {...field}
                          onChange={field.onChange}
                          value={field.value || []}
                        />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Tag className="w-5 h-5 mr-2" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <InputTags
                          placeholder="Type and press enter to add tags"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* SEO */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Settings className="w-5 h-5 mr-2" />
                    SEO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Meta Title</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a meta title..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between items-center mt-1">
                          <span
                            className={`text-xs ${
                              (field.value?.length || 0) > 60
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            {field.value?.length || 0}/60
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Meta Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a meta description..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex justify-between items-center mt-1">
                          <span
                            className={`text-xs ${
                              (field.value?.length || 0) > 160
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                          >
                            {field.value?.length || 0}/160
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Preview Dialog */}
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="w-full sm:min-w-[90%] md:min-w-[70%] max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Preview</DialogTitle>
                <DialogClose />
              </DialogHeader>
              <div className="p-4 sm:p-6">
                {form.watch("featuredImage") && (
                  <img
                    src={
                      form.watch("featuredImage") ||
                      "/placeholder.svg?height=256&width=1024"
                    }
                    alt="Featured"
                    className="w-full h-48 sm:h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {form.watch("categories").map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 break-words max-w-3xl">
                  {form.watch("title") || "Untitled Post"}
                </h1>
                {form.watch("excerpt") && (
                  <p className="text-base sm:text-lg text-gray-600 mb-6 italic">
                    {form.watch("excerpt")}
                  </p>
                )}
                <Separator className="mb-6" />
                <div className="prose max-w-none text-sm sm:text-base">
                  <div
                    className="prose max-w-3xl  break-words overflow-hidden [&_*]:max-w-full   [&_img]:w-full [&_img]:object-cover"
                    dangerouslySetInnerHTML={{
                      __html: form.watch("content") || "<p>No content</p>",
                    }}
                  />
                </div>
                {(form.watch("tags") || []).length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Tags:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(form.watch("tags") || []).map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </Form>
  );
}
