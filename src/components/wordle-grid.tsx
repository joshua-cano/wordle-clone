import { cn } from "@/lib/utils";
import { LetterCell } from "@/app/types";

type GridProps = {
  letters: LetterCell[][];
};

export const Grid = ({ letters }: GridProps) => {
  return (
    <div className="grid grid-rows-6 gap-1.5 p-2.5 w-full max-w-[350px] h-[420px]">
      {letters.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-5 gap-1.5 font-bold text-3xl text-white"
        >
          {row.map(({ state, char }, colIndex) => (
            <div
              key={rowIndex + "-" + colIndex}
              className={cn(
                "select-none border-2 border-wordle-border inline-flex items-center justify-center text-3xl data-[state=present]:bg-wordle-yellow data-[state=correct]:bg-wordle-green data-[state=absent]:bg-wordle-border data-[state=tbd]:border-[#565758] data-[state=tbd]:animate-pop"
              )}
              data-state={state}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
