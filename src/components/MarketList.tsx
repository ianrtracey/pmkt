import { Box, Text, useInput } from "ink";
import Spinner from "ink-spinner";
import { useState } from "react";
import { useMarkets } from "../hooks/useMarkets.js";
import type { Market } from "../api/client.js";

export function MarketList() {
  const { markets, isLoading, error, refresh } = useMarkets();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow || input === "k") {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    }
    if (key.downArrow || input === "j") {
      setSelectedIndex((prev) => Math.min(markets.length - 1, prev + 1));
    }
    if (input === "r") {
      refresh();
    }
  });

  const formatVolume = (vol: string | number) => {
    const numVol = typeof vol === "string" ? parseFloat(vol) : vol;
    if (numVol >= 1000000) return `$${(numVol / 1000000).toFixed(1)}M`;
    if (numVol >= 1000) return `$${(numVol / 1000).toFixed(0)}K`;
    return `$${numVol.toFixed(0)}`;
  };

  const getPriceColor = (price: number) => {
    if (price >= 0.7) return "green";
    if (price <= 0.3) return "red";
    return "yellow";
  };

  const getYesPrice = (market: Market): number => {
    const priceStr = market.outcomePrices[0];
    return priceStr ? parseFloat(priceStr) : 0;
  };

  const formatEndDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "No end date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading && markets.length === 0) {
    return (
      <Box flexDirection="column" gap={0}>
        <Box marginBottom={1}>
          <Text bold color="white">
            Trending Markets
          </Text>
        </Box>
        <Box>
          <Text color="cyan">
            <Spinner type="dots" />
          </Text>
          <Text color="gray"> Loading markets...</Text>
        </Box>
      </Box>
    );
  }

  if (error && markets.length === 0) {
    return (
      <Box flexDirection="column" gap={0}>
        <Box marginBottom={1}>
          <Text bold color="white">
            Trending Markets
          </Text>
        </Box>
        <Box flexDirection="column">
          <Text color="red">Error: {error}</Text>
          <Text color="gray" dimColor>
            Press r to retry
          </Text>
        </Box>
      </Box>
    );
  }

  if (markets.length === 0) {
    return (
      <Box flexDirection="column" gap={0}>
        <Box marginBottom={1}>
          <Text bold color="white">
            Trending Markets
          </Text>
        </Box>
        <Text color="gray">No markets found</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={0}>
      <Box marginBottom={1}>
        <Text bold color="white">
          Trending Markets
        </Text>
        <Text color="gray"> ({markets.length})</Text>
        {isLoading && (
          <Text color="cyan">
            {" "}
            <Spinner type="dots" />
          </Text>
        )}
      </Box>

      {markets.map((market, index) => {
        const isSelected = index === selectedIndex;
        const yesPrice = getYesPrice(market);
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
              <Text color={getPriceColor(yesPrice)} bold>
                {(yesPrice * 100).toFixed(0)}%
              </Text>
              <Text color="gray"> Yes</Text>
            </Box>
            <Box width={10} justifyContent="flex-end">
              <Text color="gray">{formatVolume(market.volume)}</Text>
            </Box>
            <Box width={14} justifyContent="flex-end">
              <Text color="gray">{formatEndDate(market.endDate)}</Text>
            </Box>
          </Box>
        );
      })}

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Use j/k or arrows to navigate, r to refresh, Enter to view details
        </Text>
      </Box>
    </Box>
  );
}
