import { LetterGuessState } from "@/app/types";
import { Button } from "./ui/button";

interface KeyboardProps {
  onPressKey: (key: string) => void;
  letterGuessState: Record<string, LetterGuessState>;
}

const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

export const Keyboard: React.FC<KeyboardProps> = ({
  onPressKey,
  letterGuessState,
}) => {
  return (
    <section className="w-full mx-auto p-2">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-20 gap-1 mb-1.5">
          {rowIndex === 1 && <div className="col-span-1" />}

          {row.map((key) => (
            <Button
              key={key}
              variant={"secondary"}
              size="lg"
              className={
                "shrink col-span-2 data-[state=absent]:bg-wordle-border data-[state=present]:bg-wordle-yellow data-[state=correct]:bg-wordle-green data-[key=Enter]:col-span-3 data-[key=Enter]:text-xs data-[key=Backspace]:col-span-3"
              }
              onClick={() => onPressKey(key)}
              data-state={letterGuessState[key]}
              data-key={key}
            >
              {key === "Backspace" ? "DEL" : key.toUpperCase()}
            </Button>
          ))}
          {rowIndex === 1 && <div className="col-span-1" />}
        </div>
      ))}
    </section>
  );
};
