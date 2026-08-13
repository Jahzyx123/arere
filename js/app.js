/* ==========================================================================
   APP — state, rendering, and event wiring for the Suno Techno Toolkit.
   Vanilla JS, no framework, no build step. Event delegation on document;
   #panel is rebuilt per-tab, the transport bar shell persists across tabs
   so the groove keeps running while you browse.
   ========================================================================== */

(function () {
  'use strict';

  const CATEGORIES = [
    { id: 'kick', label: 'Kicks' },
    { id: 'snare', label: 'Snares & Rimshots' },
    { id: 'hat', label: 'Hats & Cymbals' },
    { id: 'perc', label: 'Percussion' },
    { id: 'bass', label: 'Bass & Sub' },
    { id: 'lead', label: 'Leads & Arps' },
    { id: 'pad', label: 'Pads & Drones' },
    { id: 'vocal', label: 'Vocal Chops' },
    { id: 'fx', label: 'FX & Risers' },
    { id: 'texture', label: 'Textures' },
  ];

  function labelForCat(id) {
    const c = CATEGORIES.find(c => c.id === id);
    return c ? c.label : id;
  }
  function findSound(id) { return window.SOUND_LIBRARY.find(s => s.id === id); }
  function findRecipe(id) { return window.TRACK_RECIPES.find(r => r.id === id); }
  function recipeName(id) { const r = findRecipe(id); return r ? r.name : id; }

  function escapeAttr(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ------------------------------------------------------------ FAVORITES
  function readFavSet(key) {
    try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
    catch (e) { return new Set(); }
  }
  function getFavoriteSounds() { return readFavSet('stt-fav-sounds'); }
  function getFavoriteRecipes() { return readFavSet('stt-fav-recipes'); }
  function toggleFavorite(type, id) {
    const key = type === 'sounds' ? 'stt-fav-sounds' : 'stt-fav-recipes';
    const set = type === 'sounds' ? getFavoriteSounds() : getFavoriteRecipes();
    if (set.has(id)) set.delete(id); else set.add(id);
    try { localStorage.setItem(key, JSON.stringify(Array.from(set))); } catch (e) {}
  }

  // ------------------------------------------------------------- COPYING
  let copyRegistry = {};
  function registerCopy(key, text) { copyRegistry[key] = text; }
  function copyText(text, btnEl) {
    const done = () => flashCopied(btnEl);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    cb();
  }
  function flashCopied(btnEl) {
    if (!btnEl) return;
    const hint = btnEl.querySelector('.copy-hint');
    const original = hint ? hint.textContent : null;
    btnEl.classList.add('copied');
    if (hint) hint.textContent = '\u2713 copied';
    setTimeout(() => {
      btnEl.classList.remove('copied');
      if (hint && original !== null) hint.textContent = original;
    }, 1200);
  }
  function flashAdded(btnEl, label) {
    if (!btnEl) return;
    const original = btnEl.textContent;
    btnEl.textContent = label;
    btnEl.classList.add('flash');
    setTimeout(() => { btnEl.textContent = original; btnEl.classList.remove('flash'); }, 900);
  }
  function flashPlaying(btnEl) {
    if (!btnEl) return;
    btnEl.classList.add('flash');
    setTimeout(() => btnEl.classList.remove('flash'), 260);
  }

  // ------------------------------------------------------------ STATE
  function defaultPromptBuilder() {
    return {
      genreTag: '', moodTags: '', soundKeywords: [], productionTags: '',
      bpm: 128, key: '', negative: 'instrumental, no vocals, no lyrics',
      structureTags: []
    };
  }
  const state = {
    tab: 'sounds',
    soundSearch: '',
    soundCategoryFilter: 'all',
    soundFavoritesOnly: false,
    glossarySearch: '',
    recipeSearch: '',
    auditioning: false,
    auditioningId: null,
    promptBuilder: defaultPromptBuilder(),
    wildcard: defaultWildcardState(),
    groove: { bpm: 128, swing: 0 }
  };

  // ------------------------------------------------------------- WILDCARDS
  function defaultWildcardState() {
    // one entry per pool; locked=false and a randomly chosen starting tag
    return {
      slots: window.WILDCARD_POOLS.map(pool => ({
        id: pool.id, locked: false, tag: randomFrom(pool.tags)
      })),
      appendToPrompt: true
    };
  }
  function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function getWildcardSlot(id) { return state.wildcard.slots.find(s => s.id === id); }
  function getActiveWildcardTags() {
    return state.wildcard.slots
      .filter(s => s.tag)
      .map(s => s.tag);
  }
  function rerollWildcard(id) {
    const slot = getWildcardSlot(id);
    if (!slot || slot.locked) return;
    const pool = window.WILDCARD_POOLS.find(p => p.id === id);
    if (!pool) return;
    let next;
    do { next = randomFrom(pool.tags); } while (next === slot.tag && pool.tags.length > 1);
    slot.tag = next;
  }
  function rerollAllWildcards() {
    state.wildcard.slots.forEach(s => rerollWildcard(s.id));
  }

  // ----------------------------------------------------- PERSISTED BUILDER
  const BUILDER_STORAGE_KEY = 'stt-prompt-builder-v2';
  function saveBuilder() {
    try { localStorage.setItem(BUILDER_STORAGE_KEY, JSON.stringify(state.promptBuilder)); } catch (e) {}
  }
  function loadBuilder() {
    try {
      const raw = localStorage.getItem(BUILDER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state.promptBuilder = Object.assign(defaultPromptBuilder(), parsed);
      }
    } catch (e) {}
  }

  function compileStylePrompt() {
    return compileStylePromptWith(state.promptBuilder);
  }
  // Compiles a style prompt. When the wildcard tab has append enabled, the
  // rolled tags are injected just before the negative tag, so the negative
  // stays last (where Suno applies exclusions most reliably).
  function compileStylePromptWith(pb) {
    const parts = [];
    if (pb.genreTag.trim()) parts.push(pb.genreTag.trim());
    if (pb.moodTags.trim()) parts.push(pb.moodTags.trim());
    pb.soundKeywords.forEach(k => parts.push(k.keyword));
    if (pb.productionTags && pb.productionTags.trim()) parts.push(pb.productionTags.trim());
    if (pb.bpm) parts.push(`${pb.bpm} BPM`);
    if (pb.key.trim()) parts.push(pb.key.trim());
    const extras = (pb && pb.extraTags) ? pb.extraTags : getActiveWildcardTags();
    if (state.wildcard.appendToPrompt && extras.length) extras.forEach(t => parts.push(t));
    if (pb.negative.trim()) parts.push(pb.negative.trim());
    return parts.filter(Boolean).join(', ');
  }

  // Deduplicates stacked keywords while preserving order (first wins).
  function dedupeKeywords(list) {
    const seen = new Set();
    const out = [];
    list.forEach(k => {
      const key = (k.keyword || '').trim().toLowerCase();
      if (key && !seen.has(key)) { seen.add(key); out.push(k); }
    });
    return out;
  }

  // ------------------------------------------------------------- SHELL
  function buildShell() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <header class="site-header">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true">&#9635;</span>
          <div class="brand-text">
            <h1>SIGNAL<span class="accent">PATCH</span></h1>
            <p class="brand-sub">Techno production companion for Suno.AI</p>
          </div>
        </div>
        <nav class="tabs" id="tabs">
          <button class="tab-btn" data-action="switch-tab" data-tab="sounds">Sound Library</button>
          <button class="tab-btn" data-action="switch-tab" data-tab="recipes">Track Formulas</button>
          <button class="tab-btn" data-action="switch-tab" data-tab="glossary">Glossary</button>
          <button class="tab-btn" data-action="switch-tab" data-tab="builder">Prompt Builder</button>
          <button class="tab-btn" data-action="switch-tab" data-tab="wildcards">🎲 Wildcards</button>
          <button class="tab-btn" data-action="switch-tab" data-tab="cheatsheet">Suno Cheat Sheet</button>
        </nav>
      </header>

      <div class="transport" id="transport">
        <div class="transport-left">
          <button class="transport-play" id="groove-toggle" data-action="toggle-groove" aria-label="Play or stop groove">
            <span class="play-icon">&#9654;</span><span class="stop-icon" style="display:none">&#9632;</span>
            <span class="transport-label">GROOVE</span>
          </button>
          <div class="step-lights" id="step-lights">
            ${Array.from({ length: 16 }).map((_, i) => `<span class="step-light${i % 4 === 0 ? ' downbeat' : ''}"></span>`).join('')}
          </div>
        </div>
        <div class="transport-right">
          <label class="bpm-control">
            <span class="bpm-tag">BPM</span>
            <input type="range" id="bpm-slider" min="90" max="175" value="128" data-action="set-bpm">
            <span class="bpm-readout" id="bpm-readout">128</span>
          </label>
          <label class="bpm-control swing-control" title="Swing delays the off-beat 16ths for a groovier feel.">
            <span class="bpm-tag">SWING</span>
            <input type="range" id="swing-slider" min="0" max="70" value="0" data-action="set-swing">
            <span class="bpm-readout" id="swing-readout">0%</span>
          </label>
          <button class="btn btn-ghost small" data-action="clear-groove-layers">Clear layers</button>
        </div>
      </div>
      <div class="groove-layers-readout" id="groove-layers-readout">No extra layers &mdash; default kick/hat groove only</div>

      <main id="panel" class="panel"></main>

      <footer class="site-footer">
        <p>Previews are original Web&nbsp;Audio synthesis built to approximate each sound&rsquo;s character &mdash; reference sketches, not Suno&rsquo;s actual output, and not samples of any copyrighted drum machine or record. Suno field mechanics reflect the current model family as of mid-2026 and can drift &mdash; double-check in Suno itself if something behaves differently.</p>
      </footer>
    `;
  }

  function updateTabButtons() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === state.tab);
    });
  }
  function updateTransportPlayState() {
    const btn = document.getElementById('groove-toggle');
    if (!btn) return;
    const playing = window.audioEngine.grooveState.playing;
    btn.classList.toggle('playing', playing);
    btn.querySelector('.play-icon').style.display = playing ? 'none' : '';
    btn.querySelector('.stop-icon').style.display = playing ? '' : 'none';
  }
  function updateGrooveLayerReadout() {
    const el = document.getElementById('groove-layers-readout');
    if (!el) return;
    const layers = window.audioEngine.grooveState.layers;
    const parts = Object.keys(layers).map(cat => `${labelForCat(cat)}: ${layers[cat].name}`);
    el.textContent = parts.length ? parts.join('  \u00b7  ') : 'No extra layers \u2014 default kick/hat groove only';
  }

  // ------------------------------------------------------------- PANELS
  function renderPanel() {
    copyRegistry = {};
    const panel = document.getElementById('panel');
    let html = '';
    switch (state.tab) {
      case 'sounds': html = renderSounds(); break;
      case 'recipes': html = renderRecipes(); break;
      case 'glossary': html = renderGlossary(); break;
      case 'builder': html = renderBuilder(); break;
      case 'wildcards': html = renderWildcards(); break;
      case 'cheatsheet': html = renderCheatsheet(); break;
    }
    panel.innerHTML = html;
  }
  function rerenderPanel() {
    const active = document.activeElement;
    const activeAction = active && active.dataset ? active.dataset.action : null;
    const selStart = active && typeof active.selectionStart === 'number' ? active.selectionStart : null;
    renderPanel();
    if (activeAction) {
      const el = document.querySelector(`#panel [data-action="${activeAction}"]`);
      if (el) {
        el.focus();
        if (selStart !== null && el.setSelectionRange) {
          try { el.setSelectionRange(selStart, selStart); } catch (e) {}
        }
      }
    }
  }

  // ---- Sound Library ----
  function renderSounds() {
    const activeCat = state.soundCategoryFilter;
    const search = state.soundSearch.trim().toLowerCase();
    const favs = getFavoriteSounds();
    const list = window.SOUND_LIBRARY.filter(s => {
      if (state.soundFavoritesOnly && !favs.has(s.id)) return false;
      if (activeCat !== 'all' && s.category !== activeCat) return false;
      if (search && !(
        s.name.toLowerCase().includes(search) ||
        s.keyword.toLowerCase().includes(search) ||
        s.desc.toLowerCase().includes(search) ||
        (s.role || '').toLowerCase().includes(search)
      )) return false;
      return true;
    });

    const chips = `<button class="chip${activeCat === 'all' ? ' active' : ''}" data-action="filter-cat" data-cat="all">All (${window.SOUND_LIBRARY.length})</button>` +
      CATEGORIES.map(c => {
        const count = window.SOUND_LIBRARY.filter(s => s.category === c.id).length;
        return `<button class="chip cat-${c.id}${activeCat === c.id ? ' active' : ''}" data-action="filter-cat" data-cat="${c.id}">${c.label} (${count})</button>`;
      }).join('');

    const cards = list.map(s => renderSoundCard(s, favs)).join('');

    const auditionLabel = state.auditioning ? '\u23f9 Stop audition' : '\u25b6 Audition these sounds';
    return `
      <div class="toolbar">
        <input type="search" class="search-input" data-action="search-sounds" placeholder="Search sounds, keywords, descriptions\u2026" value="${escapeAttr(state.soundSearch)}">
        <label class="fav-toggle"><input type="checkbox" data-action="toggle-fav-filter" ${state.soundFavoritesOnly ? 'checked' : ''}> \u2605 Favorites only</label>
        <button class="btn btn-audition" data-action="audition-sounds" ${list.length ? '' : 'disabled'}>${auditionLabel}</button>
        <button class="btn btn-ghost" data-action="surprise-sound" ${list.length ? '' : 'disabled'}>🎲 Surprise me</button>
      </div>
      <div class="chip-row">${chips}</div>
      <div class="result-count">${list.length} sound${list.length === 1 ? '' : 's'}</div>
      <div class="sound-grid">${cards || '<p class="empty-state">No sounds match \u2014 try clearing filters.</p>'}</div>
    `;
  }

  function renderSoundCard(s, favs) {
    registerCopy('sound-' + s.id, s.keyword);
    const isFav = favs.has(s.id);
    const layerActive = window.audioEngine.getGrooveLayer(s.category);
    const isLayered = layerActive && layerActive.id === s.id;
    const inPrompt = state.promptBuilder.soundKeywords.some(k => k.id === s.id);
    const auditioning = state.auditioningId === s.id;
    return `
      <article class="sound-card cat-${s.category}${auditioning ? ' auditioning' : ''}" data-sound-id="${s.id}">
        <div class="sound-card-head">
          <span class="sound-cat-tag">${labelForCat(s.category)}${s.subtype ? ' \u00b7 ' + s.subtype : ''}</span>
          <button class="fav-btn${isFav ? ' active' : ''}" data-action="toggle-fav-sound" data-id="${s.id}" aria-label="Favorite ${escapeAttr(s.name)}">${isFav ? '\u2605' : '\u2606'}</button>
        </div>
        <h3 class="sound-name">${s.name}</h3>
        <button class="keyword-pill" data-action="copy-key" data-key="sound-${s.id}" title="Copy Suno keyword">
          <code>${s.keyword}</code>
          <span class="copy-hint">\u2367 copy</span>
        </button>
        <p class="sound-desc">${s.desc}</p>
        <p class="sound-role">${s.role}</p>
        <div class="sound-card-actions">
          <button class="btn btn-play" data-action="play-sound" data-id="${s.id}">\u25b6 Preview</button>
          <button class="btn btn-add-prompt${inPrompt ? ' added' : ''}" data-action="add-to-prompt" data-id="${s.id}">${inPrompt ? '\u2713 In prompt' : '+ Add to prompt'}</button>
          <button class="btn btn-layer${isLayered ? ' active' : ''}" data-action="toggle-groove-layer" data-id="${s.id}">${isLayered ? '\u23f9 In groove' : '\u23f5 Layer'}</button>
        </div>
      </article>
    `;
  }

  // ---- Track Formulas ----
  function renderRecipes() {
    const favs = getFavoriteRecipes();
    const search = state.recipeSearch.trim().toLowerCase();
    const visibleRecipes = window.TRACK_RECIPES.filter(r => {
      if (!search) return true;
      const hay = [r.name, r.tagline, r.stylePrompt, r.key, (r.commentary || []).join(' ')].join(' ').toLowerCase();
      return hay.includes(search);
    });
    const cards = visibleRecipes.map(r => {
      registerCopy('recipe-style-' + r.id, r.stylePrompt);
      registerCopy('recipe-structure-' + r.id, r.structure.map(t => t.tag).join('\n'));
      registerCopy('recipe-v4-' + r.id, r.shortPromptV4);
      const isFav = favs.has(r.id);
      return `
        <article class="recipe-card" data-recipe-id="${r.id}">
          <div class="recipe-head">
            <div class="recipe-title">
              <h3>${r.name}</h3>
              <p class="recipe-tagline">${r.tagline}</p>
            </div>
            <div class="recipe-meta">
              <span class="badge">${r.bpm} BPM</span>
              <span class="badge">${r.key}</span>
              <button class="fav-btn${isFav ? ' active' : ''}" data-action="toggle-fav-recipe" data-id="${r.id}" aria-label="Favorite ${escapeAttr(r.name)}">${isFav ? '\u2605' : '\u2606'}</button>
            </div>
          </div>

          <div class="recipe-block">
            <div class="block-label">Style prompt <span class="char-count">${r.stylePrompt.length} chars</span></div>
            <button class="copy-block" data-action="copy-key" data-key="recipe-style-${r.id}">
              <code>${r.stylePrompt}</code><span class="copy-hint">\u2367 copy</span>
            </button>
          </div>

          <div class="recipe-block">
            <div class="block-label">Structure tags <span class="char-count">paste into the Lyrics field</span></div>
            <button class="copy-block" data-action="copy-key" data-key="recipe-structure-${r.id}">
              <code>${r.structure.map(t => t.tag).join('<br>')}</code><span class="copy-hint">\u2367 copy</span>
            </button>
          </div>

          <details class="recipe-v4">
            <summary>v4 / short fallback (\u2264200 chars)</summary>
            <button class="copy-block" data-action="copy-key" data-key="recipe-v4-${r.id}">
              <code>${r.shortPromptV4}</code><span class="copy-hint">\u2367 copy</span>
            </button>
          </details>

          <div class="commentary">
            <div class="block-label">Producer commentary</div>
            ${r.commentary.map(p => `<p>${p}</p>`).join('')}
          </div>

          <div class="recipe-actions">
            <button class="btn" data-action="load-recipe-to-builder" data-id="${r.id}">\u2192 Load into Prompt Builder</button>
          </div>
        </article>
      `;
    }).join('');
    return `
      <div class="toolbar">
        <input type="search" class="search-input" data-action="search-recipes" placeholder="Search recipes, tags, moods, BPM/key\u2026" value="${escapeAttr(state.recipeSearch)}">
      </div>
      <div class="result-count">${visibleRecipes.length} recipe${visibleRecipes.length === 1 ? '' : 's'}</div>
      <div class="recipe-grid">${cards || '<p class="empty-state">No recipes match your search.</p>'}</div>
    `;
  }

  // ---- Glossary ----
  function renderGlossary() {
    const search = state.glossarySearch.trim().toLowerCase();
    const list = window.SUBGENRE_GLOSSARY.filter(g => !search || g.name.toLowerCase().includes(search) || g.blurb.toLowerCase().includes(search));
    const items = list.map(g => `
      <article class="glossary-card">
        <div class="glossary-head">
          <h4>${g.name}</h4>
          <span class="badge small">${g.bpm} BPM</span>
        </div>
        <p>${g.blurb}</p>
        ${g.closestRecipe ? `<button class="btn btn-ghost small" data-action="goto-recipe" data-id="${g.closestRecipe}">Closest full recipe: ${recipeName(g.closestRecipe)} \u2192</button>` : ''}
      </article>
    `).join('');
    return `
      <p class="glossary-intro">Techno\u2019s wider subgenre map is drawn by DJs, labels, and record-shop crates more than any official standard \u2014 these are widely used scene labels, not rigid categories, and they overlap constantly. Borrow the vocabulary and fold it into any style prompt.</p>
      <div class="toolbar">
        <input type="search" class="search-input" data-action="search-glossary" placeholder="Search the glossary\u2026" value="${escapeAttr(state.glossarySearch)}">
      </div>
      <div class="result-count">${list.length} styles</div>
      <div class="glossary-grid">${items || '<p class="empty-state">No matches.</p>'}</div>
    `;
  }

  // ---- Prompt Builder ----
  function renderBuilder() {
    const pb = state.promptBuilder;
    const compiled = compileStylePrompt();
    registerCopy('builder-style', compiled);
    const structureText = pb.structureTags.join('\n');
    registerCopy('builder-structure', structureText);

    const keywordChips = pb.soundKeywords.length
      ? pb.soundKeywords.map(k => `<span class="kw-chip">${k.keyword}<button data-action="remove-keyword" data-id="${k.id}" aria-label="Remove">\u00d7</button></span>`).join('')
      : '<span class="empty-hint">Click \u201c+ Add to prompt\u201d on any sound card to build your stack here.</span>';

    const structureChips = pb.structureTags.length
      ? pb.structureTags.map((t, i) => `<span class="tag-chip">${t}<button data-action="remove-structure-tag" data-index="${i}" aria-label="Remove">\u00d7</button></span>`).join('')
      : '<span class="empty-hint">Click a tag below to build your arrangement.</span>';

    const palette = window.CHEATSHEET.structureTags.map(t => `<button class="tag-palette-btn" data-action="add-structure-tag" data-tag="${escapeAttr(t.tag)}">${t.tag}</button>`).join('');

    const over = compiled.length > 1000;

    return `
      <div class="builder-grid">
        <section class="builder-col">
          <h3>1. Base genre &amp; mood</h3>
          <label class="field-label">Genre / scene tag
            <input type="text" class="text-input" data-action="set-genre-tag" placeholder="e.g. peak-time driving techno" value="${escapeAttr(pb.genreTag)}">
          </label>
          <label class="field-label">Mood / energy tags
            <input type="text" class="text-input" data-action="set-mood-tags" placeholder="e.g. dark, hypnotic, warehouse energy" value="${escapeAttr(pb.moodTags)}">
          </label>
          <label class="field-label">Production / mix tags
            <input type="text" class="text-input" data-action="set-production-tags" placeholder="e.g. punchy club mix, sidechain pumping, raw analog" value="${escapeAttr(pb.productionTags || '')}">
          </label>
          <div class="field-row">
            <label class="field-label">BPM
              <input type="number" class="text-input small" data-action="set-builder-bpm" min="60" max="200" value="${pb.bpm}">
            </label>
            <label class="field-label">Key
              <input type="text" class="text-input small" data-action="set-builder-key" placeholder="e.g. A minor" value="${escapeAttr(pb.key)}">
            </label>
          </div>
          <label class="field-label">Negative / exclude <span class="hint-sm">(goes last)</span>
            <input type="text" class="text-input" data-action="set-negative" value="${escapeAttr(pb.negative)}">
          </label>

          <h3>2. Sound stack <span class="hint-sm">${pb.soundKeywords.length} selected from the Sound Library</span></h3>
          <div class="kw-chip-row">${keywordChips}</div>
          ${pb.soundKeywords.length ? '<button class="btn btn-ghost small" data-action="clear-keywords">\u00d7 Clear sound stack</button>' : ''}
        </section>

        <section class="builder-col">
          <h3>3. Style prompt output <span class="char-count${over ? ' over' : ''}">${compiled.length} / 1000 chars</span></h3>
          ${state.wildcard.appendToPrompt && getActiveWildcardTags().length
            ? `<div class="wildcard-hint">🎲 ${getActiveWildcardTags().length} wildcard tag(s) appended before the negative tag — <button type="button" class="link-btn" data-action="goto-wildcards">edit wildcards</button></div>`
            : '<div class="wildcard-hint muted">🎲 No wildcards active — <button type="button" class="link-btn" data-action="goto-wildcards">add wildcard chaos</button></div>'}
          <button class="copy-block big" data-action="copy-key" data-key="builder-style">
            <code>${compiled ? escapeAttr(compiled) : '<em>Add a genre tag or a sound to get started\u2026</em>'}</code>
            <span class="copy-hint">\u2367 copy style prompt</span>
          </button>

          <h3>4. Structure tags <span class="hint-sm">for the Lyrics field</span></h3>
          <div class="tag-palette">${palette}</div>
          <div class="tag-chip-row">${structureChips}</div>
          <button class="copy-block" data-action="copy-key" data-key="builder-structure">
            <code>${structureText ? structureText.split('\n').map(escapeAttr).join('<br>') : '<em>Click tags above to build the arrangement\u2026</em>'}</code>
            <span class="copy-hint">\u2367 copy structure</span>
          </button>
          ${pb.structureTags.length ? '<button class="btn btn-ghost small" data-action="clear-structure">\u00d7 Clear structure</button>' : ''}

          <button class="btn btn-ghost" data-action="clear-builder">\u21ba Clear builder</button>
        </section>
      </div>
    `;
  }

  // ---- Wildcards ----
  function renderWildcards() {
    const wc = state.wildcard;
    const activeTags = getActiveWildcardTags();

    // The core prompt (genre/mood/sound/production) WITHOUT wildcard tags.
    const corePb = Object.assign({}, state.promptBuilder, { extraTags: [] });
    const corePrompt = compileStylePromptWith(corePb);
    const fullPrompt = wc.appendToPrompt && activeTags.length
      ? corePrompt + (corePrompt ? ', ' : '') + activeTags.join(', ')
      : corePrompt;
    registerCopy('wildcard-full', fullPrompt);
    registerCopy('wildcard-core', corePrompt);

    const cards = wc.slots.map(slot => {
      const pool = window.WILDCARD_POOLS.find(p => p.id === slot.id);
      return `
        <article class="wildcard-card${slot.locked ? ' locked' : ''}" data-wildcard-id="${slot.id}">
          <header class="wildcard-head">
            <span class="wildcard-icon">${pool.icon}</span>
            <div class="wildcard-meta">
              <h4>${pool.label}</h4>
              <p>${pool.blurb}</p>
            </div>
            <button class="lock-btn${slot.locked ? ' active' : ''}" data-action="toggle-wildcard-lock" data-id="${slot.id}" title="${slot.locked ? 'Locked — click to unlock' : 'Lock this tag'}">
              ${slot.locked ? '🔒' : '🔓'}
            </button>
          </header>
          <div class="wildcard-tag">${escapeAttr(slot.tag)}</div>
          <div class="wildcard-actions">
            <button class="btn btn-ghost small" data-action="reroll-wildcard" data-id="${slot.id}" ${slot.locked ? 'disabled' : ''}>🎲 Re-roll</button>
            <button class="btn btn-ghost small" data-action="clear-wildcard" data-id="${slot.id}" ${slot.locked ? 'disabled' : ''}>Clear</button>
          </div>
        </article>
      `;
    }).join('');

    const presetBtns = window.WILDCARD_PRESETS.map(pr =>
      `<button class="btn btn-ghost small" data-action="apply-wildcard-preset" data-preset="${pr.id}" title="${escapeAttr(pr.note)}">${pr.icon} ${pr.label}</button>`
    ).join('');

    return `
      <div class="wildcard-intro">
        <h2>🎲 Wildcard Prompt Injector</h2>
        <p>Build your core prompt in the <strong>Prompt Builder</strong>, then roll these cards to append weird, off-genre tags and force Suno out of its comfort zone. <strong>Lock 🔒 a card</strong> to freeze a tag you love — it survives every re-roll. Only unlocked cards change.</p>
      </div>

      <div class="wildcard-toolbar">
        <button class="btn btn-wildcard" data-action="reroll-all-wildcards">🎲 Re-roll all unlocked</button>
        <div class="wildcard-presets">${presetBtns}</div>
        <label class="fav-toggle"><input type="checkbox" data-action="toggle-wildcard-append" ${wc.appendToPrompt ? 'checked' : ''}> Append tags to final prompt</label>
      </div>

      <div class="wildcard-grid">${cards}</div>

      <section class="wildcard-output">
        <h3>Wildcard tags <span class="hint-sm">(${activeTags.length} active — appended last, after the negative tag stays last)</span></h3>
        <div class="kw-chip-row">
          ${activeTags.length
            ? activeTags.map(t => `<span class="kw-chip wildcard-chip">${escapeAttr(t)}</span>`).join('')
            : '<span class="empty-hint">Roll the cards to inject some chaos.</span>'}
        </div>

        <h3>Final style prompt <span class="char-count${fullPrompt.length > 1000 ? ' over' : ''}">${fullPrompt.length} / 1000 chars</span></h3>
        <button class="copy-block big wildcard-final" data-action="copy-key" data-key="wildcard-full">
          <code>${fullPrompt ? escapeAttr(fullPrompt) : '<em>Build a core prompt in the Prompt Builder, then roll…</em>'}</code>
          <span class="copy-hint">⧉ copy final prompt</span>
        </button>
        <div class="wildcard-footer-actions">
          <button class="btn btn-ghost small" data-action="copy-key" data-key="wildcard-core">⧉ copy core only (no wildcards)</button>
          <button class="btn btn-ghost small" data-action="goto-builder">← Edit core prompt in Builder</button>
        </div>
        <p class="hint-sm">Tip: lock 2 cards you like and keep re-rolling the rest — the locked core formula stays frozen while the weirdness rotates.</p>
      </section>
    `;
  }

  // ---- Cheat Sheet ----
  function renderCheatsheet() {
    const cs = window.CHEATSHEET;
    return `
      <div class="cheatsheet">
        <section>
          <h3>Character limits (current Suno models)</h3>
          <table class="limits-table">
            <thead><tr><th>Model</th><th>Style field</th><th>Lyrics field</th><th>Note</th></tr></thead>
            <tbody>${cs.limits.map(l => `<tr><td>${l.model}</td><td>${l.style}</td><td>${l.lyrics}</td><td>${l.note}</td></tr>`).join('')}</tbody>
          </table>
        </section>
        <section>
          <h3>Where things go</h3>
          <dl class="def-list">${cs.fieldBasics.map(f => `<dt>${f.field}</dt><dd>${f.use}</dd>`).join('')}</dl>
        </section>
        <section>
          <h3>Structure tag reference</h3>
          <dl class="def-list">${cs.structureTags.map(t => `<dt><code>${t.tag}</code></dt><dd>${t.use}</dd>`).join('')}</dl>
        </section>
        <section>
          <h3>Prompting tips</h3>
          <ul class="tips-list">${cs.tips.map(t => `<li>${t}</li>`).join('')}</ul>
        </section>
      </div>
    `;
  }

  // ------------------------------------------------------------- EVENTS
  document.addEventListener('click', function (e) {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    switch (action) {
      case 'switch-tab':
        state.tab = actionEl.dataset.tab;
        renderPanel(); updateTabButtons();
        break;

      case 'filter-cat':
        state.soundCategoryFilter = actionEl.dataset.cat;
        rerenderPanel();
        break;

      case 'toggle-fav-sound':
        toggleFavorite('sounds', actionEl.dataset.id);
        rerenderPanel();
        break;

      case 'toggle-fav-recipe':
        toggleFavorite('recipes', actionEl.dataset.id);
        rerenderPanel();
        break;

      case 'copy-key':
        copyText(copyRegistry[actionEl.dataset.key] || '', actionEl);
        break;

      case 'play-sound': {
        if (state.auditioning) {
          window.audioEngine.stopPreviewQueue();
          state.auditioning = false;
          state.auditioningId = null;
        }
        const s = findSound(actionEl.dataset.id);
        if (s) window.audioEngine.preview(s, window.audioEngine.master);
        flashPlaying(actionEl);
        break;
      }

      case 'surprise-sound': {
        // Picks and plays one random sound from the currently filtered view.
        if (state.auditioning) {
          window.audioEngine.stopPreviewQueue();
          state.auditioning = false;
          state.auditioningId = null;
        }
        const activeCat = state.soundCategoryFilter;
        const search = state.soundSearch.trim().toLowerCase();
        const favs = getFavoriteSounds();
        const pool = window.SOUND_LIBRARY.filter(s => {
          if (state.soundFavoritesOnly && !favs.has(s.id)) return false;
          if (activeCat !== 'all' && s.category !== activeCat) return false;
          if (search && !(
            s.name.toLowerCase().includes(search) ||
            s.keyword.toLowerCase().includes(search) ||
            s.desc.toLowerCase().includes(search)
          )) return false;
          return true;
        });
        if (pool.length) {
          const pick = pool[Math.floor(Math.random() * pool.length)];
          window.audioEngine.preview(pick, window.audioEngine.master);
          // briefly flash the card so the user sees what got picked
          setTimeout(() => {
            const card = document.querySelector(`[data-sound-id="${pick.id}"]`);
            if (card) {
              card.classList.add('flash-highlight');
              card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
              setTimeout(() => card.classList.remove('flash-highlight'), 1200);
            }
          }, 30);
        }
        break;
      }

      case 'audition-sounds': {
        if (state.auditioning) {
          window.audioEngine.stopPreviewQueue();
          state.auditioning = false;
          state.auditioningId = null;
        } else {
          const activeCat = state.soundCategoryFilter;
          const search = state.soundSearch.trim().toLowerCase();
          const favs = getFavoriteSounds();
          const list = window.SOUND_LIBRARY.filter(s => {
            if (state.soundFavoritesOnly && !favs.has(s.id)) return false;
            if (activeCat !== 'all' && s.category !== activeCat) return false;
            if (search && !(
              s.name.toLowerCase().includes(search) ||
              s.keyword.toLowerCase().includes(search) ||
              s.desc.toLowerCase().includes(search) ||
              (s.role || '').toLowerCase().includes(search)
            )) return false;
            return true;
          });
          if (list.length) {
            state.auditioning = true;
            window.audioEngine.previewQueue(list, {
              onStart: (id) => {
                state.auditioningId = id;
                renderPanel();
                const card = document.querySelector(`[data-sound-id="${id}"]`);
                if (card) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
              },
              onStop: () => {
                state.auditioning = false;
                state.auditioningId = null;
                renderPanel();
              }
            });
          }
        }
        renderPanel();
        break;
      }

      case 'add-to-prompt': {
        const s = findSound(actionEl.dataset.id);
        if (!s) break;
        const exists = state.promptBuilder.soundKeywords.find(k => k.id === s.id);
        if (!exists) {
          state.promptBuilder.soundKeywords.push({ id: s.id, keyword: s.keyword });
          state.promptBuilder.soundKeywords = dedupeKeywords(state.promptBuilder.soundKeywords);
          saveBuilder();
          flashAdded(actionEl, '\u2713 Added');
        } else {
          flashAdded(actionEl, 'Already added');
        }
        rerenderPanel();
        break;
      }

      case 'remove-keyword':
        state.promptBuilder.soundKeywords = state.promptBuilder.soundKeywords.filter(k => k.id !== actionEl.dataset.id);
        saveBuilder();
        rerenderPanel();
        break;

      case 'clear-keywords':
        state.promptBuilder.soundKeywords = [];
        saveBuilder();
        rerenderPanel();
        break;

      case 'toggle-groove-layer': {
        const s = findSound(actionEl.dataset.id);
        if (!s) break;
        const current = window.audioEngine.getGrooveLayer(s.category);
        if (current && current.id === s.id) window.audioEngine.clearGrooveLayer(s.category);
        else window.audioEngine.setGrooveLayer(s.category, s);
        rerenderPanel();
        updateGrooveLayerReadout();
        break;
      }

      case 'clear-groove-layers': {
        const layers = window.audioEngine.grooveState.layers;
        Object.keys(layers).forEach(cat => delete layers[cat]);
        rerenderPanel();
        updateGrooveLayerReadout();
        break;
      }

      case 'toggle-groove':
        if (window.audioEngine.grooveState.playing) window.audioEngine.stopGroove();
        else window.audioEngine.startGroove(state.groove.bpm);
        updateTransportPlayState();
        break;

      case 'goto-recipe':
        state.tab = 'recipes';
        renderPanel(); updateTabButtons();
        setTimeout(() => {
          const card = document.querySelector(`[data-recipe-id="${actionEl.dataset.id}"]`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            card.classList.add('flash-highlight');
            setTimeout(() => card.classList.remove('flash-highlight'), 1500);
          }
        }, 50);
        break;

      case 'load-recipe-to-builder': {
        const r = findRecipe(actionEl.dataset.id);
        if (r) {
          const bpmNum = parseInt(String(r.bpm).replace(/[^\d].*$/, ''), 10);
          state.promptBuilder.genreTag = r.name;
          state.promptBuilder.bpm = isNaN(bpmNum) ? state.promptBuilder.bpm : bpmNum;
          state.promptBuilder.key = r.key;
          state.promptBuilder.moodTags = r.tagline || '';
          state.promptBuilder.productionTags = (r.productionTags || '').trim();
          state.promptBuilder.structureTags = r.structure.map(t => t.tag);
          state.promptBuilder.soundKeywords = dedupeKeywords((r.keySounds || []).map(id => {
            const s = findSound(id); return s ? { id: s.id, keyword: s.keyword } : null;
          }).filter(Boolean));
        }
        saveBuilder();
        state.tab = 'builder';
        renderPanel(); updateTabButtons();
        break;
      }

      case 'add-structure-tag':
        state.promptBuilder.structureTags.push(actionEl.dataset.tag);
        saveBuilder();
        rerenderPanel();
        break;

      case 'remove-structure-tag':
        state.promptBuilder.structureTags.splice(parseInt(actionEl.dataset.index, 10), 1);
        saveBuilder();
        rerenderPanel();
        break;

      case 'clear-structure':
        state.promptBuilder.structureTags = [];
        saveBuilder();
        rerenderPanel();
        break;

      case 'clear-builder':
        state.promptBuilder = defaultPromptBuilder();
        saveBuilder();
        rerenderPanel();
        break;

      // ---- WILDCARDS ----
      case 'reroll-all-wildcards':
        rerollAllWildcards();
        rerenderPanel();
        break;

      case 'reroll-wildcard':
        rerollWildcard(actionEl.dataset.id);
        rerenderPanel();
        break;

      case 'toggle-wildcard-lock': {
        const slot = getWildcardSlot(actionEl.dataset.id);
        if (slot) slot.locked = !slot.locked;
        rerenderPanel();
        break;
      }

      case 'clear-wildcard': {
        const slot = getWildcardSlot(actionEl.dataset.id);
        if (slot && !slot.locked) slot.tag = '';
        rerenderPanel();
        break;
      }

      case 'apply-wildcard-preset': {
        const preset = window.WILDCARD_PRESETS.find(p => p.id === actionEl.dataset.preset);
        if (preset) {
          const active = new Set(preset.active);
          state.wildcard.slots.forEach(s => {
            s.tag = active.has(s.id) ? randomFrom(window.WILDCARD_POOLS.find(p => p.id === s.id).tags) : '';
            s.locked = false;
          });
        }
        rerenderPanel();
        break;
      }

      case 'goto-builder':
        state.tab = 'builder';
        renderPanel(); updateTabButtons();
        break;

      case 'goto-wildcards':
        state.tab = 'wildcards';
        renderPanel(); updateTabButtons();
        break;
    }
  });

  document.addEventListener('input', function (e) {
    const t = e.target;
    const action = t.dataset.action;
    if (!action) return;
    switch (action) {
      case 'search-sounds': state.soundSearch = t.value; rerenderPanel(); break;
      case 'search-glossary': state.glossarySearch = t.value; rerenderPanel(); break;
      case 'search-recipes': state.recipeSearch = t.value; rerenderPanel(); break;
      case 'set-genre-tag': state.promptBuilder.genreTag = t.value; saveBuilder(); rerenderPanel(); break;
      case 'set-mood-tags': state.promptBuilder.moodTags = t.value; saveBuilder(); rerenderPanel(); break;
      case 'set-production-tags': state.promptBuilder.productionTags = t.value; saveBuilder(); rerenderPanel(); break;
      case 'set-builder-bpm': state.promptBuilder.bpm = parseInt(t.value, 10) || 0; saveBuilder(); rerenderPanel(); break;
      case 'set-builder-key': state.promptBuilder.key = t.value; saveBuilder(); rerenderPanel(); break;
      case 'set-negative': state.promptBuilder.negative = t.value; saveBuilder(); rerenderPanel(); break;
      case 'set-bpm': {
        const bpm = parseInt(t.value, 10);
        state.groove.bpm = bpm;
        window.audioEngine.setBpm(bpm);
        const readout = document.getElementById('bpm-readout');
        if (readout) readout.textContent = bpm;
        break;
      }
      case 'set-swing': {
        const sw = parseInt(t.value, 10) || 0;
        state.groove.swing = sw / 100;
        window.audioEngine.setSwing(state.groove.swing);
        const readout = document.getElementById('swing-readout');
        if (readout) readout.textContent = sw + '%';
        break;
      }
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.dataset.action === 'toggle-fav-filter') {
      state.soundFavoritesOnly = e.target.checked;
      rerenderPanel();
    }
    if (e.target.dataset.action === 'toggle-wildcard-append') {
      state.wildcard.appendToPrompt = e.target.checked;
      rerenderPanel();
    }
  });

  // Keyboard shortcut: Space re-rolls all unlocked wildcard cards while on
  // the Wildcards tab (ignored when typing in an input/textarea).
  document.addEventListener('keydown', function (e) {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    if (e.code === 'Space' && state.tab === 'wildcards') {
      e.preventDefault();
      rerollAllWildcards();
      rerenderPanel();
    }
  });

  // ------------------------------------------------------------- INIT
  function init() {
    loadBuilder();
    buildShell();
    renderPanel();
    updateTabButtons();
    updateTransportPlayState();
    updateGrooveLayerReadout();
    // reflect persisted/initial swing on the transport slider
    const swingSlider = document.getElementById('swing-slider');
    const swingReadout = document.getElementById('swing-readout');
    if (swingSlider) {
      swingSlider.value = Math.round((state.groove.swing || 0) * 100);
      if (swingReadout) swingReadout.textContent = swingSlider.value + '%';
      window.audioEngine.setSwing(state.groove.swing || 0);
    }
    window.audioEngine.onStep = function (step) {
      const lights = document.querySelectorAll('.step-light');
      lights.forEach(el => el.classList.remove('lit'));
      if (lights[step]) lights[step].classList.add('lit');
    };
  }
  document.addEventListener('DOMContentLoaded', init);
})();
