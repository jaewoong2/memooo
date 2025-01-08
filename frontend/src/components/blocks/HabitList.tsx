// components/blocks/HabitList.tsx
import HabitCard from '@/components/blocks/HabitCard';

const HABITS = [
  { title: '물 마시기', progress: 4 },
  { title: '운동하기', progress: 2 },
  { title: '일기 쓰기', progress: 6 },
];

export default function HabitList() {
  return (
    <ul className="flex w-full flex-col justify-start gap-2">
      {HABITS.map((habit) => (
        <HabitCard key={habit.title} title={habit.title} progress={habit.progress} />
      ))}
    </ul>
  );
}