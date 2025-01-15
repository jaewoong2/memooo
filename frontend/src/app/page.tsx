import Greeting from "@/components/blocks/Greeting";
import PuzzleBoard from "./ProgressPuzzle";

export default function Main() {
  return (
    <div className="container mx-auto max-w-[784px]">
      <Greeting />
      <main className="flex flex-col items-center justify-center relative z-10 px-4 py-6">
        {/* <div className="w-full h-16 border bg-background rounded-xl flex justify-center items-center"></div> */}
        {/* <PuzzleBoard /> */}
        {/* 내 습관 */}
        <div className="w-full flex flex-col gap-2">
          <div className="relative overflow-hidden border w-full flex justify-center items-center bg-green-600 min-h-[200px] rounded-2xl shadow-xl">
            <div className="w-[99%] right-0 h-[30px] bg-secondary-foreground absolute top-0 rounded-t-xl"></div>
            <div className="w-1/3 left-0 h-[50px] bg-green-600 absolute top-0 rounded-tr-[30px]"></div>
            <div className="w-2/3 right-0 h-[50px] bg-secondary-foreground absolute top-0 rounded-bl-[20px] "></div>
          </div>

          {/* <HabitList /> */}
        </div>
      </main>
    </div>
  );
}
