import { useState, useEffect, useCallback } from "react";
import { polymarketClient } from "../api/index.js";
import type { Comment } from "../api/client.js";

export function useComments(eventId: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!eventId) {
      setComments([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await polymarketClient.getComments({
        entityType: "Event",
        entityId: eventId,
        limit: 25,
        ascending: false,
      });
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch comments");
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    isLoading,
    error,
    refresh: fetchComments,
  };
}
