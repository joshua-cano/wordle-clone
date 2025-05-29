"use client";

import { Keyboard } from "@/components/keyboard";
import { Grid } from "@/components/wordle-grid";
import { useEffect, useState } from "react";
import type { LetterGuessState, GridCell, GameState } from "./types";

// const WORDS = Object.freeze([
//   "APPLE",
//   "BEAST",
//   "FAINT",
//   "FEAST",
//   "FRUIT",
//   "GAMES",
//   "PAINT",
//   "PASTE",
//   "TOWER",
//   "REACT",
// ]);

const LETTER_GUESS_STATE_PRIORITY = {
  Indeterminate: 1,
  Absent: 2,
  Present: 3,
  Correct: 4,
};

function getInitialGridState(
  maxAttempts: number,
  lettersPerWord: number
): GridCell[][] {
  return Array.from({ length: maxAttempts }, () =>
    Array.from({ length: lettersPerWord }, () => ({
      char: "",
      state: "Indeterminate",
    }))
  );
}

// Count the frequency of letters in a word.
function countLetterFreqInWord(word: string) {
  const freq = new Map();

  for (let i = 0; i < word.length; ++i) {
    if (!freq.has(word[i])) {
      freq.set(word[i], 0);
    }

    freq.set(word[i], freq.get(word[i]) + 1);
  }

  return freq;
}

export default function Home() {
  const [wordOfTheGame, setWordOfTheGame] = useState("apple");
  const [gameState, setGameState] = useState<GameState>("IN_PROGRESS");

  const [gridState, setGridState] = useState(() => getInitialGridState(6, 5));

  const [position, setPosition] = useState([0, -1]);

  const [letterGuessState, setLetterGuessState] = useState<
    Record<string, LetterGuessState>
  >({});

  function addLetter(char: string) {
    const [row, col] = position;
    const nextCell = col + 1;

    if (nextCell === 5) {
      return;
    }

    const newGridState = [...gridState];
    const newRow = [...newGridState[row]];
    newRow[nextCell] = { ...newRow[nextCell], char: char };
    newGridState[row] = newRow;

    setGridState(newGridState);
    setPosition([row, nextCell]);
  }

  function deleteLetter() {
    const [row, col] = position;

    if (col === -1) {
      return;
    }

    const newGridState = [...gridState];
    const newRow = [...newGridState[row]];
    newRow[col] = { ...newRow[col], char: "" };
    newGridState[row] = newRow;

    setGridState(newGridState);
    setPosition([row, col - 1]);
  }

  function checkWord() {
    const [row, col] = position;

    if (col + 1 < 5) return;

    const newGridState = [...gridState];
    const newRow = [...newGridState[row]];
    const newLetterGuessState = { ...letterGuessState };
    const word = gridState[row].map(({ char }) => char).join("");

    const letterFreq = countLetterFreqInWord(wordOfTheGame);

    const nonMatchingIndices = [];
    let matchCount = 0;

    for (let i = 0; i < word.length; i++) {
      const currentChar = word[i];
      const currentActualChar = wordOfTheGame[i];

      if (currentChar === currentActualChar) {
        newRow[i] = { ...newRow[i], state: "Correct" };
        newGridState[row] = newRow;

        newLetterGuessState[currentChar] = "Correct";

        letterFreq.set(currentChar, letterFreq.get(currentChar) - 1);

        matchCount++;
      } else {
        nonMatchingIndices.push(i);
      }
    }

    if (matchCount === 5) {
      setLetterGuessState(newLetterGuessState);
      setGridState(newGridState);
      setGameState("GUESSED_CORRECTLY");
      return;
    }

    // Update state for rest of the chars.
    nonMatchingIndices.forEach((idx) => {
      const char = word[idx];
      if (letterFreq.has(char) && letterFreq.get(char) > 0) {
        letterFreq.set(char, letterFreq.get(char) - 1);
        newRow[idx] = { ...newRow[idx], state: "Present" };
        newGridState[row] = newRow;
        // Only change state if the new state is higher priority
        // than the current state.
        if (
          LETTER_GUESS_STATE_PRIORITY["Present"] >
          LETTER_GUESS_STATE_PRIORITY[
            newLetterGuessState[char] ?? "Indeterminate"
          ]
        ) {
          newLetterGuessState[char] = "Present";
        }
      } else {
        newRow[idx] = { ...newRow[idx], state: "Absent" };
        newGridState[row] = newRow;
        // Only change state if the new state is higher priority
        // than the current state.
        if (
          LETTER_GUESS_STATE_PRIORITY["Absent"] >
          LETTER_GUESS_STATE_PRIORITY[
            newLetterGuessState[char] ?? "Indeterminate"
          ]
        ) {
          newLetterGuessState[char] = "Absent";
        }
      }
    });

    setLetterGuessState(newLetterGuessState);
    setGridState(newGridState);

    // User did not manage to guess the correct answer.
    if (row + 1 === 6) {
      setGameState("NO_MORE_GUESSES");
      return;
    }

    setPosition([row + 1, -1]);
  }

  function isValidKey(key: string) {
    return key === "Enter" || key === "Backspace" || /^[a-zA-Z]$/.test(key);
  }

  function onPressKey(key: string) {
    if (gameState !== "IN_PROGRESS") return;

    if (!isValidKey(key)) return;

    switch (key) {
      case "Enter":
        checkWord();
        break;
      case "Backspace":
        deleteLetter();
        break;
      default:
        addLetter(key);
        break;
    }
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      if (
        event.target !== document.body &&
        (event.key === "Enter" || event.key === " ")
      ) {
        return;
      }

      onPressKey(event.key);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="max-w-[500px] mx-auto flex flex-col w-full">
      <Grid letters={gridState} />
      <Keyboard onPressKey={onPressKey} letterGuessState={letterGuessState} />
    </div>
  );
}
