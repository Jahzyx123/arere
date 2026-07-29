# Signal Patch — Techno Toolkit for Suno.AI

A self-contained, offline-capable web app for producing techno and
sub-techno tracks on Suno.AI. No installs, no build step, no account,
no server. Everything runs client-side in your browser.

## Opening it

Unzip the folder, then double-click **`index.html`** — it opens in your
default browser. (You can also drag the folder into a browser window.)

Because browsers block audio until you interact with the page, click any
**▶ Preview** button once to wake the audio engine up — after that,
previews and the groove transport play instantly.

For the best experience use a recent Chrome, Firefox, Edge, or Safari.
An internet connection is only used once, optionally, to load the Oswald
/ JetBrains Mono / Inter fonts from Google Fonts — if you're offline the
page falls back to your system fonts and everything still works.

## What's inside

**Sound Library** — ~60 techno-specific sounds (kicks, hats, percussion,
basslines, leads/arps, pads/drones, FX/risers, textures). Every card
shows the exact keyword phrase to paste into Suno's *Style of Music*
field, a plain-English description of the sound, and producer notes on
what it actually does in a track. Hit ▶ to hear an original synthesized
approximation, ⧉ to copy the keyword, or "+ Add to prompt" to stack it
into the Prompt Builder.

**Track Formulas** — 15 full production recipes across techno's core
subgenres (peak-time, melodic, hard, dub, minimal, acid, industrial,
hypnotic, Detroit, raw/broken, deep, ambient, tribal, uplifting
trance-techno crossover, hardgroove). Each one has a ready-to-paste
style prompt, a bracket-tag arrangement for the Lyrics field, a trimmed
fallback for Suno's older 200-character models, and producer commentary
on why the combination works.

**Glossary** — 25 rarer/regional subgenre labels (schranz, Rominimal,
ghettotech, free tekno, and more) with a short description each — extra
vocabulary to fold into any prompt, without a full recipe attached.

**Prompt Builder** — combines a genre tag, mood tags, your stacked
sound keywords, BPM, key, and a negative/exclude tag into a live,
character-counted style prompt, plus a click-to-build structure-tag
sequence for the Lyrics field. Load any recipe straight into it with
one click.

**Suno Cheat Sheet** — current character limits by model version, which
field things belong in, a structure-tag reference, and general
prompting tips.

**The groove transport** (top bar, present on every tab) plays a
four-on-the-floor reference beat. Toggle "⏵ Layer in groove" on any
sound card to hear it locked into that beat instead of as a one-shot —
handy for judging how a bassline or pad actually sits in a track.

Favorites (★) and everything you build in the Prompt Builder are kept
in your browser's local storage on your machine only — nothing is sent
anywhere.

## Notes on accuracy

- Every audio preview is original Web Audio synthesis built to
  approximate the *character* of a sound — a reference sketch, not
  Suno's actual output, and not a sample of any copyrighted drum
  machine, patch, or record.
- Suno's field mechanics (character limits, tag syntax) reflect the
  current model family as of mid-2026 and can change — if something in
  the Cheat Sheet stops matching what you see in Suno, trust Suno's own
  interface.
- Subgenre lines in techno are drawn by DJs and record shops more than
  any standards body — treat the glossary and recipes as a well-informed
  starting point, not gospel.

## Folder structure

```
index.html            entry point — open this
css/style.css          all styling
js/data-sounds.js      sound library data (~60 entries)
js/data-recipes.js     15 full track-formula recipes
js/data-glossary.js    25 glossary entries
js/data-cheatsheet.js  Suno mechanics reference data
js/audio-engine.js     Web Audio synthesis + groove transport scheduler
js/app.js              UI state, rendering, event wiring
```

No dependencies, no `npm install`, nothing to build. Edit the data files
directly if you want to add your own sounds or recipes — each entry is a
plain JavaScript object, and the app re-reads them on page load.
