import Greeting from "@/components/blocks/Greeting";
import TaskForm from "@/components/blocks/TaskForm";

export default function Main() {
  return (
    <div className="container mx-auto max-w-[784px]">
      <Greeting />
      <main className="flex flex-col items-center justify-center relative z-10 px-4 py-6">
        <div className="w-full flex flex-col gap-2">
          <TaskForm imageUrl="" />
          {/* <HabitList /> */}
        </div>
      </main>
    </div>
  );
}
