"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabaseClient } from "@/lib/supabase/client";
import { Loader2, Plus, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

interface UploadFile {
  uid: string;
  name: string;
  url?: string;
  preview?: string;
  originFileObj?: File;
  status?: "uploading" | "done" | "error";
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type FileUploadType = "single" | "multiple";

interface FileUploadProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  bucketName?: string;
  value?: string | string[];
  type?: FileUploadType;
}

export function FileUpload<T extends FieldValues>(props: FileUploadProps<T>) {
  const {
    name,
    control,
    bucketName = "ecom",
    value,
    type = "multiple",
  } = props;

  const {
    field: { onChange },
  } = useController({ name, control });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync fileList with value prop
  React.useEffect(() => {
    let urls: string[] = [];
    if (type === "single" && typeof value === "string" && value) {
      urls = [value];
    } else if (type === "multiple" && Array.isArray(value)) {
      urls = value;
    }
    if (urls.length > 0) {
      const files = urls.map((url, idx) => ({
        uid: url,
        name: url.split("/").pop() || `image-${idx}`,
        url,
        status: "done" as const,
      }));
      setFileList(files);
    } else {
      setFileList([]);
    }
  }, [value, type]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview || "");
    setPreviewOpen(true);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const uploadingFiles: UploadFile[] = files.map((file) => ({
      uid: `${Date.now()}-${file.name}`,
      name: file.name,
      originFileObj: file,
      status: "uploading",
    }));

    const updatedList: UploadFile[] =
      type === "single"
        ? [uploadingFiles[0]]
        : [...fileList, ...uploadingFiles];

    setFileList(updatedList);

    for (const file of uploadingFiles) {
      try {
        // Upload to local API
        const formData = new FormData();
        formData.append('file', file.originFileObj as File);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        const publicUrl = result.url;

        const preview = await getBase64(file.originFileObj as File);

        setFileList((prev) =>
          prev.map((f) =>
            f.uid === file.uid
              ? {
                  ...f,
                  url: publicUrl,
                  preview,
                  status: "done",
                }
              : f
          )
        );

        if (type === "single") {
          onChange(publicUrl);
        } else {
          const doneUrls = updatedList
            .map((f) =>
              f.uid === file.uid ? { ...f, url: publicUrl, status: "done" } : f
            )
            .filter((f) => f.status === "done")
            .map((f) => f.url);
          onChange(doneUrls);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setFileList((prev) =>
          prev.map((f) => (f.uid === file.uid ? { ...f, status: "error" } : f))
        );
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (uid: string) => {
    const updatedList = fileList.filter((file) => file.uid !== uid);
    setFileList(updatedList);
    if (type === "single") {
      onChange(updatedList[0]?.url ?? "");
    } else {
      onChange(updatedList.map((f) => f.url));
    }
  };

  const uploadButton = (
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
    >
      <Plus className="w-6 h-6 text-gray-400 mb-2" />
      <div className="text-sm text-gray-600">Upload</div>
    </button>
  );

  return (
    <>
      <div
        className={` ${type === "multiple" ? "grid grid-cols-4 gap-4" : ""}`}
      >
        {fileList.map((file) => (
          <div key={file.uid} className="relative group">
            <div
              className={`aspect-square border rounded-lg overflow-hidden bg-gray-50 relative ${
                type === "single" ? "w-44 h-44" : ""
              }`}
            >
              {file.status === "uploading" && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                </div>
              )}

              {file.url || file.preview ? (
                <img
                  src={file.url || file.preview}
                  alt={file.name}
                  className={`object-cover cursor-pointer w-full h-full ${
                    type === "single" ? "w-44 h-44" : ""
                  }`}
                  onClick={() => handlePreview(file)}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                  {file.name}
                </div>
              )}

              <button
                type="button"
                onClick={() => handleRemove(file.uid)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {(type === "multiple" && fileList.length < 8) ||
        (type === "single" && fileList.length === 0) ? (
          <div className="">{uploadButton}</div>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={type === "multiple"}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[60vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
