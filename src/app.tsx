import {
  Box,
  Center,
  HStack,
  Heading,
  IconButton,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { LuLightbulb, LuSettings } from "react-icons/lu";
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
} from "./components/ui/drawer";
import {
  ChordExtensionControls,
  ChordTypeControls,
  ChordVoicingControl,
  StickyChordTypeControl,
} from "./controls";
import { Keyboard } from "./keyboard";
import {
  ControllerInputSelect,
  DAWInputSelect,
  OutputSelect,
} from "./settings";
import { useMidiInitialize } from "./use-midi";

export function App() {
  const enabled = useMidiInitialize();
  const drawerRef = useRef<HTMLDivElement>(null);
  if (!enabled) {
    return (
      <Center
        height="100%"
        data-state="open"
        animationDuration="slow"
        animationStyle={{ _open: "scale-fade-in" }}
      >
        <VStack gap={4}>
          <Spinner size="xl" color="colorPalette.fg" colorPalette="purple" />
          <Text>Allow Access to MIDI to get Started</Text>
        </VStack>
      </Center>
    );
  }
  return (
    <VStack
      data-state="open"
      animationStyle={{ _open: "scale-fade-in" }}
      animationDuration="slowest"
      width="100%"
      maxWidth="5xl"
      marginInline="auto"
      paddingInline={6}
      paddingBlock={12}
      gap={6}
      alignItems="stretch"
    >
      <VStack
        gap={6}
        alignItems="stretch"
        flex={1}
        layerStyle="fill.solid"
        boxShadow="inset 0 0 5px 1px var(--chakra-colors-color-palette-500), 0 15px var(--chakra-colors-color-palette-700)"
        colorPalette="teal"
        borderTopRadius="sm"
        borderBottomRadius="xl"
        paddingInline={9}
        paddingBlockStart={4}
        paddingBlockEnd={9}
      >
        <HStack gap={6} alignItems="center" justifyContent="space-between">
          <Heading
            size="xl"
            fontWeight="bold"
            color="teal.800"
            textShadow="0 1px 0 rgba(255, 255, 255, .3), 0 -1px 0 rgba(0, 0, 0, .7)"
          >
            <HStack gap={2} alignItems="center">
              <LuLightbulb />
              <span>Idea Machine</span>
            </HStack>
          </Heading>
          <DrawerRoot size="md">
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
        </HStack>
        <VStack gap={3} alignItems="stretch" colorPalette="gray">
          <ChordExtensionControls />
          <ChordTypeControls />
        </VStack>
        <Keyboard />
        <HStack
          gap={9}
          alignItems="flex-end"
          backgroundColor="bg.muted/80"
          borderRadius="md"
          boxShadow="inset 0 2px 4px 0 rgba(0, 0, 0, .5), 0 0 5px 1px var(--chakra-colors-color-palette-500)"
          padding={6}
        >
          <Box flex={1}>
            <ChordVoicingControl />
          </Box>
          <Box>
            <StickyChordTypeControl />
          </Box>
        </HStack>
      </VStack>
    </VStack>
  );
}
