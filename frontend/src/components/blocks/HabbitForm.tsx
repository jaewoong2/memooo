"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  BicepsFlexedIcon,
  GlassWaterIcon,
  MoonIcon,
  PiggyBankIcon,
  SaladIcon,
  SmileIcon,
  StarIcon,
  SunIcon,
  XCircleIcon,
} from "lucide-react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";
import {
  useCreateHabbit,
  useGetHabbit,
  useInfiniteGetAllHabbits,
  useUpdateHabbit,
} from "@/apis/services/habbits/useHabbitService";
import { useRouter } from "next/navigation";
import DeleteHabitButton from "./DeleteHabitButton";

const habitIcons = [
  { value: "star", Icon: StarIcon },
  { value: "smile", Icon: SmileIcon },
  { value: "salad", Icon: SaladIcon },
  { value: "glassWater", Icon: GlassWaterIcon },
  { value: "sun", Icon: SunIcon },
  { value: "moon", Icon: MoonIcon },
  { value: "none", Icon: XCircleIcon },
  { value: "finance", Icon: PiggyBankIcon },
  { value: "workout", Icon: BicepsFlexedIcon },
];

const FormSchema = z.object({
  icon: z.enum(
    [
      "star",
      "smile",
      "salad",
      "glassWater",
      "sun",
      "moon",
      "none",
      "finance",
      "workout",
    ],
    {
      required_error: "Please select a type.",
    },
  ),
  name: z.string({ required_error: "Habbits Name Is Required" }).min(1),
});

type Props = {
  title: string;
};

function isStringValid(string?: any) {
  if (typeof string !== "string") return false;
  if (string === "") return false;
  if (!string) return false;

  return true;
}

const HabbitForm = ({ title }: Props) => {
  const { data: habbit } = useGetHabbit(
    { title },
    { enabled: isStringValid(title) },
  );
  const { mutate: updateHabbit } = useUpdateHabbit();
  const { mutate: createHabbit } = useCreateHabbit();
  const router = useRouter();

  const habbits = useInfiniteGetAllHabbits({
    params: { page: 1 },
    enabled: isStringValid(title),
  });
  const [isInput, setIsInput] = useState(() => {
    if (isStringValid(title)) return false;
    return true;
  });

  const habitList = useMemo(() => {
    return habbits?.data.pages.flatMap(({ data }) => data.data);
  }, [habbits?.data.pages]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: title ?? "", icon: "star" },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!habbit?.data?.id) {
      createHabbit(
        {
          title: data.name,
          icon: data.icon,
          group: "default",
        },
        {
          onSuccess() {
            router.back();
          },
        },
      );
      return;
    }

    updateHabbit({
      habbitId: habbit.data.id,
      title: data.name,
      icon: data.icon,
      group: "default",
    });
  };

  const onChangeValue =
    (field: ControllerRenderProps<any>) => (value: string | null) => {
      if (field.name === "name" && value === "추가") {
        setIsInput(true);
        return;
      }

      if (field.name === "name" && value === null) {
        setIsInput(false);
        return;
      }

      field.onChange(value);
    };

  useEffect(() => {
    if (habbit?.data) {
      form.setValue("name", habbit?.data?.title);
      form.setValue("icon", habbit?.data?.icon);
    }
  }, [habbit, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <div className="my-4 flex flex-col gap-2">
            <div className="flex flex-col items-start justify-start">
              <h4
                className={cn(
                  "text-lg font-bold relative w-fit mb-4 col-span-3",
                  "after:w-16 after:h-1 after:bg-muted-foreground after:absolute after:-bottom-1 after:left-0",
                )}
              >
                Habbit
              </h4>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <>
                      {isInput && (
                        <label className="relative max-w-80 flex">
                          <Input
                            autoFocus
                            placeholder="습관 이름을 입력하세요 "
                            className={cn(
                              "focus:border-0 focus:outline-none focus-visible:ring-0",
                              "shadow-none max-w-80 w-full text-lg md:text-lg p-0 focus:ring-0 border-0 rounded-none border-muted-foreground",
                            )}
                            value={field.value}
                            onChange={(e) =>
                              onChangeValue(field)(e.target.value)
                            }
                          />
                          <Button
                            onClick={() => onChangeValue(field)(null)}
                            className="right-0 top-0 absolute hover:bg-transparent"
                            variant="ghost"
                            type="button"
                          >
                            <XCircleIcon />
                          </Button>
                        </label>
                      )}

                      {!isInput && (
                        <Select
                          value={field.value}
                          onValueChange={onChangeValue(field)}
                        >
                          <SelectTrigger className="max-w-80 shadow-none text-lg p-0 focus:ring-0 border-0 rounded-none border-muted-foreground">
                            <SelectValue placeholder="내 습관" />
                          </SelectTrigger>
                          <SelectContent>
                            {habitList?.map(
                              (data) =>
                                data && (
                                  <SelectItem
                                    key={data.title}
                                    value={data.title}
                                  >
                                    {data.title}
                                  </SelectItem>
                                ),
                            )}
                            <SelectItem value="추가">추가</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel
                    className={cn(
                      "text-lg font-bold relative",
                      "after:w-16 after:h-1 after:bg-muted-foreground after:absolute after:-bottom-1 after:left-0",
                    )}
                  >
                    Icon
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex max-w-[500px] flex-wrap justify-start gap-4 max-sm:gap-3 max-sm:flex-wrap max-sm:w-[340px]"
                    >
                      {habitIcons.map(({ value, Icon }) => (
                        <FormItem
                          key={value}
                          className="flex flex-col items-center w-fit p-0 m-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={value} className="hidden" />
                          </FormControl>
                          <Button
                            className={cn(
                              "aspect-square w-12 h-auto p-0 bg-secondary text-primary hover:text-background hover:bg-primary hover:opacity-90",
                              field.value === value &&
                                "bg-primary text-background",
                            )}
                            type="button"
                            onClick={() => field.onChange(value)}
                          >
                            <Icon
                              strokeWidth={2.5}
                              className={cn("w-12 h-12")}
                            />
                          </Button>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-12 max-md:grid-cols-1 gap-2">
            <Button
              type="submit"
              className="w-full col-span-9 max-md:col-span-1"
            >
              {habbit?.data?.id ? "수정하기" : "습관 만들기"}
            </Button>
            {habbit?.data?.id && (
              <DeleteHabitButton
                habitId={habbit.data.id}
                onClick={() => {
                  router.back();
                }}
                title={title}
                type="button"
                className="w-full col-span-3 max-md:col-span-1"
              >
                삭제
              </DeleteHabitButton>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default HabbitForm;
