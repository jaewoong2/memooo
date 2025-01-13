import React, { useState } from "react";
import { Button } from "../ui/button";
import { useDeleteHabbit } from "@/apis/services/habbits/useHabbitService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type Props = {
  habitId: number;
  title?: string;
};

const DeleteHabitButton = ({
  children,
  onClick,
  habitId,
  title,
  ...props
}: JSX.IntrinsicElements["button"] & Props) => {
  const { mutate } = useDeleteHabbit();
  const [isOpen, setIsOpen] = useState(false);

  const onClickDeleteButton: React.MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    if (typeof onClick === "function") onClick(event);
    mutate({ habbitId: habitId });
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"destructive"}
            {...props}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {children}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="">
            <DialogTitle className="flex justify-start w-full">
              습관 삭제
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <span className="font-bold text-primary">[{title}]</span> 을 삭제
            하시겠어요?
          </div>
          <DialogFooter>
            <Button
              variant={"destructive"}
              onClick={onClickDeleteButton}
              type="button"
            >
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteHabitButton;
