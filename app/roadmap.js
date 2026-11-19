// The platinum roadmap: six stages in the order to earn them, built from the
// official descriptions — which story chapters and missions, which
// collectibles and counts. Each stage names its trophies by id, so the view
// always matches the data file.

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: "Play the story",
    blurb:
      "Chapters 1 to 5 in order, plus the named story missions. All 12 story trophies are unmissable — they pop as the campaign moves on. Meditate on Lucia's balcony during Chapter 1: it is the one missable spot.",
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    stage: 2,
    title: "Strangers across Leonida",
    blurb:
      "Side-mission strands for the strangers you meet around the state. Eight strands finish the silver trophy; the five named finals below are five of them, and Bret's hunt is a sixth.",
    ids: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    stage: 3,
    title: "Activities, skills and the one missable",
    blurb:
      "Races, the shooting range, fishing, the arcade, meditation and the long counters. Do the Chapter 1 meditation early — it is the only trophy that can be missed. The 500-choice counter and the 250 stunts fill up last.",
    ids: [15, 16, 17, 18, 19, 20, 21, 28, 32, 33, 34, 36, 44, 45, 46, 47, 48, 49, 50, 51],
  },
  {
    stage: 4,
    title: "Collectibles and the map",
    blurb:
      "Cards, WAiNK check-ins, vehicles, garages and the 52 areas of Leonida. These are all still there after the story, so sweep them in free roam with the map as your checklist.",
    ids: [30, 31, 35, 42, 54, 55],
  },
  {
    stage: 5,
    title: "Robberies and money",
    blurb:
      "Shops, jewelry, bank vaults, armored trucks and one illegal operation per gang — each with a getaway. Launder the Marked Bills from every job and spend across the shops; both money counters climb together.",
    ids: [37, 38, 39, 40, 41, 43, 52, 53],
  },
  {
    stage: 6,
    title: "100% completion, then the platinum",
    blurb:
      "The gold for 100% completion is the last hard trophy. When it pops, the platinum follows at once — there is nothing else to do.",
    ids: [14, 1],
  },
];
