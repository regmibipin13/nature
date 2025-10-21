"use client";

import { ContactPageForm } from "@/app/(app)/dashboard/page-builder/contact/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import * as React from "react";
import { useState } from "react";

const getIcon = (type: "address" | "phone" | "email") => {
  switch (type) {
    case "address":
      return <MapPin className="h-5 w-5 text-gray-500" />;
    case "phone":
      return <Phone className="h-5 w-5 text-gray-500" />;
    case "email":
      return <Mail className="h-5 w-5 text-gray-500" />;
    default:
      return null;
  }
};

export const ContactPreview: React.FC<{ data: ContactPageForm }> = ({
  data,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = () => {
    const subject = `New Message from ${formData.firstName || "your website"}`;
    const body = data.formFields
      .map((field) => `${field.label}: ${formData[field.label] || ""}`)
      .join("\n");

    const mailtoLink = `mailto:${
      data.recipientEmail
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  // ✅ Light background with subtle gray grid
  const backgroundStyle = {
    backgroundSize: "40px 40px",
    backgroundColor: "#ffffff",
    backgroundImage:
      "linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), " +
      "linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
  };

  return (
    <Card
      className="w-full max-w-7xl p-8 md:p-12 border-gray-200 shadow-xl"
      style={backgroundStyle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="flex flex-col justify-center space-y-6 text-gray-900">
          <h1 className="text-4xl md:text-5xl font-bold">{data.title}</h1>
          <p className="text-gray-600 leading-relaxed">{data.description}</p>
          <div className="space-y-4">
            {data.contactInfo.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                {getIcon(item.type)}
                <span className="text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.formFields
                .filter((f) => f.type !== "textarea")
                .map((field, idx) => (
                  <div
                    key={idx}
                    className={
                      field.label === "First name" ||
                      field.label === "Last name"
                        ? ""
                        : "sm:col-span-2"
                    }
                  >
                    <Label
                      htmlFor={field.label}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {field.label}
                    </Label>
                    <Input
                      type={field.type}
                      id={field.label}
                      name={field.label}
                      onChange={handleInputChange}
                      className="bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                ))}
            </div>

            {data.formFields
              .filter((f) => f.type === "textarea")
              .map((field, idx) => (
                <div key={idx}>
                  <Label
                    htmlFor={field.label}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {field.label}
                  </Label>
                  <Textarea
                    id={field.label}
                    name={field.label}
                    rows={5}
                    onChange={handleInputChange}
                    className="bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              ))}

            <Button
              type="button"
              onClick={handleSendEmail}
              className="w-full bg-brand hover:bg-brand/90 text-black font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Send message
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
};
