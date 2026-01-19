import { Box, Text, useInput } from "ink";
import Spinner from "ink-spinner";
import { useState } from "react";
import { useAppStore } from "../store/index.js";
import { useComments } from "../hooks/useComments.js";
import type { Market, Comment } from "../api/client.js";

const isRawModeSupported = process.stdin.isTTY ?? false;
const VISIBLE_COMMENTS = 5;

export function MarketList() {
  const { selectedEvent, setView } = useAppStore();
  const markets = selectedEvent?.markets ?? [];
  const { comments, isLoading: commentsLoading } = useComments(selectedEvent?.id ?? null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const maxScroll = Math.max(0, comments.length - VISIBLE_COMMENTS);

  useInput((input, key) => {
    if (key.escape || input === "b") {
      setView("events");
    }
    if (key.downArrow || input === "j") {
      setScrollOffset((prev) => Math.min(maxScroll, prev + 1));
    }
    if (key.upArrow || input === "k") {
      setScrollOffset((prev) => Math.max(0, prev - 1));
    }
  }, { isActive: isRawModeSupported });

  const formatVolume = (vol: string | number | null | undefined): string => {
    if (vol == null) return "$0";
    const num = typeof vol === "string" ? parseFloat(vol) : vol;
    if (isNaN(num)) return "$0";
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatEndDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "No end date";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPrice = (price: string): string => {
    const num = parseFloat(price);
    if (isNaN(num)) return "0%";
    return `${(num * 100).toFixed(0)}%`;
  };

  const formatCost = (price: string): string => {
    const num = parseFloat(price);
    if (isNaN(num)) return "$0.00";
    return `$${num.toFixed(2)}`;
  };

  const formatCommentDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getAuthorName = (comment: Comment): string => {
    if (comment.profile?.pseudonym) return comment.profile.pseudonym;
    if (comment.profile?.name) return comment.profile.name;
    if (comment.userAddress) return `${comment.userAddress.slice(0, 6)}...${comment.userAddress.slice(-4)}`;
    return "Anonymous";
  };

  if (!selectedEvent) {
    return (
      <Box flexDirection="column">
        <Text color="red">No event selected</Text>
        <Text color="gray" dimColor>Press b or Esc to go back</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={0}>
      {/* Event Header */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color="white">{selectedEvent.title || "Untitled Event"}</Text>
        <Box gap={2}>
          <Text color="gray">End: <Text color="cyan">{formatEndDate(selectedEvent.endDate)}</Text></Text>
          <Text color="gray">Volume: <Text color="green">{formatVolume(selectedEvent.volume)}</Text></Text>
          <Text color="gray">Markets: <Text color="yellow">{markets.length}</Text></Text>
        </Box>
      </Box>

      {/* Markets List */}
      {markets.length === 0 ? (
        <Text color="gray">No markets for this event</Text>
      ) : (
        <Box flexDirection="column">
          {markets.map((market: Market) => {
            const yesPrice = market.outcomePrices?.[0] ?? "0";
            const noPrice = market.outcomePrices?.[1] ?? "0";

            return (
              <Box key={market.id} flexDirection="column" marginBottom={1}>
                <Text color="white" wrap="truncate">
                  {market.question}
                </Text>
                <Box paddingLeft={2} gap={2}>
                  <Box>
                    <Text color="green">Yes: </Text>
                    <Text color="white" bold>{formatPrice(yesPrice)}</Text>
                    <Text color="gray"> ({formatCost(yesPrice)})</Text>
                  </Box>
                  <Box>
                    <Text color="red">No: </Text>
                    <Text color="white" bold>{formatPrice(noPrice)}</Text>
                    <Text color="gray"> ({formatCost(noPrice)})</Text>
                  </Box>
                  <Text color="gray">Vol: {formatVolume(market.volume)}</Text>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Comments Section */}
      <Box flexDirection="column" marginTop={1}>
        <Box marginBottom={1}>
          <Text bold color="white">Comments</Text>
          <Text color="gray"> ({comments.length})</Text>
          {commentsLoading && (
            <Text color="cyan">
              {" "}
              <Spinner type="dots" />
            </Text>
          )}
        </Box>

        {comments.length === 0 && !commentsLoading ? (
          <Text color="gray">No comments yet</Text>
        ) : (
          <Box flexDirection="column">
            {scrollOffset > 0 && (
              <Text color="gray" dimColor>  ↑ {scrollOffset} more above</Text>
            )}
            {comments.slice(scrollOffset, scrollOffset + VISIBLE_COMMENTS).map((comment: Comment) => (
              <Box key={comment.id} flexDirection="column" marginBottom={1}>
                <Box gap={1}>
                  <Text color="cyan">{getAuthorName(comment)}</Text>
                  <Text color="gray" dimColor>{formatCommentDate(comment.createdAt)}</Text>
                  {(comment.reactionCount ?? 0) > 0 && (
                    <Text color="gray" dimColor>+{comment.reactionCount}</Text>
                  )}
                </Box>
                <Box paddingLeft={2}>
                  <Text color="white" wrap="wrap">{comment.body || ""}</Text>
                </Box>
              </Box>
            ))}
            {scrollOffset < maxScroll && (
              <Text color="gray" dimColor>  ↓ {comments.length - scrollOffset - VISIBLE_COMMENTS} more below</Text>
            )}
          </Box>
        )}
      </Box>

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          j/k to scroll comments, b or Esc to go back
        </Text>
      </Box>
    </Box>
  );
}
