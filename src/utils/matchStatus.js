
export function getMatchStatus(startTime, endTime, now = Date.now()) {
  const toMillis = (t) => {
    if (t === undefined || t === null) return null;
    if (typeof t === 'number') return Number.isNaN(t) ? null : t;
    const d = new Date(t).getTime();
    return Number.isNaN(d) ? null : d;
  };

  const start = toMillis(startTime);
  const end = toMillis(endTime);
  const current = toMillis(now) || Date.now();

  if (!start) {
    throw new TypeError('Invalid `startTime` provided to getMatchStatus');
  }

  // If current time is before the start => scheduled
  if (current < start) {
    return { status: 'scheduled', start, end, now: current };
  }

  // If no end time is known and match has started => live
  if (end === null) {
    return { status: 'live', start, end, now: current };
  }

  // If end is provided and current is within [start, end] => live
  if (current >= start && current <= end) {
    return { status: 'live', start, end, now: current };
  }

  // If current is after end => finished
  if (current > end) {
    return { status: 'finished', start, end, now: current };
  }

  // Fallback (shouldn't normally reach here)
  return { status: 'scheduled', start, end, now: current };
}

export default getMatchStatus;
