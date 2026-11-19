// Loads the official trophy list from the app's own data file.
// Nothing is fetched from the network: data/trophies.json ships under app/.
export async function loadTrophies() {
  const response = await fetch("data/trophies.json");
  if (!response.ok) {
    throw new Error("Could not load the trophy list.");
  }
  const data = await response.json();
  return data.trophies;
}

// The official list's make-up, kept beside the data so the header never drifts.
export function listMakeup(trophies) {
  const grades = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  let hidden = 0;
  for (const trophy of trophies) {
    grades[trophy.grade] += 1;
    if (trophy.hidden) hidden += 1;
  }
  return { total: trophies.length, grades, hidden };
}
