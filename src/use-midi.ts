import { useEffect } from "react";
import {
  type ControlChangeMessageEvent,
  type Input,
  type MessageEvent,
  type NoteMessageEvent,
  type Output,
  WebMidi,
} from "webmidi";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { CONTROLS } from "./constants";
import { getChord } from "./midi-utils";
import { type Chord, type ChordType, type Control, ControlType } from "./types";

interface MidiState {
  enabled: boolean;
  inputs: Input[];
  controllerInput: Input | null;
  dawInput: Input | null;
  padChannel: number | null;
  outputs: Output[];
  output: Output | null;
  initialize: VoidFunction;
  chordType: ChordType | null;
  extensions: number[];
  activeChords: Chord[];
  _chordTypeStack: ChordType[];
  setChordType: (chordType: ChordType) => void;
  setControllerInput: (input: Input | null) => void;
  setControllerInputById: (id: string | null) => void;
  setDAWInput: (input: Input | null) => void;
  setDAWInputById: (id: string | null) => void;
  setOutput: (output: Output | null) => void;
  setOutputById: (id: string | null) => void;
  _onKeyDown: (event: KeyboardEvent) => void;
  _onKeyUp: (event: KeyboardEvent) => void;
  _onNoteOn: (event: NoteMessageEvent) => void;
  _onNoteOff: (event: NoteMessageEvent) => void;
  _onControlChange: (event: ControlChangeMessageEvent) => void;
  _onPitchBend: (event: MessageEvent) => void;
  _controlOn: (control: Control) => void;
  _controlOff: (control: Control) => void;
  isPlaying: boolean;
  tempo: number;
}

// interface Chord {
//   pressedNote: Note
//   notes: Note[];
// }

export const useMidi = create<MidiState>((set, get) => ({
  enabled: false,
  inputs: [],
  controllerInput: null,
  dawInput: null,
  padChannel: 10,
  outputs: [],
  output: null,
  chordType: null,
  extensions: [],
  activeChords: [],
  _chordTypeStack: [],
  isPlaying: false,
  tempo: 120,

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

  setChordType: (chordType: ChordType) => {
    set({ chordType });
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
    const {
      chordType,
      extensions,
      padChannel,
      _controlOn,
      activeChords,
      output,
    } = get();
    const control = getControlByNoteMessageEvent(event, padChannel);
    if (control) {
      _controlOn(control);
      return;
    }
    const chord = getChord(event.note, chordType, extensions);
    set({ activeChords: [...activeChords, chord] });
    if (output) {
      console.log(
        "playNotes",
        chord.notes.map((n) => n.identifier),
      );
      output.playNote(chord.notes);
    }
  },

  _onNoteOff: (event) => {
    const { output, activeChords, padChannel, _controlOff } = get();
    const control = getControlByNoteMessageEvent(event, padChannel);
    const activeChord = activeChords.find((c) =>
      c.notes.some((n) => n.number === event.note.number),
    );
    const newActiveChords = activeChords.filter((c) => c !== activeChord);
    set({ activeChords: newActiveChords });
    if (control) {
      _controlOff(control);
      return;
    }
    if (output && activeChord) {
      output.stopNote(activeChord.notes);
    }
  },

  _onControlChange: (event) => {
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

  _controlOn: (control: Control) => {
    if (control.type === ControlType.CHORD) {
      const { _chordTypeStack } = get();
      const newChordTypeStack = _chordTypeStack.includes(control.chordType)
        ? _chordTypeStack
        : [..._chordTypeStack, control.chordType];
      set({ _chordTypeStack: newChordTypeStack, chordType: control.chordType });
      return;
    }
    const { extensions } = get();
    if (!extensions.includes(control.extension)) {
      set({ extensions: [...extensions, control.extension] });
    }
  },

  _controlOff: (control: Control) => {
    if (control.type === ControlType.CHORD) {
      const { _chordTypeStack } = get();
      const newChordTypeStack = _chordTypeStack.slice(0, -1);
      set({
        _chordTypeStack: newChordTypeStack,
        chordType: newChordTypeStack[newChordTypeStack.length - 1] ?? null,
      });
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
