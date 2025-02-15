import { type Output, Utilities } from "webmidi";
import { Chord } from "./types";

const CHORD_SCALES = {
  [Chord.MAJ]: [0, 2, 4, 5, 7, 9, 11],
  [Chord.MIN]: [0, 2, 3, 5, 7, 8, 10],
  [Chord.DIM]: [0, 2, 3, 5, 6, 8, 10],
  [Chord.SUS]: [0, 2, 5, 7, 9, 11],
};

export function getChordNotes(
  note: number,
  chord: Chord | null,
  extensions: number[],
) {
  if (chord == null) {
    return [note];
  }
  const scale = CHORD_SCALES[chord];
  return [
    ...[0, 2, 4]
      .map((n) => (scale[n] != null ? note + scale[n] : null))
      .filter((n) => n != null),
    ...extensions.map((e) => note + e),
  ];
}

export function playNotes(output: Output, notes: number[]) {
  console.log(
    "playNotes",
    notes.map((n) => Utilities.getNoteDetails(n).identifier),
  );
  for (const note of notes) {
    output.playNote(note);
  }
}

export function stopNotes(output: Output, notes: number[]) {
  for (const note of notes) {
    output.stopNote(note);
  }
}
