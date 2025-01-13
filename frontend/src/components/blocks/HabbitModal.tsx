"use client";

import HabbitForm from "@/components/blocks/HabbitForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import withAuth from "../hoc/withAuth";
import { useGetHabbit } from "@/apis/services/habbits/useHabbitService";

const HabbitModal = () => {
  const { back } = useRouter();
  const [open, setOpen] = useState(true);
  const title = useSearchParams().get("title");

  const { data: habbit } = useGetHabbit(
    {
      title: decodeURIComponent(`${title}`),
    },
    { enabled: Boolean(title) },
  );

  const handleChangeOpen = (isOpen: boolean) => {
    if (!isOpen) {
      back();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleChangeOpen}>
      <DialogContent className="flex md:h-[80%] w-full flex-col max-md:top-[10%] max-md:translate-y-0 max-md:rounded-t-3xl max-md:h-[90%]">
        <DialogHeader>
          <DialogTitle className="w-full flex justify-start">
            {habbit?.data?.id ? "습관 수정하기" : "새로운 습관 만들기"}
          </DialogTitle>
        </DialogHeader>
        <div className="relative h-full w-full">
          <HabbitForm title={decodeURIComponent(title ?? "")} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default withAuth(HabbitModal);
