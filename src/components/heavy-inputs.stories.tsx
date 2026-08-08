import type { Meta, StoryObj } from "@storybook/react";
import {
  FileUpload,
  ImageUpload,
  RichTextEditor,
  CodeEditor,
  MarkdownEditor,
  SignaturePad,
} from "./heavy-inputs";

const meta: Meta = {
  title: "Components/HeavyInputs",
};

export default meta;

export const FileUploadDefault: StoryObj = {
  render: () => <FileUpload onFileSelect={(files) => console.log(files)} />,
};

export const ImageUploadDefault: StoryObj = {
  render: () => <ImageUpload onChange={(url) => console.log(url)} />,
};

export const RichTextEditorDefault: StoryObj = {
  render: () => <RichTextEditor value="Hello <b>world</b>" />,
};

export const CodeEditorDefault: StoryObj = {
  render: () => <CodeEditor value="const x = 42;" />,
};

export const MarkdownEditorDefault: StoryObj = {
  render: () => <MarkdownEditor value="# Heading\nParagraph" />,
};

export const SignaturePadDefault: StoryObj = {
  render: () => <SignaturePad onSave={(data) => console.log(data)} />,
};
