"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

import { ContactPreview } from "@/components/contact-preview";
import { ContactPageForm, contactSchema } from "./schema";

export function ContactPageBuilder({
  data,
  onSave,
}: {
  data?: Partial<ContactPageForm>;
  onSave?: (data: ContactPageForm) => Promise<{ success: boolean }>;
}) {
  const [loading, setLoading] = useState(false);

  const defaultValues: ContactPageForm = {
    title: "Get in touch",
    description:
      "Proin volutpat consequat porttitor cras nullam gravida at. Orci molestie a eu arcu. Sed ut tincidunt integer elementum id sem. Arcu sed malesuada et magna.",
    recipientEmail: "hello@example.com",
    contactInfo: [
      { type: "address", value: "545 Mavis Island, Chicago, IL 99191" },
      { type: "phone", value: "+1 (555) 234-5678" },
      { type: "email", value: "hello@example.com" },
    ],
    formFields: [
      { label: "First name", type: "text" },
      { label: "Last name", type: "text" },
      { label: "Email", type: "email" },
      { label: "Phone number", type: "tel" },
      { label: "Message", type: "textarea" },
    ],
    ...data,
  };

  const form = useForm<ContactPageForm>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  const { control, watch } = form;

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({ control, name: "contactInfo" });

  const {
    fields: formFieldFields,
    append: appendField,
    remove: removeField,
  } = useFieldArray({ control, name: "formFields" });

  const values = watch();

  const onSubmit = async (values: ContactPageForm) => {
    try {
      setLoading(true);
      if (onSave) {
        const { success } = await onSave(values);
        if (success) {
          toast.success("Contact page saved successfully");
        } else {
          toast.error("Failed to save contact page");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col">
      <Tabs defaultValue="form" className="w-full flex-1 flex flex-col">
        {/* Top bar with tabs + save */}
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

        {/* Form tab */}
        <TabsContent value="form" className="flex-1 overflow-y-auto px-8 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Recipient Email */}
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
                {contactFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 p-2 border rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`contactInfo.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="address">Address</SelectItem>
                                <SelectItem value="phone">Phone</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`contactInfo.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeContact(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => appendContact({ type: "address", value: "" })}
                >
                  Add Contact Item
                </Button>
              </div>

              {/* Form Fields */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Form Fields</h3>
                {formFieldFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 p-2 border rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`formFields.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Label" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`formFields.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="tel">Phone</SelectItem>
                                <SelectItem value="textarea">
                                  Textarea
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendField({ label: "New Field", type: "text" })
                  }
                >
                  Add Form Field
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        {/* Preview tab */}
        <TabsContent
          value="preview"
          className="flex-1 overflow-auto bg-gray-50"
        >
          <ContactPreview data={values} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
