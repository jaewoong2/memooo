"use client";

import { z } from "zod";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { GetDatabaseResponses } from "@/apis/services/integration/type";

const FormSchema = z.object({
  database: z.string().nullable(),
});

type Props = {
  databases?: GetDatabaseResponses;
  header?: {
    label?: string;
    description?: string;
  };
};

export function SelectForm({ databases, header }: Props) {
  const form = useFormContext<z.infer<typeof FormSchema>>();

  return (
    <FormField
      control={form.control}
      name="database"
      render={({ field }) => (
        <FormItem className="bg-background rounded-xl p-6 border">
          <div className="mb-4">
            <FormLabel className="text-base">{header?.label}</FormLabel>
            <FormDescription>{header?.description}</FormDescription>
          </div>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value ?? ""}
          >
            <FormControl>
              <SelectTrigger className="bg-background rounded-lg py-5 shadow-none">
                <SelectValue placeholder="데이터베이스를 선택해주세요" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {databases?.map((database) => (
                <SelectItem key={database.title} value={database.id}>
                  {database.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
