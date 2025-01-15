"use client";

import { useInfiniteGetAllHabbits } from "@/apis/services/habbits/useHabbitService";
import { useUserGetMe } from "@/apis/services/user/useUserService";
import { Habbit } from "@/apis/type";
import HabitCard from "@/components/blocks/HabitCard";
import { useMemo, useState } from "react";

export default function HabitList() {
  const { data: user } = useUserGetMe();

  const habbits = useInfiniteGetAllHabbits({
    params: { page: 1, take: 10 },
    enabled: Boolean(user?.data?.id),
  });

  const [currentPage, setCurrentPage] = useState(1);

  const habits = useMemo(() => {
    const list = habbits?.data?.pages[currentPage - 1]?.data?.data ?? [];

    return list.reduce((groups: Record<string, Habbit[]>, habit) => {
      const { group } = habit;
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(habit);
      return groups;
    }, {});
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
    <>
      <ul className="flex w-full flex-col justify-start gap-2">
        {Object.keys(habits).map((groupName) => {
          const groupHabits = habits[groupName];
          return (
            <li key={groupName}>
              <h3 className="text-lg font-semibold">{groupName}</h3>
              <ul className="flex flex-col gap-2">
                {groupHabits.map(({ title, icon, records }) => (
                  <HabitCard
                    icon={icon}
                    key={title}
                    title={title}
                    records={records}
                  />
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </>
  );
}
