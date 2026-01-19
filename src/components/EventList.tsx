import { Box, Text, useInput } from "ink";
import Spinner from "ink-spinner";
import { useState } from "react";
import { useEvents } from "../hooks/useEvents.js";
import type { Event } from "../api/client.js";

const isRawModeSupported = process.stdin.isTTY ?? false;

export function EventList() {
  const { events, isLoading, error, refresh } = useEvents();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow || input === "k") {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    }
    if (key.downArrow || input === "j") {
      setSelectedIndex((prev) => Math.min(events.length - 1, prev + 1));
    }
    if (input === "r") {
      refresh();
    }
  }, { isActive: isRawModeSupported });

  const formatVolume = (vol: number | null | undefined) => {
    if (vol == null) return "$0";
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
    return `$${vol.toFixed(0)}`;
  };

  const formatEndDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "No end date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMarketCount = (event: Event): number => {
    return event.markets?.length ?? 0;
  };

  if (isLoading && events.length === 0) {
    return (
      <Box flexDirection="column" gap={0}>
        <Box marginBottom={1}>
          <Text bold color="white">
            Trending Events
          </Text>
        </Box>
        <Box>
          <Text color="cyan">
            <Spinner type="dots" />
          </Text>
          <Text color="gray"> Loading events...</Text>
        </Box>
      </Box>
    );
  }

  if (error && events.length === 0) {
    return (
      <Box flexDirection="column" gap={0}>
        <Box marginBottom={1}>
          <Text bold color="white">
            Trending Events
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

  if (events.length === 0) {
    return (
      <Box flexDirection="column" gap={0}>
        <Box marginBottom={1}>
          <Text bold color="white">
            Trending Events
          </Text>
        </Box>
        <Text color="gray">No events found</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={0}>
      <Box marginBottom={1}>
        <Text bold color="white">
          Trending Events
        </Text>
        <Text color="gray"> ({events.length})</Text>
        {isLoading && (
          <Text color="cyan">
            {" "}
            <Spinner type="dots" />
          </Text>
        )}
      </Box>

      {events.map((event, index) => {
        const isSelected = index === selectedIndex;
        const marketCount = getMarketCount(event);
        return (
          <Box key={event.id} flexDirection="row" paddingRight={1}>
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
                {event.title || "Untitled Event"}
              </Text>
            </Box>
            <Box width={12} justifyContent="flex-end">
              <Text color="cyan">{marketCount}</Text>
              <Text color="gray"> {marketCount === 1 ? "mkt" : "mkts"}</Text>
            </Box>
            <Box width={10} justifyContent="flex-end">
              <Text color="gray">{formatVolume(event.volume)}</Text>
            </Box>
            <Box width={14} justifyContent="flex-end">
              <Text color="gray">{formatEndDate(event.endDate)}</Text>
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
