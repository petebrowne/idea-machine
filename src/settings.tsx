import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { createListCollection } from "@chakra-ui/react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useMidi } from "./use-midi";

interface SelectProps {
  portalRef?: React.RefObject<HTMLDivElement | null>;
}

export function ControllerInputSelect({ portalRef }: SelectProps) {
  const [inputs, controllerInput, setControllerInputById] = useMidi(
    useShallow((s) => [s.inputs, s.controllerInput, s.setControllerInputById]),
  );
  const inputsCollection = useMemo(
    () =>
      createListCollection({
        items: inputs.map((input) => ({
          label: input.name,
          value: input.id,
        })),
      }),
    [inputs],
  );
  return (
    <SelectRoot
      collection={inputsCollection}
      value={controllerInput?.id ? [controllerInput.id] : []}
      onValueChange={({ value: [value] }) => {
        setControllerInputById(value ?? null);
      }}
    >
      <SelectLabel>MIDI Controller Input</SelectLabel>
      <SelectTrigger clearable>
        <SelectValueText placeholder="Select input" />
      </SelectTrigger>
      <SelectContent portalRef={portalRef}>
        {inputsCollection.items.map((input) => (
          <SelectItem item={input} key={input.value}>
            {input.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}

export function DAWInputSelect({ portalRef }: SelectProps) {
  const [inputs, dawInput, setDAWInputById] = useMidi(
    useShallow((s) => [s.inputs, s.dawInput, s.setDAWInputById]),
  );
  const inputsCollection = useMemo(
    () =>
      createListCollection({
        items: inputs.map((input) => ({
          label: input.name,
          value: input.id,
        })),
      }),
    [inputs],
  );
  return (
    <SelectRoot
      collection={inputsCollection}
      value={dawInput?.id ? [dawInput.id] : []}
      onValueChange={({ value: [value] }) => {
        setDAWInputById(value ?? null);
      }}
    >
      <SelectLabel>DAW Input</SelectLabel>
      <SelectTrigger clearable>
        <SelectValueText placeholder="Select input" />
      </SelectTrigger>
      <SelectContent portalRef={portalRef}>
        {inputsCollection.items.map((input) => (
          <SelectItem item={input} key={input.value}>
            {input.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}

export function OutputSelect({ portalRef }: SelectProps) {
  const [outputs, output, setOutputById] = useMidi(
    useShallow((s) => [s.outputs, s.output, s.setOutputById]),
  );
  const outputsCollection = useMemo(
    () =>
      createListCollection({
        items: outputs.map((output) => ({
          label: output.name,
          value: output.id,
        })),
      }),
    [outputs],
  );
  return (
    <SelectRoot
      collection={outputsCollection}
      value={output?.id ? [output.id] : []}
      onValueChange={({ value: [value] }) => {
        setOutputById(value ?? null);
      }}
    >
      <SelectLabel>Output</SelectLabel>
      <SelectTrigger clearable>
        <SelectValueText placeholder="Select output" />
      </SelectTrigger>
      <SelectContent portalRef={portalRef}>
        {outputsCollection.items.map((output) => (
          <SelectItem item={output} key={output.value}>
            {output.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
