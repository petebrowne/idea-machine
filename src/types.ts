import type { Note } from "webmidi";

export interface Chord {
  activeNote: Note;
  notes: Note[];
}

export const ChordType = {
  MAJ: "MAJ",
  MIN: "MIN",
  DIM: "DIM",
  SUS: "SUS",
} as const;
export type ChordType = (typeof ChordType)[keyof typeof ChordType];

export const ChordExtension = {
  ADD6: 9,
  MIN7: 10,
  MAJ7: 11,
  ADD9: 14,
} as const;
export type ChordExtension =
  (typeof ChordExtension)[keyof typeof ChordExtension];

export const ControlType = {
  CHORD: "CHORD",
  EXTENSION: "EXTENSION",
} as const;
export type ControlType = (typeof ControlType)[keyof typeof ControlType];

export type ChordControl = {
  type: typeof ControlType.CHORD;
  chordType: ChordType;
  shortcut: string;
  padNote: number;
};

export type ExtensionControl = {
  type: typeof ControlType.EXTENSION;
  extension: ChordExtension;
  shortcut: string;
  padNote: number;
};

export type Control = ChordControl | ExtensionControl;
