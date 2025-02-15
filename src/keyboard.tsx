import { Box, Button, type ButtonProps, Grid } from "@chakra-ui/react";

export function Keyboard() {
  return (
    <Box
      backgroundColor="colorPalette.700"
      paddingInline={2}
      paddingBlockEnd={2}
      borderBottomRadius="lg"
      boxShadow="inner"
    >
      <Grid
        templateColumns="repeat(21, 1fr)"
        gridTemplateRows="12rem 4rem"
        isolation="isolate"
        colorPalette="gray"
        gap={2}
      >
        <WhiteKey note="C" gridColumn="1 / 4" gridRow="1 / 3" />
        <WhiteKey note="D" gridColumn="4 / 7" gridRow="1 / 3" />
        <WhiteKey note="E" gridColumn="7 / 10" gridRow="1 / 3" />
        <WhiteKey note="F" gridColumn="10 / 13" gridRow="1 / 3" />
        <WhiteKey note="G" gridColumn="13 / 16" gridRow="1 / 3" />
        <WhiteKey note="A" gridColumn="16 / 19" gridRow="1 / 3" />
        <WhiteKey note="B" gridColumn="19 / 22" gridRow="1 / 3" />

        <BlackKey note="C#" gridColumn="3 / 5" gridRow="1 / 2" />
        <BlackKey note="D#" gridColumn="6 / 8" gridRow="1 / 2" />
        <BlackKey note="F#" gridColumn="12 / 14" gridRow="1 / 2" />
        <BlackKey note="G#" gridColumn="15 / 17" gridRow="1 / 2" />
        <BlackKey note="A#" gridColumn="18 / 20" gridRow="1 / 2" />
      </Grid>
    </Box>
  );
}

interface KeyProps extends ButtonProps {
  note: string;
}

function WhiteKey({ note, ...props }: KeyProps) {
  return (
    <Button
      height="100%"
      borderTopRadius={0}
      alignItems="flex-end"
      paddingBlockEnd={5}
      boxShadow="md"
      {...props}
    >
      {note}
    </Button>
  );
}

function BlackKey({ note, ...props }: KeyProps) {
  return (
    <Button
      variant="subtle"
      position="relative"
      zIndex={1}
      height="100%"
      borderTopRadius={0}
      alignItems="flex-end"
      paddingBlockEnd={5}
      boxShadow="md"
      {...props}
    >
      {note}
    </Button>
  );
}
