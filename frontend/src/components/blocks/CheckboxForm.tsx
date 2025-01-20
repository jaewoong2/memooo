"use client";

import { useFormContext, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type Props = {
  items: { id: string; label: string }[];
  header?: {
    label?: string;
    description?: string;
  };
};

export function CheckBoxForm({ items, header }: Props) {
  const form = useFormContext<z.infer<typeof FormSchema>>();

  return (
    <FormField
      control={form.control}
      name="items"
      render={() => (
        <FormItem className="bg-background rounded-xl p-6 border">
          <div className="mb-4">
            <FormLabel className="text-base">{header?.label}</FormLabel>
            <FormDescription>{header?.description}</FormDescription>
          </div>
          {items.map((item) => (
            <FormField
              key={item.id}
              control={form.control}
              name="items"
              render={({ field }) => {
                return (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-center space-x-3 space-y-0 border px-3 rounded-xl"
                  >
                    <FormControl>
                      <Checkbox
                        className="data-[state=checked]:bg-green-600"
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== item.id,
                                ),
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="w-full h-full py-4 text-sm font-normal">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
