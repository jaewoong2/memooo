"use client";
import { useGetAiResponse } from "@/apis/services/openai/useOpenAiService";
import AiResponseForm from "@/components/blocks/AiResponseForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const ImageResultPage = () => {
  const { back } = useRouter();
  const [open, setOpen] = useState(true);

  const handleChangeOpen = (isOpen: boolean) => {
    if (!isOpen) {
      back();
    }
    setOpen(isOpen);
  };

  const imageUrl = useSearchParams().get("imageUrl");

  return (
    <Dialog open={open} onOpenChange={handleChangeOpen}>
      <DialogContent className="overflow-y-scroll flex md:h-[80%] w-full flex-col max-md:top-[10%] max-md:translate-y-0 max-md:rounded-t-3xl max-md:h-[90%]">
        <DialogHeader>
          <DialogTitle className="w-full flex justify-start">
            습관 인증하기
          </DialogTitle>
        </DialogHeader>
        <div className="relative h-full w-full mb-20">
          <div className="h-[300px] relative w-auto">
            <Image
              src={imageUrl ?? ""}
              alt="image"
              fill
              className="object-contain"
            />
          </div>
          {imageUrl && <AiResponseForm imageUrl={imageUrl} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageResultPage;
