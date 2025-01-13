"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CalendarIcon, XCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  useInfiniteGetAllHabbits,
  useRecordHabbit,
} from "@/apis/services/habbits/useHabbitService";
import { useGetAiResponse } from "@/apis/services/openai/useOpenAiService";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import dayjs from "dayjs";

const FormSchema = z.object({
  name: z.string().min(1, "Title required"),
  date: z.date(),
  percentage: z.number(),
});

type AiResponseFormProps = {
  imageUrl: string;
};

import "dayjs/locale/ko";
import { Slider } from "../ui/slider";
import { useAddToCalander } from "@/apis/services/google/useGoogleService";
import { useRouter } from "next/navigation";

const AiResponseForm = ({ imageUrl }: AiResponseFormProps) => {
  const router = useRouter();

  const { data: aiResponse } = useGetAiResponse({
    imageUrl: decodeURIComponent(imageUrl),
  });

  const { mutate: recordHabit } = useRecordHabbit();
  const { mutate: addToCalander } = useAddToCalander();

  const habits = useInfiniteGetAllHabbits({ params: { page: 1 } });

  const habitList = useMemo(
    () => habits?.data?.pages.flatMap(({ data }) => data.data) ?? [],
    [habits],
  );

  const [isInput, setIsInput] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      date: new Date(),
      percentage: 0,
    },
  });

  useEffect(() => {
    if (aiResponse) {
      const similar = habitList.find(
        (h) => h.title === aiResponse.data?.contents.title,
      );
      if (similar) {
        // 기존 습관 목록에 유사한 제목이 있는 경우 Select 모드로 전환
        form.setValue("name", similar.title);
        setIsInput(false);
      } else {
        // 유사한 제목이 없으면 Input 모드로 전환
        form.setValue("name", aiResponse.data?.contents.title ?? "");
        setIsInput(true);
      }
      if (aiResponse.data?.contents.date) {
        form.setValue("date", new Date(aiResponse.data?.contents.date));
      }

      if (aiResponse.data?.contents.persentage) {
        form.setValue("percentage", +aiResponse.data?.contents.persentage);
      }
    }
  }, [aiResponse, habitList, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    recordHabit(
      {
        title: data.name,
        imageUrl: imageUrl,
        date: data.date,
        percentage: data.percentage,
      },
      {
        onSuccess() {
          addToCalander(
            {
              description: data.name,
              summary: data.name,
              endTime: data.date,
              startTime: data.date,
            },
            {
              onSuccess() {
                router.replace("/");
              },
            },
          );
        },
      },
    );
    // 여기서 제출된 데이터 처리 로직을 구현합니다.
  };

  const onChangeValue = (field: any) => (value: string) => {
    if (field.name === "name" && value === "추가") {
      setIsInput(true);
      return;
    }
    if (field.name === "name" && value === "") {
      setIsInput(false);
      return;
    }
    field.onChange(value);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Title 필드 */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>습관</FormLabel>
              {isInput ? (
                <div className="relative flex items-center">
                  <Input
                    value={field.value}
                    onChange={(e) => onChangeValue(field)(e.target.value)}
                    placeholder="Enter title"
                    className="pr-8"
                  />
                  <Button
                    onClick={() => onChangeValue(field)("")}
                    className="absolute right-0"
                    variant="ghost"
                    type="button"
                  >
                    <XCircleIcon />
                  </Button>
                </div>
              ) : (
                <Select
                  value={field.value}
                  onValueChange={onChangeValue(field)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                  <SelectContent>
                    {habitList.map(
                      (data) =>
                        data && (
                          <SelectItem key={data.title} value={data.title}>
                            {data.title}
                          </SelectItem>
                        ),
                    )}
                    <SelectItem value="추가">추가</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>날짜</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        dayjs(field.value)
                          .locale("ko")
                          .format("YYYY년 MMMM D일")
                      ) : (
                        <span>날짜 선택</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    defaultMonth={
                      field.value ? new Date(field.value) : undefined
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Percentage 필드 */}
        <FormField
          control={form.control}
          name="percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>얼마나 몰입 하셨나요?</FormLabel>
              <Slider
                defaultValue={[field.value]}
                max={120}
                step={30}
                value={[field.value]}
                color="red"
                className={cn(
                  "cursor-pointer transition-colors",
                  field.value < 33
                    ? "[&_#range]:!bg-red-400"
                    : field.value < 99
                      ? "[&_#range]:!bg-primary"
                      : field.value < 121 && "[&_#range]:!bg-green-500",
                )}
                onValueChange={(value) => field.onChange(value[0])}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full py-6 text-lg">인증하기</Button>
      </form>
    </Form>
  );
};

export default AiResponseForm;
