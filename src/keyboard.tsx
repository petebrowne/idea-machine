import { Button, type ButtonProps, Grid, HStack } from "@chakra-ui/react";
import { useShallow } from "zustand/shallow";
import { useMidi } from "./use-midi";

export function Keyboard() {
  return (
    <HStack
      backgroundColor="colorPalette.700"
      paddingInline={2}
      paddingBlockEnd={2}
      borderBottomRadius="lg"
      boxShadow="inner"
      gap={1}
    >
      <Scale octave={3} />
      <Scale octave={4} />
    </HStack>
  );
}

interface ScaleProps {
  octave: number;
}

function Scale({ octave }: ScaleProps) {
  return (
    <Grid
      templateColumns="repeat(21, 1fr)"
      gridTemplateRows="12rem 4rem"
      isolation="isolate"
      colorPalette="gray"
      gap={1}
      flex={1}
    >
      <WhiteKey note={`C${octave}`} gridColumn="1 / 4" gridRow="1 / 3" />
      <BlackKey note={`C#${octave}`} gridColumn="3 / 5" gridRow="1 / 2" />
      <WhiteKey note={`D${octave}`} gridColumn="4 / 7" gridRow="1 / 3" />
      <BlackKey note={`D#${octave}`} gridColumn="6 / 8" gridRow="1 / 2" />
      <WhiteKey note={`E${octave}`} gridColumn="7 / 10" gridRow="1 / 3" />
      <WhiteKey note={`F${octave}`} gridColumn="10 / 13" gridRow="1 / 3" />
      <BlackKey note={`F#${octave}`} gridColumn="12 / 14" gridRow="1 / 2" />
      <WhiteKey note={`G${octave}`} gridColumn="13 / 16" gridRow="1 / 3" />
      <BlackKey note={`G#${octave}`} gridColumn="15 / 17" gridRow="1 / 2" />
      <WhiteKey note={`A${octave}`} gridColumn="16 / 19" gridRow="1 / 3" />
      <BlackKey note={`A#${octave}`} gridColumn="18 / 20" gridRow="1 / 2" />
      <WhiteKey note={`B${octave}`} gridColumn="19 / 22" gridRow="1 / 3" />
    </Grid>
  );
}

interface KeyProps extends ButtonProps {
  note: string;
}

function WhiteKey(props: KeyProps) {
  return (
    <Key
      _highlighted={{
        backgroundColor: "orange.200",
      }}
      {...props}
    />
  );
}

function BlackKey(props: KeyProps) {
  return (
    <Key
      variant="subtle"
      position="relative"
      zIndex={1}
      _highlighted={{
        backgroundColor: "orange.800",
      }}
      {...props}
    />
  );
}

function Key({ note, ...props }: KeyProps) {
  const [activeChords, playNote, stopNote] = useMidi(
    useShallow((m) => [m.activeChords, m.playNote, m.stopNote]),
  );
  const active = activeChords.some(
    (chord) => chord.activeNote.identifier === note,
  );
  const highlighted = activeChords.some((chord) =>
    chord.notes.some((n) => n.identifier === note),
  );
  return (
    <Button
      height="100%"
      borderTopRadius={0}
      alignItems="flex-end"
      boxShadow="md"
      data-active={active ? "true" : undefined}
      data-highlighted={highlighted ? "true" : undefined}
      fontSize="2xs"
      padding={0}
      minWidth={2}
      transformOrigin="top"
      _after={{
        content: '""',
        position: "absolute",
        bottom: 6,
        left: "50%",
        transform: "translateX(-50%)",
        width: "50%",
        aspectRatio: "1 / 1",
        backgroundColor: "transparent",
        borderRadius: "full",
        zIndex: 2,
      }}
      css={{
        _active: {
          transform: "rotateX(7deg)",
          boxShadow: "sm",
          _after: {
            backgroundColor: "blue.500",
          },
        },
        _highlighted: {
          transform: "rotateX(7deg)",
          boxShadow: "sm",
        },
      }}
      onMouseDown={() => playNote(note)}
      onMouseUp={() => stopNote(note)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          playNote(note);
        }
      }}
      onKeyUp={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          stopNote(note);
        }
      }}
      {...props}
    >
      {note}
    </Button>
  );
}
