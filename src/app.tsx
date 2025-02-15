import {
  Center,
  HStack,
  Heading,
  IconButton,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { LuSettings } from "react-icons/lu";
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
} from "./components/ui/drawer";
import { ChordControls, ChordExtensionControls } from "./controls";
import { Keyboard } from "./keyboard";
import { InputSelect, OutputSelect } from "./settings";
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
      maxWidth="4xl"
      marginInline="auto"
      paddingInline={6}
      paddingBlock={12}
      gap={6}
      alignItems="stretch"
    >
      <HStack gap={6} justifyContent="space-between">
        <Heading size="lg" fontWeight="bold" color="teal.500">
          Idea Machine
        </Heading>
        <DrawerRoot size="md">
          <DrawerTrigger asChild>
            <IconButton aria-label="Open Settings" variant="ghost">
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
                <InputSelect portalRef={drawerRef} />
                <OutputSelect portalRef={drawerRef} />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerRoot>
      </HStack>
      <HStack gap={6} alignItems="flex-start">
        <VStack
          gap={6}
          alignItems="stretch"
          flex={1}
          layerStyle="fill.solid"
          boxShadow="inset 0 0 5px 1px var(--chakra-colors-color-palette-500), 0 15px var(--chakra-colors-color-palette-700)"
          colorPalette="teal"
          borderTopRadius="sm"
          borderBottomRadius="xl"
          padding={9}
        >
          <VStack gap={3} alignItems="stretch" colorPalette="gray">
            <ChordExtensionControls />
            <ChordControls />
          </VStack>
          <Keyboard />
        </VStack>
      </HStack>
    </VStack>
  );
}
