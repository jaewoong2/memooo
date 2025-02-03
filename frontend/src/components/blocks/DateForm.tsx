import { cn } from "@/lib/utils";
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { ko } from "date-fns/locale";
import dayjs from "dayjs";

import "dayjs/locale/ko";
dayjs.locale("ko");

const FormSchema = z.object({
  date: z.string(),
});

type Props = {
  label?: string;
};

const DateForm = ({ label }: Props) => {
  const form = useFormContext<z.infer<typeof FormSchema>>();

  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col pl-6">
          {label && <FormLabel className="space-y-0">{label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal shadow-none border-0 p-0 h-fit w-fit bg-transparent",
                    "border-b rounded-none",
                  )}
                >
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-base" />
                  {field.value ? (
                    dayjs(field.value).locale("ko").format("YYYY년 MMMM D일")
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                locale={ko}
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(event) =>
                  field.onChange(dayjs(event).format("YYYY-MM-DD"))
                }
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                defaultMonth={field.value ? new Date(field.value) : undefined}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateForm;
