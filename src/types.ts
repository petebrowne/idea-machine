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
  CHORD_TYPE: "CHORD_TYPE",
  CHORD_EXTENSION: "CHORD_EXTENSION",
} as const;
export type ControlType = (typeof ControlType)[keyof typeof ControlType];

export type ChordTypeControl = {
  type: typeof ControlType.CHORD_TYPE;
  chordType: ChordType;
  label: string;
  color: string;
  shortcut: string;
  padNote: number;
};

export type ChordExtensionControl = {
  type: typeof ControlType.CHORD_EXTENSION;
  chordExtension: ChordExtension;
  label: string;
  color: string;
  shortcut: string;
  padNote: number;
};

export type Control = ChordTypeControl | ChordExtensionControl;
