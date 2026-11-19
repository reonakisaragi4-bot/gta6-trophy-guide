// Filtering and the spoiler rule. One pure function per decision, so each
// can be checked on its own: kind, search text, earned state, and spoilers.

// A story trophy stays hidden while the spoiler setting is on and it is unearned.
export function spoilerHides(trophy, spoilerOn, isEarned) {
  return spoilerOn && trophy.kind === "story" && !isEarned;
}

export function matchesKind(trophy, kind) {
  if (kind === "all") return true;
  if (kind === "online") return false; // No online trophies: all 55 unlock in single player.
  return trophy.kind === kind;
}

export function matchesSearch(trophy, query) {
  if (!query) return true;
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    trophy.name.toLowerCase().includes(needle) ||
    trophy.description.toLowerCase().includes(needle)
  );
}

export function matchesStatus(trophy, status, isEarned) {
  if (status === "earned") return isEarned;
  if (status === "unearned") return !isEarned;
  return true;
}

export function applyFilters(trophies, options) {
  const { query, kind, status, earned } = options;
  return trophies.filter((trophy) => {
    const isEarned = earned.has(trophy.id);
    return (
      matchesKind(trophy, kind) &&
      matchesSearch(trophy, query) &&
      matchesStatus(trophy, status, isEarned)
    );
  });
}
