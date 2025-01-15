"use client";

import { PlusIcon, CameraIcon, FolderIcon } from "lucide-react";
import React from "react";
import FileCaptureInput from "../atoms/FileCaptureInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserGetMe } from "@/apis/services/user/useUserService";
import { useUploadImageMutation } from "@/apis/services/image/useImageService";
import { useOpenAiImageToText } from "@/apis/services/openai/useOpenAiService";

const FloatingButtons = () => {
  const { data: user } = useUserGetMe();
  const { mutate: upload } = useUploadImageMutation();
  const { mutate: imageToText } = useOpenAiImageToText();
  const router = useRouter();

  const onChangeFile = (file: File | null) => {
    if (!file) return;

    upload(
      { file: file },
      {
        onSuccess(data) {
          imageToText(
            { imageUrl: data.data?.url },
            {
              onSuccess() {
                router.replace(`/images/result?imageUrl=${data.data?.url}`);
              },
            },
          );
        },
      },
    );
  };

  return (
    <div className="h-[65px] sticky bottom-4 w-full z-10 flex justify-center">
      <div className="border border-primary bg-primary-foreground grid items-center grid-cols-3 w-[240px] h-[65px] rounded-[50px_50px] shadow-xl shadow-black/60">
        <Link
          className="w-full h-full flex justify-center items-center col-span-1"
          href={"/habbit"}
        >
          <PlusIcon />
        </Link>
        <div className="w-full h-full flex justify-center items-center col-span-1">
          {!user?.data?.id ? (
            <Link href={"/auth"}>
              <div className="p-0 cursor-pointer shadow-gray-600 hover:opacity-80 transition-opacity shadow-sm text-background h-[50px] rounded-full flex justify-center col-span-1 items-center bg-primary w-auto aspect-square">
                <CameraIcon />
              </div>
            </Link>
          ) : (
            <FileCaptureInput
              type="file"
              capture="environment"
              accept="image/*"
              onFileChange={onChangeFile}
            >
              <div className="p-0 cursor-pointer shadow-gray-600 hover:opacity-80 transition-opacity shadow-sm text-background h-[50px] rounded-full flex justify-center col-span-1 items-center bg-primary w-auto aspect-square">
                <CameraIcon />
              </div>
            </FileCaptureInput>
          )}
        </div>
        <div className="w-full h-full flex justify-center items-center col-span-1">
          {!user?.data?.id ? (
            <Link href={"/auth"}>
              <div className="w-full cursor-pointer br h-full flex justify-center items-center col-span-1">
                <FolderIcon />
              </div>
            </Link>
          ) : (
            <FileCaptureInput
              type="file"
              capture="environment"
              accept="image/*"
              onFileChange={onChangeFile}
              className="w-full h-full"
            >
              <div className="w-full cursor-pointer br h-full flex justify-center items-center col-span-1">
                <FolderIcon />
              </div>
            </FileCaptureInput>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingButtons;
