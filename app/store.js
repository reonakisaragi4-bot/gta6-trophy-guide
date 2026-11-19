// Progress lives only in this browser's localStorage, under one key.
// Export writes a JSON file; import reads one back and validates it first.

const STORAGE_KEY = "leonida-ledger-v1";

export function blankProgress() {
  return { earned: [], spoiler: false };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankProgress();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.earned)) return blankProgress();
    return {
      earned: parsed.earned.filter((id) => Number.isInteger(id)),
      spoiler: parsed.spoiler === true,
    };
  } catch (error) {
    return blankProgress();
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    // Storage full or blocked: progress still works for this visit.
  }
}

export function earnedSet(progress) {
  return new Set(progress.earned);
}

export function toggleEarned(progress, id) {
  const earned = earnedSet(progress);
  if (earned.has(id)) earned.delete(id);
  else earned.add(id);
  return { ...progress, earned: [...earned].sort((a, b) => a - b) };
}

// Builds a download of the progress file. No data leaves the browser.
export function exportProgress(progress) {
  const payload = {
    app: "leonida-ledger",
    game: "Grand Theft Auto VI",
    exportedAt: new Date().toISOString(),
    earned: [...progress.earned].sort((a, b) => a - b),
    spoiler: progress.spoiler,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "gta6-trophy-progress.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Reads an exported file's text. Returns progress, or null when it is not ours.
export function parseImportedProgress(text) {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.earned)) return null;
    const earned = parsed.earned.filter((id) => Number.isInteger(id));
    return { earned, spoiler: parsed.spoiler === true };
  } catch (error) {
    return null;
  }
}
