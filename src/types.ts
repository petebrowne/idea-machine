export const Chord = {
  MAJ: "MAJ",
  MIN: "MIN",
  DIM: "DIM",
  SUS: "SUS",
} as const;
export type Chord = (typeof Chord)[keyof typeof Chord];

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
  chord: Chord;
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
