import { ChordExtension, ChordType, type Control, ControlType } from "./types";

export const CONTROLS: Control[] = [
  {
    type: ControlType.CHORD_TYPE,
    chordType: ChordType.DIM,
    shortcut: "k",
    padNote: 36,
    label: "Dim",
    color: "red",
  },
  {
    type: ControlType.CHORD_TYPE,
    chordType: ChordType.MAJ,
    shortcut: "l",
    padNote: 37,
    label: "Maj",
    color: "green",
  },
  {
    type: ControlType.CHORD_TYPE,
    chordType: ChordType.MIN,
    shortcut: ";",
    padNote: 38,
    label: "Min",
    color: "orange",
  },
  {
    type: ControlType.CHORD_TYPE,
    chordType: ChordType.SUS,
    shortcut: "'",
    padNote: 39,
    label: "Sus",
    color: "blue",
  },
  {
    type: ControlType.CHORD_EXTENSION,
    chordExtension: ChordExtension.ADD6,
    shortcut: "i",
    padNote: 40,
    label: "6",
    color: "cyan",
  },
  {
    type: ControlType.CHORD_EXTENSION,
    chordExtension: ChordExtension.MIN7,
    shortcut: "o",
    padNote: 41,
    label: "m7",
    color: "pink",
  },
  {
    type: ControlType.CHORD_EXTENSION,
    chordExtension: ChordExtension.MAJ7,
    shortcut: "p",
    padNote: 42,
    label: "M7",
    color: "blue",
  },
  {
    type: ControlType.CHORD_EXTENSION,
    chordExtension: ChordExtension.ADD9,
    shortcut: "[",
    padNote: 43,
    label: "9",
    color: "yellow",
  },
];

export const KEYBOARD_NOTE_MAP: Record<string, string> = {
  a: "C3",
  w: "C#3",
  s: "D3",
  e: "D#3",
  d: "E3",
  f: "F3",
  t: "F#3",
  g: "G3",
  y: "G#3",
  h: "A3",
  u: "A#3",
  j: "B3",
};
export const KEYBOARD_NOTE_MAP_REVERSE = Object.fromEntries(
  Object.entries(KEYBOARD_NOTE_MAP).map(([key, value]) => [value, key]),
);
