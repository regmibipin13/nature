"use client";

import dynamic from "next/dynamic";

const EditorComponent = dynamic(() => import("./wang-editor"), {
  ssr: false,
});

interface Props {
  onChange?: (html: string) => void;
  value?: string;
}
export function RichTextEditor({ onChange, value }: Props) {
  return <EditorComponent onChange={onChange} value={value} />;
}
