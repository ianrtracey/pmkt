import { Box, Text } from "ink";
import Gradient from "ink-gradient";
import { useState, useEffect } from "react";

const rainbowColors = [
  "#ff0000",
  "#ff7f00",
  "#ffff00",
  "#00ff00",
  "#0000ff",
  "#4b0082",
  "#9400d3",
];

interface HeaderProps {
  currentView: "events" | "markets" | "portfolio" | "search";
}

export function Header({ currentView }: HeaderProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % rainbowColors.length);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const shiftedColors = [
    ...rainbowColors.slice(offset),
    ...rainbowColors.slice(0, offset),
  ];

  const tabs = [
    { key: "events", label: "Events", hotkey: "e" },
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
        <Gradient colors={shiftedColors}>PMKT | Polymarket Terminal</Gradient>
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
