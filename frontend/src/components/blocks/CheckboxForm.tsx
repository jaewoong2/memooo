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
import { useEffect, useState } from "react";
import Checkbox from "../ui/checkbox2";

enum ITEM_STATUS {
  ORIGIN = "ORIGIN",
  UPDATED = "UPDATED",
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
};

export function CheckBoxForm({ items, header, onClickDeleteButton }: Props) {
  const form = useFormContext<z.infer<typeof FormSchema>>();
  const [itemList, setItemList] = useState<Props["items"]>([]);

  const onChangeItemName: (
    itemId: string | number,
  ) => React.ChangeEventHandler<HTMLInputElement> = (itemId) => (event) => {
    setItemList((prev) => {
      const targetIndex = itemList.findIndex((item) => item.id === itemId);
      return prev.map((item, index) => {
        if (targetIndex === index) {
          return { ...prev[targetIndex], name: event.target.value };
        }
        return item;
      });
    });
  };

  const onClickCheckbox =
    (
      item: z.infer<typeof ItemSchema>,
      field: ControllerRenderProps<
        {
          items: z.infer<typeof ItemSchema>[] | null;
        },
        "items"
      >,
    ) =>
    (checked: boolean) => {
      const values = field.value ?? [];
      checked
        ? field.onChange([...values, item])
        : field.onChange(values?.filter((value) => value.id !== item.id));
    };

  useEffect(() => {
    setItemList(items);
  }, [items]);

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
          {itemList.map(
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
                          "",
                        )}
                      >
                        <FormItem
                          key={item.id}
                          className={
                            cn(
                              "w-full flex flex-row items-center bg-background space-y-0 rounded-xl",
                              "rounded-none transition-colors border-0 gap-3 items-center pl-3 h-full hover:bg-green-300",
                              field.value?.find(
                                (value) => value.id === item.id,
                              ) &&
                                "bg-green-400/90 hover:bg-green-400 transition-colors",
                            )
                            // "flex flex-row items-center space-x-3 bg-background space-y-0 border px-3 rounded-xl",
                            // "hover:bg-neutral-100 transition hover:dark:bg-secondary/60",
                          }
                        >
                          <FormControl>
                            <Checkbox
                              className={cn(
                                "data-[state=checked]:bg-transparent",
                                "border-0 shadow-none peer w-full relative p-0 h-full",
                              )}
                              id={item.id.toString()}
                              defaultChecked={item.checked}
                              onChecked={onClickCheckbox(item, field)}
                            >
                              <Checkbox.Indicator className="border-none checked:bg-transparent" />
                              <Checkbox.Label className="relative w-full h-full py-4 text-sm font-normal gap-1 cursor-pointer space-y-0 flex items-center">
                                <FormLabel>
                                  {item.status === ITEM_STATUS.UPDATED && (
                                    <Input
                                      autoFocus
                                      className="rounded-none text-nowrap h-fit p-0 w-fit border-0 focus-within:border-0 focus-visible:ring-0 shadow-none"
                                      value={item.name}
                                      placeholder={items[index].name}
                                      onChange={onChangeItemName(item.id)}
                                    />
                                  )}
                                  {item.status !== ITEM_STATUS.UPDATED && (
                                    <span className="text-nowrap">
                                      {item.name}
                                    </span>
                                  )}
                                </FormLabel>
                              </Checkbox.Label>
                              {item.status === ITEM_STATUS.UPDATED && (
                                <Badge className="absolute bg-green-500 hover:bg-green-500/90 transition text-secondary border font-light -top-3 -right-2 text-nowrap items-center text-xs animate-fade-left pt-1 flex shadow-none dark:bg-muted-foreground">
                                  이미지를 통해 추가했어요
                                </Badge>
                              )}
                            </Checkbox>
                          </FormControl>
                        </FormItem>
                        {item.status === ITEM_STATUS.UPDATED && (
                          <button
                            id={item.name}
                            onClick={onClickDeleteButton}
                            type="button"
                            className="w-[72px] h-full text-xl bg-rose-400 whitespace-nowrap flex justify-center items-center hover:bg-rose-400/90 transition-colors"
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
