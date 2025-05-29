export type GridCell = {
  char: string;
  state: LetterGuessState;
};

export type LetterCell = {
  char: string;
  state: string;
};

export type LetterGuessState =
  | "Indeterminate"
  | "Absent"
  | "Present"
  | "Correct";

export type GameState = "IN_PROGRESS" | "GUESSED_CORRECTLY" | "NO_MORE_GUESSES";
