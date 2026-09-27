"use client";

import { useRef, useState } from "react";

/**
 * Wraps an async action so it cannot run again while a previous call is still
 * pending (e.g. a double-clicked Submit), and reports whether it is running.
 * The ref makes the guard effective immediately, before `pending` re-renders.
 */
export function usePendingAction<Args extends unknown[]>(
  action: (...args: Args) => Promise<void>,
) {
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);

  const run = async (...args: Args) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    try {
      await action(...args);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };

  return [run, pending] as const;
}
