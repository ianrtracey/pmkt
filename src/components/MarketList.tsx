import { Box, Text, useInput } from "ink";
import { useState } from "react";

interface Market {
  id: string;
  question: string;
  yesPrice: number;
  volume24h: number;
  endDate: string;
}

const MOCK_MARKETS: Market[] = [
  {
    id: "1",
    question: "Will Bitcoin reach $100k by end of 2025?",
    yesPrice: 0.42,
    volume24h: 125000,
    endDate: "Dec 31, 2025",
  },
  {
    id: "2",
    question: "Will the Fed cut rates in Q1 2025?",
    yesPrice: 0.65,
    volume24h: 89000,
    endDate: "Mar 31, 2025",
  },
  {
    id: "3",
    question: "Will AI pass medical licensing exam by 2026?",
    yesPrice: 0.78,
    volume24h: 45000,
    endDate: "Dec 31, 2026",
  },
  {
    id: "4",
    question: "Will SpaceX launch Starship successfully?",
    yesPrice: 0.55,
    volume24h: 230000,
    endDate: "Jun 30, 2025",
  },
  {
    id: "5",
    question: "Will unemployment stay below 5% in 2025?",
    yesPrice: 0.71,
    volume24h: 67000,
    endDate: "Dec 31, 2025",
  },
];

export function MarketList() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow || input === "k") {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    }
    if (key.downArrow || input === "j") {
      setSelectedIndex((prev) => Math.min(MOCK_MARKETS.length - 1, prev + 1));
    }
  });

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
    return `$${vol}`;
  };

  const getPriceColor = (price: number) => {
    if (price >= 0.7) return "green";
    if (price <= 0.3) return "red";
    return "yellow";
  };

  return (
    <Box flexDirection="column" gap={0}>
      <Box marginBottom={1}>
        <Text bold color="white">
          Trending Markets
        </Text>
        <Text color="gray"> ({MOCK_MARKETS.length})</Text>
      </Box>

      {MOCK_MARKETS.map((market, index) => {
        const isSelected = index === selectedIndex;
        return (
          <Box key={market.id} flexDirection="row" paddingX={1}>
            <Box width={2}>
              <Text color={isSelected ? "cyan" : "gray"}>
                {isSelected ? ">" : " "}
              </Text>
            </Box>
            <Box flexGrow={1} flexShrink={1}>
              <Text
                color={isSelected ? "white" : "gray"}
                bold={isSelected}
                wrap="truncate"
              >
                {market.question}
              </Text>
            </Box>
            <Box width={12} justifyContent="flex-end">
              <Text color={getPriceColor(market.yesPrice)} bold>
                {(market.yesPrice * 100).toFixed(0)}%
              </Text>
              <Text color="gray"> Yes</Text>
            </Box>
            <Box width={10} justifyContent="flex-end">
              <Text color="gray">{formatVolume(market.volume24h)}</Text>
            </Box>
            <Box width={14} justifyContent="flex-end">
              <Text color="gray">{market.endDate}</Text>
            </Box>
          </Box>
        );
      })}

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Use j/k or arrows to navigate, Enter to view details
        </Text>
      </Box>
    </Box>
  );
}
