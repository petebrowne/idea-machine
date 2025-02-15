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
import { Slider } from "./components/ui/slider";
import { Switch } from "./components/ui/switch";
import { CONTROLS } from "./constants";
import { ControlType } from "./types";
import { useMidi } from "./use-midi";

export function ChordExtensionControls() {
  const [chordExtensions] = useMidi(useShallow((s) => [s.chordExtensions]));
  return (
    <CheckboxGroup value={chordExtensions.map((e) => e.toString())}>
      <HStack gap={3}>
        {CONTROLS.filter((c) => c.type === ControlType.CHORD_EXTENSION).map(
          (c) => (
            <CheckboxControl
              key={c.chordExtension}
              label={c.label}
              shortcut={c.shortcut}
              value={c.chordExtension.toString()}
              colorPalette={c.color}
            />
          ),
        )}
      </HStack>
    </CheckboxGroup>
  );
}

export function ChordTypeControls() {
  const [chordType] = useMidi(useShallow((s) => [s.chordType]));
  return (
    <RadioCardRoot
      value={chordType}
      // onValueChange={({ value }) => {
      //   if (includes(Object.values(ChordType), value)) {
      //     setChordType(value);
      //   }
      // }}
      variant="subtle"
    >
      <HStack gap={3}>
        {CONTROLS.filter((c) => c.type === ControlType.CHORD_TYPE).map((c) => (
          <RadioControl
            key={c.chordType}
            label={c.label}
            shortcut={c.shortcut}
            value={c.chordType}
            colorPalette={c.color}
          />
        ))}
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
        <HStack justifyContent="space-between" width="full" flexWrap="wrap">
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
        <HStack justifyContent="space-between" width="full" flexWrap="wrap">
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

export function ChordVoicingControl() {
  const [chordVoicing, setChordVoicing] = useMidi(
    useShallow((s) => [s.chordVoicing, s.setChordVoicing]),
  );
  return (
    <Slider
      value={[chordVoicing]}
      onValueChange={({ value: [value] }) => {
        if (value != null) {
          setChordVoicing(value);
        }
      }}
      min={0}
      max={1}
      step={0.01}
      variant="solid"
      label="Voicing"
      css={{
        "& [data-part=track]": {
          backgroundColor: "bg",
        },
        "& [data-part=range]": {
          // backgroundColor: "var(--chakra-colors-color-palette-700)",
        },
        "& [data-part=thumb]": {
          // borderColor: "var(--chakra-colors-color-palette-600)",
          boxShadow: "sm",
          backgroundColor: "fg",
          // borderWidth: 1,
        },
        "& [data-part=label]": {
          ...labelStyle,
        },
      }}
    />
  );
}

export function StickyChordTypeControl() {
  const [stickyChordTypes, setStickyChordTypes] = useMidi(
    useShallow((s) => [s.stickyChordTypes, s.setStickyChordTypes]),
  );
  return (
    <Switch
      checked={stickyChordTypes}
      onCheckedChange={() => setStickyChordTypes(!stickyChordTypes)}
      // variant="raised"
    >
      <Text css={labelStyle}>Sticky Chords</Text>
    </Switch>
  );
}

const labelStyle = {
  // color: "var(--chakra-colors-teal-400)",
  color: "rgba(255, 255, 255, .75)",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "wider",
  fontSize: "xs",
  textShadow: "0px -1px 0px rgba(0, 0, 0, .7)",
  // textShadow:
  // "0px 1px 0px rgba(255, 255, 255, .3), 0px -1px 0px rgba(0, 0, 0, .7)",
};
