import { Box, Text, useApp, useInput } from "ink";
import { useState } from "react";
import { Header } from "./Header.js";
import { EventList } from "./EventList.js";
import { StatusBar } from "./StatusBar.js";

const isRawModeSupported = process.stdin.isTTY ?? false;

export function App() {
  const { exit } = useApp();
  const [view, setView] = useState<"events" | "portfolio" | "search">("events");

  useInput((input, key) => {
    if (input === "q" || (key.ctrl && input === "c")) {
      exit();
    }
    if (input === "e") setView("events");
    if (input === "p") setView("portfolio");
    if (input === "s") setView("search");
  }, { isActive: isRawModeSupported });

  return (
    <Box flexDirection="column" width="100%">
      <Header currentView={view} />
      <Box flexDirection="column" flexGrow={1} paddingX={1}>
        {view === "events" && <EventList />}
        {view === "portfolio" && (
          <Box>
            <Text color="gray">Portfolio view coming soon...</Text>
          </Box>
        )}
        {view === "search" && (
          <Box>
            <Text color="gray">Search view coming soon...</Text>
          </Box>
        )}
      </Box>
      <StatusBar />
    </Box>
  );
}
