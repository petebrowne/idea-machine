import { CheckboxGroup, HStack, Text } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import {
  CheckboxCard,
  type CheckboxCardProps,
} from "./components/ui/checkbox-card";
import {
  RadioCardItem,
  type RadioCardItemProps,
  RadioCardRoot,
} from "./components/ui/radio-card";
import { Chord, ChordExtension } from "./types";
import { useMidi } from "./use-midi";

export function ChordExtensionControls() {
  const [extensions] = useMidi(useShallow((s) => [s.extensions]));
  return (
    <CheckboxGroup value={extensions.map((e) => e.toString())}>
      <HStack gap={3}>
        <CheckboxControl
          label="6"
          shortcut="q"
          value={ChordExtension.ADD6.toString()}
          colorPalette="cyan"
        />
        <CheckboxControl
          label="m7"
          shortcut="w"
          value={ChordExtension.MIN7.toString()}
          colorPalette="pink"
        />
        <CheckboxControl
          label="M7"
          shortcut="e"
          value={ChordExtension.MAJ7.toString()}
          colorPalette="blue"
        />
        <CheckboxControl
          label="9"
          shortcut="r"
          value={ChordExtension.ADD9.toString()}
          colorPalette="yellow"
        />
      </HStack>
    </CheckboxGroup>
  );
}

export function ChordControls() {
  const [chordMode, setChord] = useMidi(
    useShallow((s) => [s.chord, s.setChord]),
  );
  return (
    <RadioCardRoot
      value={chordMode}
      // onValueChange={({ value }) => {
      //   if (includes(Object.values(ChordMode), value)) {
      //     setChord(value);
      //   }
      // }}
      variant="subtle"
    >
      <HStack gap={3}>
        <RadioControl
          label="Dim"
          shortcut="a"
          value={Chord.DIM}
          colorPalette="red"
        />
        <RadioControl
          label="Maj"
          shortcut="s"
          value={Chord.MAJ}
          colorPalette="green"
        />
        <RadioControl
          label="Min"
          shortcut="d"
          value={Chord.MIN}
          colorPalette="orange"
        />
        <RadioControl
          label="Sus"
          shortcut="f"
          value={Chord.SUS}
          colorPalette="purple"
        />
      </HStack>
    </RadioCardRoot>
  );
}

interface RadioControlProps extends RadioCardItemProps {
  shortcut: string;
}

function RadioControl({ label, shortcut, ...props }: RadioControlProps) {
  return (
    <RadioCardItem
      indicator={false}
      label={
        <HStack justifyContent="space-between" width="full">
          <Text color="fg">{label}</Text>
          <Text color="fg.muted">({shortcut})</Text>
        </HStack>
      }
      css={{
        ...rootStyle,
        "& [data-part=item-text]": {
          width: "full",
        },
        "& [data-part=item-control]": {
          ...controlStyle,
        },
      }}
      _checked={{
        ...rootStyleChecked,
        "& [data-part=item-control]": {
          ...controlStyleChecked,
        },
      }}
      {...props}
    />
  );
}

interface CheckboxControlProps extends CheckboxCardProps {
  shortcut: string;
}

function CheckboxControl({ label, shortcut, ...props }: CheckboxControlProps) {
  return (
    <CheckboxCard
      variant="subtle"
      indicator={false}
      label={
        <HStack justifyContent="space-between" width="full">
          <Text color="fg">{label}</Text>
          <Text color="fg.muted">({shortcut})</Text>
        </HStack>
      }
      css={{
        ...rootStyle,
        "& [data-part=label]": {
          width: "full",
        },
        "& [data-part=control]": {
          ...controlStyle,
        },
      }}
      _checked={{
        ...rootStyleChecked,
        "& [data-part=control]": {
          ...controlStyleChecked,
        },
      }}
      {...props}
    />
  );
}

const rootStyle = {
  aspectRatio: 1,
  borderRadius: "md",
  boxShadow:
    "0 4px 0 var(--chakra-colors-color-palette-800), var(--chakra-shadows-md)",
  transform: "translateY(-4px)",
  transitionProperty: "transform, box-shadow",
  transitionDuration: "fastest",
};

const rootStyleChecked = {
  boxShadow:
    "0 0 0 var(--chakra-colors-color-palette-800), 0 0 0 rgba(0, 0, 0, 0)",
  transform: "translateY(0)",
};

const controlStyle = {
  transitionProperty: "box-shadow",
  transitionDuration: "fastest",
  boxShadow: "inset 0 0 0 rgba(0, 0, 0, 0)",
};

const controlStyleChecked = {
  boxShadow: "inset 0 3px 3px rgba(0, 0, 0, 0.5)",
};
