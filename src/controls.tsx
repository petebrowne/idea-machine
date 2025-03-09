import {
  Button,
  ButtonGroup,
  type ButtonProps,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { Slider } from "./components/ui/slider";
import { Switch } from "./components/ui/switch";
import { CONTROLS } from "./constants";
import { ControlType } from "./types";
import { useMidi } from "./use-midi";

export function ChordExtensionControls() {
  const [chordExtensions, controlOn, controlOff] = useMidi(
    useShallow((s) => [s.chordExtensions, s.controlOn, s.controlOff]),
  );
  return (
    <ButtonGroup width="full">
      {CONTROLS.filter((c) => c.type === ControlType.CHORD_EXTENSION).map(
        (c) => (
          <ControlButton
            key={c.chordExtension}
            label={c.label}
            shortcut={c.shortcut}
            colorPalette={c.color}
            active={chordExtensions.includes(c.chordExtension)}
            flex={1}
            onActiveChange={(active) => {
              if (active) {
                controlOn(c);
              } else {
                controlOff(c);
              }
            }}
          />
        ),
      )}
    </ButtonGroup>
  );
}

interface ControlButtonProps extends ButtonProps {
  label: string;
  shortcut: string;
  active?: boolean;
  onActiveChange: (active: boolean) => void;
}

function ControlButton({
  label,
  shortcut,
  active,
  onActiveChange,
  ...props
}: ControlButtonProps) {
  return (
    <Button
      variant="subtle"
      aspectRatio={1}
      height="auto"
      paddingBlock={2}
      // width="auto"
      borderRadius="md"
      boxShadow="inset 0 0 0 rgba(0, 0, 0, 0), 0 4px 0 var(--chakra-colors-color-palette-800), var(--chakra-shadows-md)"
      transform="translateY(-4px)"
      transitionProperty="transform, box-shadow, background-color, color"
      transitionDuration="fast"
      alignItems="flex-end"
      backgroundColor="bg.muted"
      color="fg"
      data-active={active ? "true" : undefined}
      focusRing="inside"
      _active={{
        backgroundColor: "colorPalette.muted",
        color: "colorPalette.fg",
        boxShadow:
          "inset 0 3px 3px rgba(0, 0, 0, 0.5), 0 0 0 var(--chakra-colors-color-palette-800), 0 0 0 rgba(0, 0, 0, 0)",
        transform: "translateY(0)",
      }}
      onMouseDown={() => onActiveChange(true)}
      onMouseUp={() => onActiveChange(false)}
      onMouseLeave={() => onActiveChange(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onActiveChange(true);
        }
      }}
      onKeyUp={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onActiveChange(false);
        }
      }}
      {...props}
    >
      <HStack justifyContent="space-between" width="full">
        <Text>{label}</Text>
        <Text color="fg.muted">({shortcut})</Text>
      </HStack>
    </Button>
  );
}

export function ChordTypeControls() {
  const [chordType, controlOn, controlOff] = useMidi(
    useShallow((s) => [s.chordType, s.controlOn, s.controlOff]),
  );
  return (
    <ButtonGroup width="full">
      {CONTROLS.filter((c) => c.type === ControlType.CHORD_TYPE).map((c) => (
        <ControlButton
          key={c.chordType}
          label={c.label}
          shortcut={c.shortcut}
          colorPalette={c.color}
          active={chordType === c.chordType}
          flex={1}
          onActiveChange={(active) => {
            if (active) {
              controlOn(c);
            } else {
              controlOff(c);
            }
          }}
        />
      ))}
    </ButtonGroup>
  );
}

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
