import { LetterGuessState } from "@/app/types";
import { cn } from "@/lib/utils";

interface KeyboardProps {
  onPressKey: (key: string) => void;
  letterGuessState: Record<string, LetterGuessState>;
  disabled?: boolean;
}

const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
] as const;

export const Keyboard: React.FC<KeyboardProps> = ({
  onPressKey,
  letterGuessState,
  disabled = false,
}) => {
  const getKeyClasses = (key: string) => {
    const state = letterGuessState[key.toUpperCase()] || "unused";

    const baseClasses =
      "flex items-center justify-center rounded select-none font-bold transition-transform duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 min-w-0";

    // Use flex-grow and min-w-0 to allow shrinking
    const sizeClasses =
      key === "Enter" || key === "Backspace"
        ? "flex-grow-[1.5] h-[44px] sm:h-[56px] text-sm sm:text-base px-2"
        : "flex-grow h-[44px] sm:h-[56px] text-base sm:text-lg px-1";

    const stateClasses = {
      Indeterminate: "bg-gray-300 text-black hover:bg-gray-400",
      Absent: "bg-gray-600 text-white",
      Present: "bg-yellow-500 text-white",
      Correct: "bg-green-600 text-white",
    };

    return cn(baseClasses, sizeClasses, stateClasses[state]);
  };

  const getDisplayText = (key: string) => {
    if (key === "Backspace") return "⌫";
    if (key === "Enter") return "Enter";
    return key;
  };

  const getAriaLabel = (key: string) => {
    if (key === "Backspace") return "Delete";
    if (key === "Enter") return "Enter";
    return `Letter ${key}`;
  };

  return (
    <section
      aria-label="Wordle Keyboard"
      role="application"
      className="w-full max-w-lg mx-auto p-2 sm:p-4 select-none overflow-x-auto"
    >
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-nowrap justify-center gap-1 mb-2"
          role="row"
          aria-rowindex={rowIndex + 1}
        >
          {row.map((key) => (
            <button
              key={key}
              type="button"
              className={getKeyClasses(key)}
              onClick={() => !disabled && onPressKey(key)}
              disabled={disabled}
              aria-label={getAriaLabel(key)}
              role="gridcell"
              tabIndex={0}
              data-key={key.toLowerCase()}
              data-state={letterGuessState[key.toUpperCase()] || "unused"}
            >
              {getDisplayText(key)}
            </button>
          ))}
        </div>
      ))}
    </section>
  );
};

// const Keyboard = ({ onPressKey }) => {
//   return (
//     <div className="h-[200px] mx-2 select-none">
//       <div className="flex w-full mx-auto gap-1 my-2">
//         {KEYBOARD_LAYOUT[0].map((char) => (
//           <button
//             className="border-0 p-0 text-xl font-bold h-[58px] bg-wordle-keyboard rounded-sm flex-1"
//             key={char}
//             onClick={() => {
//               onPressKey(char);
//             }}
//           >
//             {char}
//           </button>
//         ))}
//       </div>

//       <div className="flex w-full mx-auto gap-1 my-2">
//         <div className="flex-[0.5]" />
//         {KEYBOARD_LAYOUT[1].map((char) => (
//           <button
//             className="border-0 p-0 text-xl font-bold h-[58px] bg-wordle-keyboard rounded-sm flex-1"
//             key={char}
//           >
//             {char}
//           </button>
//         ))}
//         <div className="flex-[0.5]" />
//       </div>

//       <div className="flex w-full mx-auto gap-1 my-2">
//         <button className="border-0 p-0 text-xs font-bold h-[58px] bg-wordle-keyboard rounded-sm flex-[1.5] uppercase">
//           Enter
//         </button>
//         {KEYBOARD_LAYOUT[2].map((char) => (
//           <button
//             className="border-0 p-0 text-xl font-bold h-[58px] bg-wordle-keyboard rounded-sm flex-1"
//             key={char}
//           >
//             {char}
//           </button>
//         ))}

//         <button className="border-0 p-0 text-xs font-bold h-[58px] bg-wordle-keyboard rounded-sm flex-[1.5] uppercase">
//           Del
//         </button>
//       </div>
//     </div>
//   );
// };
