import { Box, Text, useApp, useInput } from "ink";
import { useState } from "react";
import { Header } from "./Header.js";
import { MarketList } from "./MarketList.js";
import { StatusBar } from "./StatusBar.js";

export function App() {
  const { exit } = useApp();
  const [view, setView] = useState<"markets" | "portfolio" | "search">("markets");

  useInput((input, key) => {
    if (input === "q" || (key.ctrl && input === "c")) {
      exit();
    }
    if (input === "m") setView("markets");
    if (input === "p") setView("portfolio");
    if (input === "s") setView("search");
  });

  return (
    <Box flexDirection="column" width="100%">
      <Header currentView={view} />
      <Box flexDirection="column" flexGrow={1} paddingX={1}>
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
