interface SessionTimes {
  startTime: Date;
  endTime: Date;
}

/**
 * The history entry for moving a session from its `previous` times to `next`,
 * or `null` when neither time changed.
 */
export function sessionTimeChange(previous: SessionTimes, next: SessionTimes) {
  if (
    previous.startTime.getTime() === next.startTime.getTime() &&
    previous.endTime.getTime() === next.endTime.getTime()
  ) {
    return null;
  }

  return {
    previousStartTime: previous.startTime,
    previousEndTime: previous.endTime,
    newStartTime: next.startTime,
    newEndTime: next.endTime,
  };
}
