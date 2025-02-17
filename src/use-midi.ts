import { useEffect } from "react";
import * as Tone from "tone";
import {
  type ControlChangeMessageEvent,
  type Input,
  type MessageEvent,
  type Note,
  type NoteMessageEvent,
  type Output,
  Utilities,
  WebMidi,
} from "webmidi";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { CONTROLS, KEYBOARD_NOTE_MAP } from "./constants";
import { getChord } from "./midi-utils";
import { type Chord, ChordType, type Control, ControlType } from "./types";

const synth = new Tone.PolySynth(Tone.Synth).toDestination();

interface MidiState {
  enabled: boolean;
  inputs: Input[];
  controllerInput: Input | null;
  dawInput: Input | null;
  padChannel: number | null;
  outputs: Output[];
  output: Output | null;
  initialize: VoidFunction;
  stickyChordTypes: boolean;
  chordType: ChordType | null;
  chordExtensions: number[];
  chordVoicing: number;
  activeChords: Chord[];
  _chordTypeStack: ChordType[];
  setStickyChordTypes: (stickyChordTypes: boolean) => void;
  setChordType: (chordType: ChordType) => void;
  setChordVoicing: (chordVoicing: number) => void;
  setControllerInput: (input: Input | null) => void;
  setControllerInputById: (id: string | null) => void;
  setDAWInput: (input: Input | null) => void;
  setDAWInputById: (id: string | null) => void;
  setOutput: (output: Output | null) => void;
  setOutputById: (id: string | null) => void;
  playNote: (note: string | number | Note) => void;
  stopNote: (note: string | number | Note) => void;
  controlOn: (control: Control) => void;
  controlOff: (control: Control) => void;
  _onKeyDown: (event: KeyboardEvent) => void;
  _onKeyUp: (event: KeyboardEvent) => void;
  _onNoteOn: (event: NoteMessageEvent) => void;
  _onNoteOff: (event: NoteMessageEvent) => void;
  _onControlChange: (event: ControlChangeMessageEvent) => void;
  _onPitchBend: (event: MessageEvent) => void;
}

export const useMidi = create<MidiState>((set, get) => ({
  enabled: false,
  inputs: [],
  controllerInput: null,
  dawInput: null,
  padChannel: 10,
  outputs: [],
  output: null,
  stickyChordTypes: true,
  chordType: ChordType.MAJ,
  chordExtensions: [],
  chordVoicing: 0,
  activeChords: [],
  _chordTypeStack: [],

  initialize: async () => {
    await WebMidi.enable();
    set({ enabled: true, inputs: WebMidi.inputs, outputs: WebMidi.outputs });

    const { setControllerInput, setDAWInput, setOutput, _onKeyDown, _onKeyUp } =
      get();
    const controllerInputId = localStorage.getItem("controllerInputId");
    const controllerInput = WebMidi.inputs.find(
      (input) => input.id === controllerInputId,
    );
    setControllerInput(controllerInput ?? null);

    const dawInputId = localStorage.getItem("dawInputId");
    const dawInput = WebMidi.inputs.find((input) => input.id === dawInputId);
    setDAWInput(dawInput ?? null);

    const outputId = localStorage.getItem("outputId");
    const output = WebMidi.outputs.find((input) => input.id === outputId);
    setOutput(output ?? null);

    window.addEventListener("keydown", _onKeyDown);
    window.addEventListener("keyup", _onKeyUp);
  },

  setStickyChordTypes: (stickyChordTypes: boolean) => {
    set({ stickyChordTypes });
  },

  setChordType: (chordType: ChordType) => {
    set({ chordType });
  },

  setChordVoicing: (chordVoicing: number) => {
    set({ chordVoicing });
  },

  setControllerInput: (input) => {
    const {
      controllerInput: prevInput,
      _onNoteOn,
      _onNoteOff,
      _onControlChange,
      _onPitchBend,
    } = get();
    if (prevInput && prevInput !== input) {
      prevInput.removeListener();
    }
    if (input) {
      localStorage.setItem("controllerInputId", input.id);
      input.removeListener();
      input.addListener("noteon", _onNoteOn);
      input.addListener("noteoff", _onNoteOff);
      input.addListener("controlchange", _onControlChange);
      input.addListener("pitchbend", _onPitchBend);
    } else {
      localStorage.removeItem("controllerInputId");
    }
    set({ controllerInput: input });
  },

  setControllerInputById: (id) => {
    const { inputs, setControllerInput } = get();
    const input = inputs.find((i) => i.id === id);
    setControllerInput(input ?? null);
  },

  setDAWInput: (input) => {
    const { dawInput: prevInput } = get();
    if (prevInput && prevInput !== input) {
      prevInput.removeListener();
    }
    if (input) {
      localStorage.setItem("dawInputId", input.id);
      input.removeListener();

      // TODO: setup arpeggiator and sync with DAW
      input.addListener("start", () => {
        console.log("Transport started");
      });
      input.addListener("stop", () => {
        console.log("Transport stopped");
      });
      input.addListener("continue", () => {
        console.log("Transport continued");
      });

      let lastClockTime = performance.now();
      let clockCount = 0;
      input.addListener("clock", () => {
        clockCount++;

        if (clockCount >= 24) {
          const currentTime = performance.now();
          const timeDiff = currentTime - lastClockTime;
          const bpm = Math.round(60000 / timeDiff);

          console.log("bpm", bpm);

          clockCount = 0;
          lastClockTime = currentTime;
        }
      });

      input.addListener("controlchange", (event) =>
        console.log("controlchange", event),
      );
      input.addListener("songposition", (event) =>
        console.log("songposition", event),
      );
    } else {
      localStorage.removeItem("dawInputId");
    }
    set({ dawInput: input });
  },

  setDAWInputById: (id) => {
    const { inputs, setDAWInput } = get();
    const input = inputs.find((i) => i.id === id);
    setDAWInput(input ?? null);
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

  playNote: (note: string | number | Note) => {
    const { output, chordType, chordExtensions, chordVoicing, activeChords } =
      get();
    const noteObject = Utilities.buildNote(note);
    if (activeChords.some((c) => c.activeNote.number === noteObject.number)) {
      return;
    }
    const chord = getChord(
      noteObject,
      chordType,
      chordExtensions,
      chordVoicing,
    );
    set({ activeChords: [...activeChords, chord] });
    if (output) {
      // console.group("play -", chord.notes.map((n) => n.identifier).join(" "));
      output.playNote(chord.notes);
    } else {
      synth.triggerAttack(chord.notes.map((n) => n.identifier));
    }
  },

  stopNote: (note: string | number | Note) => {
    const { output, activeChords } = get();
    const noteNumber = Utilities.buildNote(note).number;
    const activeChord = activeChords.find(
      (c) => c.activeNote.number === noteNumber,
    );
    const newActiveChords = activeChords.filter((c) => c !== activeChord);
    set({ activeChords: newActiveChords });
    if (!activeChord) return;

    if (output) {
      // console.log(
      //   "stop -",
      //   activeChord.notes.map((n) => n.identifier).join(" "),
      // );
      // console.groupEnd();
      output.stopNote(activeChord.notes);
    } else {
      synth.triggerRelease(activeChord.notes.map((n) => n.identifier));
    }
  },

  controlOn: (control: Control) => {
    if (control.type === ControlType.CHORD_TYPE) {
      const {
        _chordTypeStack,
        chordType: activeChordType,
        stickyChordTypes,
      } = get();
      if (stickyChordTypes) {
        const newChordType =
          activeChordType === control.chordType ? null : control.chordType;
        set({ _chordTypeStack: [], chordType: newChordType });
        return;
      }
      const newChordTypeStack = _chordTypeStack.includes(control.chordType)
        ? _chordTypeStack
        : [..._chordTypeStack, control.chordType];
      set({ _chordTypeStack: newChordTypeStack, chordType: control.chordType });
      return;
    }
    const { chordExtensions } = get();
    if (!chordExtensions.includes(control.chordExtension)) {
      set({ chordExtensions: [...chordExtensions, control.chordExtension] });
    }
  },

  controlOff: (control: Control) => {
    if (control.type === ControlType.CHORD_TYPE) {
      const { _chordTypeStack, stickyChordTypes } = get();
      if (stickyChordTypes) {
        return;
      }
      const newChordTypeStack = _chordTypeStack.slice(0, -1);
      set({
        _chordTypeStack: newChordTypeStack,
        chordType: newChordTypeStack[newChordTypeStack.length - 1] ?? null,
      });
      return;
    }
    const { chordExtensions } = get();
    set({
      chordExtensions: chordExtensions.filter(
        (e) => e !== control.chordExtension,
      ),
    });
  },

  _onKeyDown: (event) => {
    const { controlOn: _controlOn, playNote } = get();
    const control = getControlByKeyboardEvent(event);
    if (control) {
      _controlOn(control);
      return;
    }
    const note = KEYBOARD_NOTE_MAP[event.key];
    if (note) {
      playNote(note);
    }
  },

  _onKeyUp: (event) => {
    const { controlOff: _controlOff, stopNote } = get();
    const control = getControlByKeyboardEvent(event);
    if (control) {
      _controlOff(control);
      return;
    }
    const note = KEYBOARD_NOTE_MAP[event.key];
    if (note) {
      stopNote(note);
    }
  },

  _onNoteOn: (event) => {
    const { padChannel, controlOn: _controlOn, playNote } = get();
    const control = getControlByNoteMessageEvent(event, padChannel);
    if (control) {
      _controlOn(control);
      return;
    }
    playNote(event.note);
  },

  _onNoteOff: (event) => {
    const { padChannel, controlOff: _controlOff, stopNote } = get();
    const control = getControlByNoteMessageEvent(event, padChannel);
    if (control) {
      _controlOff(control);
      return;
    }
    stopNote(event.note);
  },

  _onControlChange: (event) => {
    if (event.controller.number === 5 && typeof event.value === "number") {
      set({ chordVoicing: event.value });
      return;
    }
    console.log(
      "onControlChange",
      event.controller.name,
      event.controller.number,
      event.value,
    );
  },

  _onPitchBend: (event) => {
    const { output } = get();
    if (output && typeof event.value === "number") {
      output.sendPitchBend(event.value);
    }
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
