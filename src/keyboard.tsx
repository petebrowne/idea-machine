import { Button, type ButtonProps, Grid, HStack } from "@chakra-ui/react";
import { useMidi } from "./use-midi";

export function Keyboard() {
  return (
    <HStack
      backgroundColor="colorPalette.700"
      paddingInline={2}
      paddingBlockEnd={2}
      borderBottomRadius="lg"
      boxShadow="inner"
      gap={2}
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
      gap={2}
    >
      <WhiteKey note={`C${octave}`} gridColumn="1 / 4" gridRow="1 / 3" />
      <WhiteKey note={`D${octave}`} gridColumn="4 / 7" gridRow="1 / 3" />
      <WhiteKey note={`E${octave}`} gridColumn="7 / 10" gridRow="1 / 3" />
      <WhiteKey note={`F${octave}`} gridColumn="10 / 13" gridRow="1 / 3" />
      <WhiteKey note={`G${octave}`} gridColumn="13 / 16" gridRow="1 / 3" />
      <WhiteKey note={`A${octave}`} gridColumn="16 / 19" gridRow="1 / 3" />
      <WhiteKey note={`B${octave}`} gridColumn="19 / 22" gridRow="1 / 3" />
      <BlackKey note={`C#${octave}`} gridColumn="3 / 5" gridRow="1 / 2" />
      <BlackKey note={`D#${octave}`} gridColumn="6 / 8" gridRow="1 / 2" />
      <BlackKey note={`F#${octave}`} gridColumn="12 / 14" gridRow="1 / 2" />
      <BlackKey note={`G#${octave}`} gridColumn="15 / 17" gridRow="1 / 2" />
      <BlackKey note={`A#${octave}`} gridColumn="18 / 20" gridRow="1 / 2" />
    </Grid>
  );
}

interface KeyProps extends ButtonProps {
  note: string;
}

function WhiteKey(props: KeyProps) {
  return (
    <Key
      _active={{
        backgroundColor: "blue.300",
      }}
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
      _active={{
        backgroundColor: "blue.700",
      }}
      _highlighted={{
        backgroundColor: "orange.800",
      }}
      {...props}
    />
  );
}

function Key({ note, ...props }: KeyProps) {
  const activeChords = useMidi((m) => m.activeChords);
  const active = activeChords.some(
    (chord) => chord.activeNote.identifier === note,
  );
  const highlighted =
    !active &&
    activeChords.some((chord) =>
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
      transformOrigin="top"
      css={{
        _active: {
          transform: "rotateX(7deg)",
          boxShadow: "sm",
        },
        _highlighted: {
          transform: "rotateX(7deg)",
          boxShadow: "sm",
        },
      }}
      {...props}
    >
      {note}
    </Button>
  );
}
