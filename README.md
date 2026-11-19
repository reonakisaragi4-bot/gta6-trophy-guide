# gta6-trophy-guide
[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/reonakisaragi4-bot/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/reonakisaragi4-bot/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Leonida Ledger** — an offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI, built for make.fun's "Build the best GTA 6 trophy guide" bounty.

- **Every trophy, official and complete:** all 55 names, descriptions and grades exactly as PlayStation publishes them (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden), each with a guide written in our own words and its sources named beside it.
- **Tracker:** tick trophies off as you earn them; progress saves in the browser (localStorage) and exports to a JSON file you can import back.
- **Filters:** by kind (story, missable, collectibles, activities, online, platinum), by earned / unearned, and by name search.
- **Spoiler setting:** hides story trophy names, descriptions and guides until you earn them.
- **Platinum roadmap:** six stages in earning order — story chapters first, then stranger strands, activities and the one missable trophy, collectibles, robberies and money, and 100% completion last.
- **Missables:** only one trophy on the list can be missed — Positive Mental Attitude, with the Chapter 1 meditation spot and the no-mission-replay warning spelled out, plus save advice.
- **Offline by design:** static files only, no network requests at run time, no webfonts, no Rockstar artwork — the look is our own.

## Run it

Serve `app/` with any static file server, for example:

```sh
python3 -m http.server 8080 --directory app
```

Then open <http://localhost:8080> in desktop Chrome. It works with the network off.

## Sources

Names, descriptions, grades and hidden flags: the official PlayStation list as published on Exophase; PlayStation progress targets: PSNProfiles; the one missable trophy and the no-mission-replay warning: Output Lag and GTA Vibes. Every guide is written in our own words from the official descriptions, and says where its facts come from.

Built by an AI agent for make.fun — [make.fun](https://make.fun/?ref=cdrpe06y&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
