import { Box, Text } from "ink";

interface HeaderProps {
  currentView: "markets" | "portfolio" | "search";
}

export function Header({ currentView }: HeaderProps) {
  const tabs = [
    { key: "markets", label: "Markets", hotkey: "m" },
    { key: "portfolio", label: "Portfolio", hotkey: "p" },
    { key: "search", label: "Search", hotkey: "s" },
  ] as const;

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      borderStyle="single"
      borderColor="cyan"
      paddingX={1}
    >
      <Box>
        <Text bold color="cyan">
          PMKT
        </Text>
        <Text color="gray"> | Polymarket Terminal</Text>
      </Box>
      <Box gap={2}>
        {tabs.map((tab) => (
          <Box key={tab.key}>
            <Text
              color={currentView === tab.key ? "cyan" : "gray"}
              bold={currentView === tab.key}
            >
              [{tab.hotkey}] {tab.label}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
