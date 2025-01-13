"use client";

import React, { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface Props {
  onFileChange: (file: File | null) => void;
  children?: React.ReactNode;
}

const FileCaptureInput = ({
  onFileChange,
  children,
  className,
  ...props
}: PropsWithChildren<Props & JSX.IntrinsicElements["input"]>) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0] || null;

    if (targetFile) {
      onFileChange(targetFile);
    }
  };

  return (
    <label className={className}>
      {children}
      <input
        type="file"
        capture="environment"
        accept="image/*"
        className={cn("hidden")}
        onChange={handleFileChange}
        {...props}
      />
    </label>
  );
};

export default FileCaptureInput;
