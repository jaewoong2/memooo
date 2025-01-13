import HabitList from "@/components/blocks/HabitList";
import Greeting from "@/components/blocks/Greeting";

export default function Main() {
  return (
    <div className="container mx-auto max-w-[784px]">
      <Greeting />
      <main className="flex flex-col items-center justify-center relative z-10 px-4 py-6">
        <div className="w-full h-16 border bg-background rounded-xl flex justify-center items-center"></div>

        {/* 내 습관 */}
        <div className="w-full flex flex-col gap-2">
          <HabitList />
        </div>
      </main>
    </div>
  );
}
