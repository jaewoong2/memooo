"use client";

import { ControllerRenderProps, useFormContext } from "react-hook-form";
import { z } from "zod";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useEffect, useMemo } from "react";
import Checkbox from "../ui/checkbox2";
import { Button } from "../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

enum ITEM_STATUS {
  ORIGIN = "ORIGIN",
  UPDATED = "UPDATED",
  ADD = "ADD",
}

const ItemSchema = z.object({
  name: z.string(),
  checked: z.boolean(),
  id: z.string().or(z.number()),
  status: z.nativeEnum(ITEM_STATUS),
  type: z.string().optional(),
});

const FormSchema = z.object({
  items: z.array(ItemSchema).nullable(),
});

type Props = {
  items: z.infer<typeof ItemSchema>[];
  header?: {
    label?: string;
    description?: string;
  };
  onClickDeleteButton?: React.MouseEventHandler<HTMLButtonElement>;
  onClickAddButton?: React.MouseEventHandler<HTMLButtonElement>;
  onChangeItemName?: (
    itemId: string | number,
  ) => React.ChangeEventHandler<HTMLInputElement>;
  onClickCheckbox?: (itemId: string | number) => void;
};

export function CheckBoxForm({
  items,
  header,
  onClickDeleteButton,
  onClickAddButton,
  onChangeItemName,
  onClickCheckbox,
}: Props) {
  const form = useFormContext<z.infer<typeof FormSchema>>();

  const handleCheckBox =
    (item: z.infer<typeof ItemSchema>) => (checked: boolean) => {
      onClickCheckbox && onClickCheckbox(item.id);
    };

  return (
    <FormField
      control={form.control}
      name="items"
      render={() => (
        <FormItem className="bg-background rounded-xl overflow-hidden border space-y-0">
          <div className="mb-4 p-6 pb-0">
            <FormLabel className="text-base">{header?.label}</FormLabel>
            <FormDescription>{header?.description}</FormDescription>
          </div>
          <div className="w-full flex border-t flex-row items-center space-y-0 h-[5rem]">
            <Button
              onClick={onClickAddButton}
              type="button"
              variant={"secondary"}
              className={cn(
                "w-full flex flex-row items-center space-y-0 rounded-xl",
                "rounded-none items-center pl-3 h-full",
                "text-secondary-foreground justify-center border-0",
              )}
            >
              <PlusIcon />
              <span>추가하기</span>
            </Button>
          </div>
          {items?.map(
            (item, index) =>
              item.type === "checkbox" && (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "w-full flex border-t flex-row items-center bg-background space-y-0 h-[5rem]",
                        )}
                      >
                        <FormItem
                          key={item.id}
                          className={cn(
                            "w-full flex flex-row items-center bg-background space-y-0 rounded-xl",
                            "rounded-none transition-colors border-0 gap-3 items-center pl-3 h-full hover:bg-green-300",
                            field.value?.find(
                              (value) => value.id === item.id,
                            ) &&
                              "bg-green-400/90 hover:bg-green-400 transition-colors",
                          )}
                        >
                          <FormControl>
                            <Checkbox
                              className={cn(
                                "data-[state=checked]:bg-transparent",
                                "border-0 shadow-none peer w-full relative p-0 h-full",
                              )}
                              id={item.id.toString()}
                              defaultChecked={item.checked}
                              checked={item.checked}
                              onChecked={handleCheckBox(item)}
                            >
                              <Checkbox.Indicator className="border-none checked:bg-transparent" />
                              <FormLabel
                                onClick={() =>
                                  handleCheckBox(item)(item.checked)
                                }
                                className="relative w-full h-full text-sm font-normal gap-1 cursor-pointer space-y-0 flex items-center"
                              >
                                <Checkbox.Label className="w-full h-full flex justify-start items-center cursor-pointer">
                                  {item.status !== ITEM_STATUS.ORIGIN && (
                                    <Input
                                      autoFocus
                                      className="rounded-none text-nowrap p-0 w-full border-0 focus-within:border-0 focus-visible:ring-0 shadow-none"
                                      value={item.name}
                                      placeholder={item?.name}
                                      onChange={
                                        onChangeItemName &&
                                        onChangeItemName(item.id)
                                      }
                                      onClick={() =>
                                        handleCheckBox(item)(item.checked)
                                      }
                                    />
                                  )}
                                  {item.status === ITEM_STATUS.ORIGIN && (
                                    <span className="text-nowrap">
                                      {item.name}
                                    </span>
                                  )}
                                </Checkbox.Label>
                              </FormLabel>
                              {item.status === ITEM_STATUS.UPDATED && (
                                <Badge className="absolute bg-green-500 hover:bg-green-500/90 transition text-secondary border font-light -top-3 -right-2 text-nowrap items-center text-xs animate-fade-left pt-1 flex shadow-none dark:bg-muted-foreground">
                                  이미지를 통해 추가했어요
                                </Badge>
                              )}
                            </Checkbox>
                          </FormControl>
                        </FormItem>
                        {item.status !== ITEM_STATUS.ORIGIN && (
                          <button
                            data-index={index}
                            onClick={onClickDeleteButton}
                            type="button"
                            className="w-[72px] h-full text-xl bg-red-400/90 whitespace-nowrap flex justify-center items-center hover:bg-red-400/80 transition-colors"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    );
                  }}
                />
              ),
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
