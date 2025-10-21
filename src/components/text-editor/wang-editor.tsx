"use client";

import {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
  i18nChangeLanguage,
} from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import "@wangeditor/editor/dist/css/style.css";

import React, { useEffect, useState } from "react";

interface Props {
  value?: string;
  onChange?: (html: string) => void;
}

const RichTextEditor: React.FC<Props> = ({ value = "", onChange }) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState<string>(value);

  useEffect(() => {
    setHtml(value);
  }, [value]);

  const toolbarConfig: Partial<IToolbarConfig> = {};

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "Type here...",
    onChange(editor: IDomEditor) {
      const html = editor.getHtml();
      setHtml(html);
      onChange?.(html);
    },
    MENU_CONF: {
      uploadImage: {
        async customUpload(file: File, insertFn: (url: string) => void) {
          try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error('Upload failed');
            }

            const result = await response.json();
            const publicUrl = result.url;
            
            if (publicUrl) {
              insertFn(publicUrl);
            } else {
              console.error("Failed to retrieve public URL");
            }
          } catch (error) {
            console.error("Upload error:", error);
          }
        },
      },
      uploadVideo: {
        async customUpload(file: File, insertFn: (url: string) => void) {
          try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error('Upload failed');
            }

            const result = await response.json();
            const publicUrl = result.url;
            
            if (publicUrl) {
              insertFn(publicUrl);
            } else {
              console.error("Failed to retrieve public URL");
            }
          } catch (error) {
            console.error("Upload error:", error);
          }
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  useEffect(() => {
    i18nChangeLanguage("en");
  }, []);

  return (
    <div className="border border-gray-300 rounded-md">
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: "1px solid #ccc" }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        mode="default"
        style={{ height: "300px", overflowY: "auto", padding: "10px" }}
      />
    </div>
  );
};

export default RichTextEditor;
