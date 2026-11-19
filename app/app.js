// Leonida Ledger — boot and wiring. Loads the trophy list, keeps the saved
// progress, and connects the controls to the views. No network at run time:
// the only fetch is the app's own data file.

import { loadTrophies, listMakeup } from "./data.js";
import {
  loadProgress,
  saveProgress,
  toggleEarned,
  exportProgress,
  parseImportedProgress,
  blankProgress,
} from "./store.js";
import { applyFilters } from "./filters.js";
import {
  renderChecklist,
  renderDetail,
  renderRoadmap,
  renderMissables,
} from "./views.js";

const VIEWS = ["checklist", "roadmap", "missables", "about"];

const state = {
  trophies: [],
  byId: new Map(),
  progress: loadProgress(),
  selectedId: null,
  query: "",
  kind: "all",
  status: "all",
};

const $ = (id) => document.getElementById(id);

function currentView() {
  const hash = window.location.hash.replace("#", "");
  return VIEWS.includes(hash) ? hash : "checklist";
}

function showView(name) {
  for (const view of VIEWS) {
    const section = $("view-" + view);
    if (section) section.hidden = view !== name;
  }
  for (const tab of document.querySelectorAll(".tab")) {
    tab.classList.toggle("is-active", tab.dataset.view === name);
  }
}

function renderAll() {
  const earned = new Set(state.progress.earned);
  $("earnedCount").textContent = String(earned.size);
  $("progressFill").style.width = (earned.size / state.trophies.length) * 100 + "%";
  const filtered = applyFilters(state.trophies, {
    query: state.query,
    kind: state.kind,
    status: state.status,
    earned,
  });
  // A selection that the filters hide stops pointing at a visible row.
  if (state.selectedId !== null && !filtered.some((trophy) => trophy.id === state.selectedId)) {
    state.selectedId = null;
  }
  $("resultLine").textContent =
    filtered.length + " of " + state.trophies.length + " trophies shown";
  renderChecklist($("trophyList"), filtered, state.progress, state.selectedId, {
    onToggle: (id) => {
      state.progress = toggleEarned(state.progress, id);
      saveProgress(state.progress);
      renderAll();
    },
    onSelect: (id) => {
      state.selectedId = id;
      renderAll();
    },
  });
  renderDetail($("detail"), state.byId.get(state.selectedId) || null, state.progress);
  renderRoadmap($("roadmap"), state.byId, state.progress);
  renderMissables($("missableList"), state.trophies, state.progress);
}

function wireControls() {
  $("search").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderAll();
  });
  for (const chip of document.querySelectorAll("#kindChips .chip")) {
    chip.addEventListener("click", () => {
      state.kind = chip.dataset.kind;
      for (const other of document.querySelectorAll("#kindChips .chip")) {
        other.classList.toggle("is-active", other === chip);
      }
      renderAll();
    });
  }
  $("statusFilter").addEventListener("change", (event) => {
    state.status = event.target.value;
    renderAll();
  });
  const spoiler = $("spoilerToggle");
  spoiler.checked = state.progress.spoiler;
  spoiler.addEventListener("change", () => {
    state.progress = { ...state.progress, spoiler: spoiler.checked };
    saveProgress(state.progress);
    renderAll();
  });
  $("exportBtn").addEventListener("click", () => exportProgress(state.progress));
  $("importFile").addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const text = await file.text();
    const imported = parseImportedProgress(text);
    if (imported) {
      state.progress = imported;
      saveProgress(state.progress);
      spoiler.checked = state.progress.spoiler;
      renderAll();
    } else {
      window.alert("That file is not a Leonida Ledger progress export.");
    }
    event.target.value = "";
  });
  $("resetBtn").addEventListener("click", () => {
    if (window.confirm("Clear all earned trophies and the spoiler setting?")) {
      state.progress = blankProgress();
      saveProgress(state.progress);
      spoiler.checked = false;
      renderAll();
    }
  });
  window.addEventListener("hashchange", () => showView(currentView()));
}

async function boot() {
  state.trophies = await loadTrophies();
  state.byId = new Map(state.trophies.map((trophy) => [trophy.id, trophy]));
  const makeup = listMakeup(state.trophies);
  $("makeup").textContent =
    makeup.total + " trophies · " +
    makeup.grades.platinum + " platinum · " +
    makeup.grades.gold + " gold · " +
    makeup.grades.silver + " silver · " +
    makeup.grades.bronze + " bronze · " +
    makeup.hidden + " hidden · no online trophies";
  wireControls();
  showView(currentView());
  renderAll();
}

boot().catch((error) => {
  $("trophyList").textContent = "The trophy list could not be loaded: " + error.message;
});
