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

**Sound Library** — 380+ techno-specific sounds across kicks, snares,
hats/cymbals, percussion, bass/sub, leads/arps, pads/drones, vocal
chops, FX/risers, and textures. Every card shows the exact keyword
phrase to paste into Suno's *Style of Music* field, a plain-English
description of the sound, and producer notes on what it actually does
in a track. Hit ▶ to hear an original synthesized approximation, ⧉ to
copy the keyword, or "+ Add to prompt" to stack it into the Prompt
Builder. Already-in-prompt sounds are marked on their cards.

**Track Formulas** — 25 full production recipes across techno's core
and modern subgenres (peak-time, melodic, hard, schranz, psy-techno,
dub, Berlin dub, minimal, Rominimal, acid, industrial, EBM, hypnotic,
Detroit, raw/broken, deep, ambient, tribal, afro, darkwave, uplifting
trance-techno crossover, hard trance-techno, hardgroove, Afterlife-style
melodic deep, and bass techno). Each one has a ready-to-paste style
prompt, a bracket-tag arrangement for the Lyrics field, a trimmed
fallback for Suno's older 200-character models, and producer commentary
on why the combination works.

**Glossary** — 33 rarer/regional subgenre labels (schranz, Rominimal,
ghettotech, free tekno, neo-trance, DeepChord-style dub, Italo
hardgroove, and more) with a short description each — extra vocabulary
to fold into any prompt, without a full recipe attached.

**Prompt Builder** — combines a genre tag, mood/energy tags, production
tags, your stacked sound keywords, BPM, key, and a negative/exclude tag
into a live, character-counted, auto-deduplicated style prompt, plus a
click-to-build structure-tag sequence for the Lyrics field. Load any
recipe straight into it with one click; the whole builder is saved in
your browser automatically.

**The groove transport** (top bar, present on every tab) plays a
four-on-the-floor reference beat with adjustable BPM and swing. Toggle
"⏵ Layer" on any sound card to hear it locked into that beat — closed
hats automatically roll as 16ths, sequenced basslines play their
patterns, and pads/FX/textures fire on bar boundaries.

**🎲 Wildcard Prompt Injector** — five lockable "wildcard" cards
(Unexpected Instrument, Sonic Space, Rhythm/Feel, Crossover/Source,
Texture/FX), each holding an array of deliberately off-genre tags.
Build your core prompt in the Prompt Builder, then hit **Re-roll** to
append randomized weird tags that push Suno out of its comfort zone.
Lock 🔒 a card to freeze a tag you love — it survives every re-roll
while the other cards rotate. Weirdness presets (Mild / Wild /
Unhinged) decide how many cards are active, and all tags are injected
just before the negative prompt so exclusions stay last. Press
**Space** on the tab to re-roll quickly.

**Suno Cheat Sheet** — current character limits by model version, which
field things belong in, a structure-tag reference, and general
prompting tips.

**Extras:** a **🎲 Surprise me** button on the Sound Library plays a
random sound from the current filter; the **Audition** button plays a
whole category through in sequence; and the transport has adjustable
**BPM and swing** for layering sounds into a live groove.

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
index.html              entry point — open this
css/style.css           all styling
js/data-sounds.js       core sound library
js/data-sounds-v3.js    v3 expansion sounds
js/data-sounds-v4.js    v4 expansion sounds
js/data-sounds-v5.js    v5 expansion sounds
js/data-wildcards.js    Wildcard Injector tag pools
js/data-recipes.js      25 full track-formula recipes
js/data-glossary.js     33 glossary entries
js/data-cheatsheet.js   Suno mechanics reference data
js/audio-engine.js      Web Audio synthesis + groove transport scheduler
js/app.js               UI state, rendering, event wiring
```

No dependencies, no `npm install`, nothing to build. Edit the data files
directly if you want to add your own sounds or recipes — each entry is a
plain JavaScript object, and the app re-reads them on page load.
