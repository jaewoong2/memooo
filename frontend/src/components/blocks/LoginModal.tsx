"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

const backendurl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://api.bamtoly.com";

type Props = {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean, redirectUrl?: string | null) => void;
  isApply?: boolean;

  title?: React.ReactNode;
  description?: React.ReactNode;
};

const LoginModal = ({
  isOpen = true,
  onOpenChange,
  isApply,
  title,
  description,
}: Props) => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange?.(isOpen, redirectUrl);
  };

  return (
    <Dialog
      modal
      defaultOpen={false}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogContent
        className="max-h-[calc(100%-60px)] overflow-y-auto sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="relative h-[42px]">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div
          className={cn(
            "flex min-h-36 flex-col justify-center gap-4",
            isApply && "min-h-36",
          )}
        >
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-4",
              isApply && "my-4",
            )}
          >
            <Link
              href={`${backendurl}/api/auth/google/login`}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "flex w-full py-3 items-center justify-center gap-4 rounded-full border bg-muted border-black px-3",
                buttonVariants({
                  variant: "secondary",
                  className: "rounded-xl py-3",
                }),
              )}
            >
              <FcGoogle className="h-6 w-6" />
              <span className="text-xs">구글 로그인하기</span>
            </Link>
          </div>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
