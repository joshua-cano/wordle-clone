export type GridCell = {
  char: string;
  state: LetterGuessState;
};

export type LetterCell = {
  char: string;
  state: string;
};

export type LetterGuessState =
  | "empty"
  | "tbd"
  | "absent"
  | "present"
  | "correct";

export type GameState = "IN_PROGRESS" | "GUESSED_CORRECTLY" | "NO_MORE_GUESSES";
