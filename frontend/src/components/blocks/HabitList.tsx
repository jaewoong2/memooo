"use client";

import { useInfiniteGetAllHabbits } from "@/apis/services/habbits/useHabbitService";
import { useUserGetMe } from "@/apis/services/user/useUserService";
import HabitCard from "@/components/blocks/HabitCard";
import { useMemo, useState } from "react";

export default function HabitList() {
  const { data: user } = useUserGetMe();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    hasPreviousPage,
    fetchPreviousPage,
  } = useInfiniteGetAllHabbits({
    params: { page: 0, take: 10 },
    enabled: Boolean(user?.data?.id),
  });

  const [currentPage, setCurrentPage] = useState(1);

  const habits = useMemo(() => {
    return data?.pages[currentPage - 1]?.data?.data ?? [];
  }, [data, currentPage]);

  const onClickNextPage = () => {
    if (!data?.pages[currentPage - 1].data.meta?.hasNextPage) {
      return;
    }
    setCurrentPage((prev) => prev + 1);

    if (!hasNextPage) {
      return;
    }
    fetchNextPage();
  };
  const onClickPrevPage = () => {
    if (currentPage === 1) {
      return;
    }
    setCurrentPage((prev) => prev - 1);

    if (!hasPreviousPage) {
      return;
    }
    fetchPreviousPage();
  };

  return (
    habits.length > 0 && (
      <>
        <p>내 습관</p>
        <ul className="flex w-full flex-col justify-start gap-2">
          {habits.map(({ title, icon, records }) => (
            <HabitCard
              icon={icon}
              key={title}
              title={title}
              records={records}
            />
          ))}
        </ul>
      </>
    )
  );
}
