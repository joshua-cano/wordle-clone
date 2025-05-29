import { cn } from "@/lib/utils";
import { LetterCell } from "@/app/types";

type GridProps = {
  letters: LetterCell[][];
};

export const Grid = ({ letters }: GridProps) => {
  return (
    <div className="flex items-center justify-center grow overflow-hidden">
      <div className="grid grid-rows-6 gap-1.5 p-2.5 w-[350px] h-[420px]">
        {letters.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-5 gap-1.5 font-bold text-xl text-white"
          >
            {row.map(({ state, char }, colIndex) => (
              <div
                key={rowIndex + "-" + colIndex}
                className={cn(
                  "border-2 border-wordle-border inline-flex items-center justify-center",
                  state === "Present" && "bg-wordle-yellow",
                  state === "Correct" && "bg-wordle-green",
                  state === "Absent" && "bg-wordle-dark-gray"
                )}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
