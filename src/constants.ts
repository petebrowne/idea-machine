import { ChordExtension, ChordType, type Control, ControlType } from "./types";

export const CONTROLS: Control[] = [
  {
    type: ControlType.CHORD,
    chordType: ChordType.DIM,
    shortcut: "a",
    padNote: 36,
  },
  {
    type: ControlType.CHORD,
    chordType: ChordType.MAJ,
    shortcut: "s",
    padNote: 37,
  },
  {
    type: ControlType.CHORD,
    chordType: ChordType.MIN,
    shortcut: "d",
    padNote: 38,
  },
  {
    type: ControlType.CHORD,
    chordType: ChordType.SUS,
    shortcut: "f",
    padNote: 39,
  },
  {
    type: ControlType.EXTENSION,
    extension: ChordExtension.ADD6,
    shortcut: "q",
    padNote: 40,
  },
  {
    type: ControlType.EXTENSION,
    extension: ChordExtension.MIN7,
    shortcut: "w",
    padNote: 41,
  },
  {
    type: ControlType.EXTENSION,
    extension: ChordExtension.MAJ7,
    shortcut: "e",
    padNote: 42,
  },
  {
    type: ControlType.EXTENSION,
    extension: ChordExtension.ADD9,
    shortcut: "r",
    padNote: 43,
  },
];
