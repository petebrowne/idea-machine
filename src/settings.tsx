import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import {
  Heading,
  IconButton,
  VStack,
  createListCollection,
} from "@chakra-ui/react";
import { useMemo, useRef } from "react";
import { LuSettings } from "react-icons/lu";
import { useShallow } from "zustand/react/shallow";
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
} from "./components/ui/drawer";
import { useMidi } from "./use-midi";

export function SettingsDrawer() {
  const [controllerInput, dawInput, output] = useMidi(
    useShallow((s) => [s.controllerInput, s.dawInput, s.output]),
  );
  const drawerRef = useRef<HTMLDivElement>(null);
  return (
    <DrawerRoot
      size="md"
      defaultOpen={
        controllerInput == null && dawInput == null && output == null
      }
    >
      <DrawerTrigger asChild>
        <IconButton aria-label="Open Settings" color="teal.800">
          <LuSettings />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent ref={drawerRef} backgroundColor="bg.muted">
        <DrawerCloseTrigger />
        <DrawerHeader>
          <Heading size="sm">Settings</Heading>
        </DrawerHeader>
        <DrawerBody>
          <VStack gap={4} alignItems="stretch">
            <ControllerInputSelect portalRef={drawerRef} />
            <DAWInputSelect portalRef={drawerRef} />
            <OutputSelect portalRef={drawerRef} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
}

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
