import { Button } from "@/components/ui/button";
import type { GameState } from "@/app/types";

type Props = {
  gameState: GameState;
  wordOfTheGame: string;
  onReset: () => void;
};

export const GameResult = ({ gameState, wordOfTheGame, onReset }: Props) => {
  if (gameState === "IN_PROGRESS") return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50">
      <div className="bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border-2 p-6 shadow-lg sm:max-w-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-4 justify-center items-center pt-4">
            {gameState === "GUESSED_CORRECTLY" && (
              <div className="flex flex-col items-center gap-4 mb-6">
                <span className="text-6xl">🎉</span>
                <span className="text-2xl">Congratulations!</span>
                <span className="text-xl">You are a genius</span>
              </div>
            )}
            {gameState === "NO_MORE_GUESSES" && (
              <div className="text-2xl font-mono flex flex-col items-center gap-2 mb-6">
                <span>Word of the day:</span>
                <span>{wordOfTheGame}</span>
              </div>
            )}
          </div>
          <Button onClick={onReset} style={{ pointerEvents: "auto" }}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
