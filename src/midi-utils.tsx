import { type Note, Utilities } from "webmidi";
import { ChordExtension, ChordType } from "./types";

const CHORD_SCALES = {
  [ChordType.MAJ]: [0, 2, 4, 5, 7, 9, 11],
  [ChordType.MIN]: [0, 2, 3, 5, 7, 8, 10],
  [ChordType.DIM]: [0, 2, 3, 5, 6, 8, 10],
  [ChordType.SUS]: [0, 2, 5, 5, 7, 9, 11],
};

export function getChord(
  note: Note,
  chordType: ChordType | null,
  extensions: number[],
) {
  if (chordType == null) {
    return { activeNote: note, notes: [note] };
  }
  const scale = CHORD_SCALES[chordType];
  return {
    activeNote: note,
    notes: Utilities.buildNoteArray([
      ...[0, 2, 4]
        .map((n) => (scale[n] != null ? note.number + scale[n] : null))
        .filter((n) => n != null),
      ...extensions.map(
        (e) =>
          note.number +
          (chordType === ChordType.DIM && e === ChordExtension.MIN7
            ? e - 1
            : e),
      ),
    ]),
  };
}
