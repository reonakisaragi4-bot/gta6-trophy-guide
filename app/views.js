// Renders the four views from the trophy data and the saved progress.
// Everything is built with textContent, never innerHTML, so trophy text
// can never run as markup.

import { spoilerHides } from "./filters.js";
import { ROADMAP_STAGES } from "./roadmap.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function badge(text, className) {
  return el("span", "badge " + className, text);
}

// One checklist row: checkbox, name, official description, badges.
export function renderChecklist(listEl, trophies, progress, selectedId, handlers) {
  const earned = new Set(progress.earned);
  listEl.replaceChildren();
  if (trophies.length === 0) {
    listEl.appendChild(el("li", "empty-note", "No trophies match these filters."));
    return;
  }
  for (const trophy of trophies) {
    const isEarned = earned.has(trophy.id);
    const hiddenBySpoiler = spoilerHides(trophy, progress.spoiler, isEarned);
    const row = el("li", "trophy-card" + (isEarned ? " is-earned" : "") + (trophy.id === selectedId ? " is-selected" : ""));
    const check = el("input", "trophy-check");
    check.type = "checkbox";
    check.checked = isEarned;
    check.setAttribute("aria-label", "Earned: " + trophy.name);
    check.addEventListener("click", (event) => {
      event.stopPropagation();
      handlers.onToggle(trophy.id);
    });
    const body = el("div");
    const name = el("div", "trophy-name", hiddenBySpoiler ? "Hidden story trophy" : trophy.name);
    const desc = el("div", "trophy-desc", hiddenBySpoiler ? "Hidden until earned — a story trophy." : trophy.description);
    body.append(name, desc);
    const meta = el("div", "trophy-meta");
    meta.append(badge(gradeLabel(trophy.grade), "grade-" + trophy.grade));
    if (trophy.count !== null && trophy.count !== undefined) {
      meta.append(badge("PSN target 0/" + trophy.count, "count"));
    }
    if (trophy.missable) meta.append(badge("Missable", "missable"));
    if (trophy.hidden) meta.append(badge("Hidden on PSN", "hidden-flag"));
    body.append(meta);
    const dot = el("span", "grade-dot " + trophy.grade);
    dot.setAttribute("aria-hidden", "true");
    row.append(check, body, dot);
    row.addEventListener("click", () => handlers.onSelect(trophy.id));
    listEl.appendChild(row);
  }
}

// The guide pane beside the checklist: guide text and its cited source.
export function renderDetail(detailEl, trophy, progress) {
  detailEl.replaceChildren();
  if (!trophy) {
    const hint = el("p", "detail-empty", "Select a trophy to read its guide. Each guide is written in our own words, and names its sources beside it.");
    detailEl.appendChild(hint);
    return;
  }
  const isEarned = new Set(progress.earned).has(trophy.id);
  const hiddenBySpoiler = spoilerHides(trophy, progress.spoiler, isEarned);
  if (hiddenBySpoiler) {
    detailEl.append(el("h3", null, "Hidden story trophy"));
    detailEl.append(el("p", "spoiler-placeholder", "This is a story trophy. Turn off “Hide story spoilers”, or earn it, to read its name, description and guide."));
    return;
  }
  detailEl.append(el("h3", null, trophy.name));
  detailEl.append(el("p", "official", trophy.description));
  const meta = el("div", "trophy-meta");
  meta.append(badge(gradeLabel(trophy.grade), "grade-" + trophy.grade));
  meta.append(badge(trophy.kind, ""));
  if (trophy.count !== null && trophy.count !== undefined) {
    meta.append(badge("PSN target 0/" + trophy.count, "count"));
  }
  if (trophy.hidden) meta.append(badge("Hidden on PSN", "hidden-flag"));
  detailEl.append(meta);
  if (trophy.missable) {
    const callout = el("p", "missable-callout", "Missable — this is the list's only missable trophy. Meditate at the Chapter 1 spot before that chapter ends; there is no mission replay.");
    detailEl.append(callout);
  }
  detailEl.append(el("p", "guide-text", trophy.guide));
  const source = el("p", "source");
  const label = el("strong", null, "Sources: ");
  source.append(label, document.createTextNode(trophy.source));
  detailEl.append(source);
}

// The platinum roadmap: six stages, each with its trophies and earned marks.
export function renderRoadmap(roadmapEl, trophiesById, progress) {
  const earned = new Set(progress.earned);
  roadmapEl.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const item = el("li", "stage");
    const head = el("div", "stage-head");
    head.append(el("span", "stage-num", String(stage.stage)));
    head.append(el("h3", null, stage.title));
    const done = stage.ids.filter((id) => earned.has(id)).length;
    head.append(el("span", "stage-count", done + " of " + stage.ids.length + " earned"));
    item.append(head);
    item.append(el("p", null, stage.blurb));
    const list = el("ul", "stage-trophies");
    for (const id of stage.ids) {
      const trophy = trophiesById.get(id);
      if (!trophy) continue;
      const isEarned = earned.has(id);
      const hiddenBySpoiler = spoilerHides(trophy, progress.spoiler, isEarned);
      const row = el("li");
      row.append(el("span", isEarned ? "done" : null, isEarned ? "✓ " : "○ "));
      row.append(document.createTextNode((hiddenBySpoiler ? "Hidden story trophy" : trophy.name) + " "));
      row.append(el("span", "trophy-grade", gradeLabel(trophy.grade)));
      list.appendChild(row);
    }
    item.append(list);
    roadmapEl.appendChild(item);
  }
}

// The missables view: the one missable trophy in full, plus what is safe.
export function renderMissables(container, trophies, progress) {
  container.replaceChildren();
  const missable = trophies.filter((trophy) => trophy.missable);
  if (missable.length === 0) {
    container.appendChild(el("p", "empty-note", "No missable trophies found in the list."));
    return;
  }
  for (const trophy of missable) {
    const card = el("div", "missable-card");
    card.append(el("h3", null, trophy.name));
    card.append(el("p", "official", trophy.description));
    const meta = el("div", "trophy-meta");
    meta.append(badge(gradeLabel(trophy.grade), "grade-" + trophy.grade));
    if (trophy.count !== null && trophy.count !== undefined) {
      meta.append(badge("PSN target 0/" + trophy.count, "count"));
    }
    meta.append(badge("Missable", "missable"));
    card.append(meta);
    card.append(el("p", "guide-text", trophy.guide));
    const source = el("p", "source");
    source.append(el("strong", null, "Sources: "), document.createTextNode(trophy.source));
    card.append(source);
    container.appendChild(card);
  }
  const safe = el("p", null, "The other 54 trophies are not missable: nothing in their official descriptions ties them to a single story moment, so they can all be finished in free roam after the story.");
  container.appendChild(safe);
}
