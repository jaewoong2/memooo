"use client";

import { useInfiniteGetAllHabbits } from "@/apis/services/habbits/useHabbitService";
import { useUserGetMe } from "@/apis/services/user/useUserService";
import HabitCard from "@/components/blocks/HabitCard";
import { useMemo, useState } from "react";

export default function HabitList() {
  const { data: user } = useUserGetMe();

  const habbits = useInfiniteGetAllHabbits({
    params: { page: 0, take: 10 },
    enabled: Boolean(user?.data?.id),
  });

  const [currentPage, setCurrentPage] = useState(1);

  const habits = useMemo(() => {
    return habbits?.data?.pages[currentPage - 1]?.data?.data ?? [];
  }, [habbits, currentPage]);

  const onClickNextPage = () => {
    if (!habbits?.data?.pages[currentPage - 1].data.meta?.hasNextPage) {
      return;
    }
    setCurrentPage((prev) => prev + 1);

    if (!habbits?.hasNextPage) {
      return;
    }
    habbits?.fetchNextPage();
  };
  const onClickPrevPage = () => {
    if (currentPage === 1) {
      return;
    }
    setCurrentPage((prev) => prev - 1);

    if (!habbits?.hasPreviousPage) {
      return;
    }
    habbits?.fetchPreviousPage();
  };

  return (
    habits.length > 0 && (
      <>
        <p>내 습관</p>
        <ul className="flex w-full flex-col justify-start gap-2">
          {habits?.map(({ title, icon, records }) => (
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
