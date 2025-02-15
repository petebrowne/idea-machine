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

export function InputSelect({ portalRef }: SelectProps) {
  const [inputs, input, setInputById] = useMidi(
    useShallow((s) => [s.inputs, s.input, s.setInputById]),
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
      value={input?.id ? [input.id] : []}
      onValueChange={({ value: [value] }) => {
        if (value) {
          setInputById(value);
        }
      }}
    >
      <SelectLabel>Input</SelectLabel>
      <SelectTrigger>
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
        if (value) {
          setOutputById(value);
        }
      }}
    >
      <SelectLabel>Output</SelectLabel>
      <SelectTrigger>
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
