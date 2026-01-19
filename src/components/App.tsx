import { Box, Text, useApp, useInput, useStdout } from "ink";
import { useEffect } from "react";
import { Header } from "./Header.js";
import { EventList } from "./EventList.js";
import { MarketList } from "./MarketList.js";
import { StatusBar } from "./StatusBar.js";
import { useAppStore } from "../store/index.js";

const isRawModeSupported = process.stdin.isTTY ?? false;

export function App() {
  const { exit } = useApp();
  const { view, setView } = useAppStore();
  const { stdout } = useStdout();

  // Enter alternate screen buffer for fullscreen mode
  useEffect(() => {
    stdout.write("\x1b[?1049h"); // Enter alternate screen
    stdout.write("\x1b[?25l");   // Hide cursor
    return () => {
      stdout.write("\x1b[?25h"); // Show cursor
      stdout.write("\x1b[?1049l"); // Exit alternate screen
    };
  }, [stdout]);

  useInput((input, key) => {
    if (input === "q" || (key.ctrl && input === "c")) {
      exit();
    }
    if (view !== "markets") {
      if (input === "e") setView("events");
      if (input === "p") setView("portfolio");
      if (input === "s") setView("search");
    }
  }, { isActive: isRawModeSupported });

  return (
    <Box flexDirection="column" width="100%">
      <Header currentView={view} />
      <Box flexDirection="column" flexGrow={1} paddingX={1}>
        {view === "events" && <EventList />}
        {view === "markets" && <MarketList />}
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
