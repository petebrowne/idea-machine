import { useEffect } from "react";
import {
  type Input,
  type NoteMessageEvent,
  type Output,
  WebMidi,
} from "webmidi";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { CONTROLS } from "./constants";
import { getChordNotes, playNotes, stopNotes } from "./midi-utils";
import { Chord, type Control, ControlType } from "./types";

interface MidiState {
  enabled: boolean;
  inputs: Input[];
  input: Input | null;
  padChannel: number | null;
  outputs: Output[];
  output: Output | null;
  initialize: VoidFunction;
  chord: Chord | null;
  extensions: number[];
  activeNotes: number[];
  setChord: (chord: Chord) => void;
  setInput: (input: Input | null) => void;
  setInputById: (id: string | null) => void;
  setOutput: (output: Output | null) => void;
  setOutputById: (id: string | null) => void;
  _onKeyDown: (event: KeyboardEvent) => void;
  _onKeyUp: (event: KeyboardEvent) => void;
  _onNoteOn: (event: NoteMessageEvent) => void;
  _onNoteOff: (event: NoteMessageEvent) => void;
  _controlOn: (control: Control) => void;
  _controlOff: (control: Control) => void;
}

export const useMidi = create<MidiState>((set, get) => ({
  enabled: false,
  inputs: [],
  input: null,
  padChannel: 10,
  outputs: [],
  output: null,
  chord: null,
  extensions: [],
  activeNotes: [],

  initialize: async () => {
    await WebMidi.enable();
    set({ enabled: true, inputs: WebMidi.inputs, outputs: WebMidi.outputs });

    const { setInput, setOutput, _onKeyDown, _onKeyUp } = get();
    const inputId = localStorage.getItem("inputId");
    const input = WebMidi.inputs.find((i) => i.id === inputId);
    setInput(input ?? null);
    const outputId = localStorage.getItem("outputId");
    const output = WebMidi.outputs.find((i) => i.id === outputId);
    setOutput(output ?? null);

    window.addEventListener("keydown", _onKeyDown);
    window.addEventListener("keyup", _onKeyUp);
  },

  setChord: (chord: Chord) => {
    set({ chord: chord });
  },

  setInput: (input) => {
    const { input: prevInput, _onNoteOn, _onNoteOff } = get();
    if (prevInput && prevInput !== input) {
      prevInput.removeListener();
    }
    if (input) {
      localStorage.setItem("inputId", input.id);
      input.removeListener();
      input.addListener("noteon", _onNoteOn);
      input.addListener("noteoff", _onNoteOff);
    } else {
      localStorage.removeItem("inputId");
    }
    set({ input });
  },

  setInputById: (id) => {
    const { inputs, setInput } = get();
    const input = inputs.find((i) => i.id === id);
    setInput(input ?? null);
  },

  setOutput: (output) => {
    if (output) {
      localStorage.setItem("outputId", output.id);
    } else {
      localStorage.removeItem("outputId");
    }
    set({ output });
  },

  setOutputById: (id) => {
    const { outputs, setOutput } = get();
    const output = outputs.find((i) => i.id === id);
    setOutput(output ?? null);
  },

  _onKeyDown: (event) => {
    const { _controlOn } = get();
    const control = getControlByKeyboardEvent(event);
    if (control) {
      _controlOn(control);
    }
  },

  _onKeyUp: (event) => {
    const { _controlOff } = get();
    const control = getControlByKeyboardEvent(event);
    if (control) {
      _controlOff(control);
    }
  },

  _onNoteOn: (event) => {
    const { chord, extensions, padChannel, _controlOn } = get();
    console.log("onNoteOn", event.note.identifier, event.note.number, chord);
    const control = getControlByNoteMessageEvent(event, padChannel);
    if (control) {
      _controlOn(control);
      return;
    }
    const chordNotes = getChordNotes(event.note.number, chord, extensions);
    set({ activeNotes: chordNotes });
    const { output } = get();
    if (output) {
      playNotes(output, chordNotes);
    }
  },

  _onNoteOff: (event) => {
    console.log("onNoteOff", event.note.identifier);
    const { output, activeNotes, padChannel, _controlOff } = get();
    const control = getControlByNoteMessageEvent(event, padChannel);
    if (control) {
      _controlOff(control);
      return;
    }
    if (output) {
      stopNotes(output, activeNotes);
    }
  },

  _controlOn: (control: Control) => {
    if (control.type === ControlType.CHORD) {
      set({ chord: control.chord });
      return;
    }
    const { extensions } = get();
    if (!extensions.includes(control.extension)) {
      set({ extensions: [...extensions, control.extension] });
    }
  },

  _controlOff: (control: Control) => {
    if (control.type === ControlType.CHORD) {
      set({ chord: Chord.MAJ });
      return;
    }
    const { extensions } = get();
    set({ extensions: extensions.filter((e) => e !== control.extension) });
  },
}));

function getControlByKeyboardEvent(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.shiftKey) return undefined;
  return CONTROLS.find((c) => c.shortcut === event.key);
}

function getControlByNoteMessageEvent(
  event: NoteMessageEvent,
  padChannel: number | null,
) {
  if (event.message.channel !== padChannel) return undefined;
  return CONTROLS.find((c) => c.padNote === event.note.number);
}

export function useMidiInitialize() {
  const [enabled, initialize] = useMidi(
    useShallow((s) => [s.enabled, s.initialize]),
  );
  useEffect(() => {
    initialize();
  }, [initialize]);
  return enabled;
}
