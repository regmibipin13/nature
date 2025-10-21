"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBrandTelegram,
  IconBrandThreads,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  MailIcon,
  Phone,
  Plus,
  Trash2,
  Twitter,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FooterFormData, footerSchema } from "./schema";

const socialIcons = [
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "twitter", label: "X/Twitter", icon: Twitter },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "github", label: "GitHub", icon: Github },
  { value: "telegram", label: "Telegram", icon: IconBrandTelegram },
  { value: "whatsapp", label: "WhatsApp", icon: IconBrandWhatsapp },
  { value: "email", label: "Email", icon: MailIcon },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "threads", label: "Threads", icon: IconBrandThreads },
];

interface FooterFormProps {
  data: FooterFormData["socialLinks"];
  onsave?: (data: FooterFormData) => Promise<{ success: boolean }>;
}

export function FooterForm({ data, onsave }: FooterFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FooterFormData>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      socialLinks: data.length > 0 ? data : [{ icon: "", url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const onSubmit = async (data: FooterFormData) => {
    if (!onsave) return;
    setIsSaving(true);
    try {
      const { success } = await onsave(data);
      if (success) {
        form.reset(data);
        setIsSaving(false);
        toast.success("Footer saved successfully!");
      } else {
        throw new Error("Failed to save footer");
      }
    } catch (error) {
      console.error(error);
      toast.error("There was an error saving the footer.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Footer Social Media Links</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-end gap-4 p-4 border rounded-lg"
            >
              <FormField
                control={form.control}
                name={`socialLinks.${index}.icon`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Icon</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSaving}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {socialIcons.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <icon.icon className="w-4 h-4" />
                              {icon.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`socialLinks.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1 || isSaving}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ icon: "", url: "" })}
              disabled={isSaving}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Footer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
