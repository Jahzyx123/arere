/* ==========================================================================
   SUNO MECHANICS CHEAT SHEET
   Grounded on Suno's current model family (v4.5 / v5 / v5.5, mid-2026).
   Suno changes fairly often \u2014 treat exact character counts as "current best
   knowledge", not a guarantee, and re-check Suno's own interface if a field
   seems to be truncating differently than described here.
   ========================================================================== */

window.CHEATSHEET = {

  limits: [
    { model: 'v4.5 / v5 / v5.5 (current)', style: '~1,000 characters', lyrics: '~5,000 characters', note: 'The style field got 5x bigger with v4.5. Most people still under-use it.' },
    { model: 'v4 and older', style: '~200 characters', lyrics: '~3,000 characters', note: 'If a prompt feels like it\u2019s being ignored past a certain point, you may be generating on an older model.' },
  ],

  fieldBasics: [
    { field: 'Style of Music', use: 'Plain, comma-separated descriptive tags: genre, mood, instrumentation, production quality, tempo, key. No square brackets here.' },
    { field: 'Lyrics', use: 'Actual lyrics if the track has vocals \u2014 or, for an instrumental track, just the [bracketed] structure tags with no lyric text underneath them.' },
    { field: 'Tempo & key', use: 'Write as plain text in the Style field, e.g. "132 BPM, A minor". Brackets are reserved for structure tags in the Lyrics field, not tempo/key.' },
    { field: 'Negative / exclude prompts', use: 'Works best placed at the end of the Style field (e.g. "...instrumental, no vocals, no lyrics"). Suno reads positive descriptors first, then applies exclusions.' },
  ],

  structureTags: [
    { tag: '[Intro]', use: 'Opening section, typically sparser than the main groove.' },
    { tag: '[Build-Up]', use: 'Rising tension \u2014 pair with a riser/sweep tag in your sound choices for the clearest result.' },
    { tag: '[Drop]', use: 'The payoff moment \u2014 the single most reliable structure tag for electronic music specifically. Don\u2019t use it on non-electronic genres; it tends to force an EDM-style drop even where you don\u2019t want one.' },
    { tag: '[Breakdown]', use: 'Strips elements away \u2014 usually drums \u2014 for a lower-energy section before the next build.' },
    { tag: '[Instrumental]', use: 'General-purpose "keep playing, no vocals" marker for a section.' },
    { tag: '[Instrumental Break]', use: 'A dedicated instrumental passage inside an otherwise vocal track; on a fully instrumental techno track this doubles as a generic "groove continues" marker.' },
    { tag: '[Outro]', use: 'Closing section. Worth specifying how it ends \u2014 "fades" vs. "abrupt cut" \u2014 since genres like hard techno often want the latter.' },
  ],

  tips: [
    'Keep the whole style prompt to roughly 8\u201315 tags. More than that and tags start diluting each other rather than adding detail.',
    'Front-load what matters most. Suno weighs earlier words in the Style field more heavily, and if you\u2019re ever on an older/shorter-limit model the end of the prompt is what gets silently cut.',
    'Tags are probabilistic hints, not guaranteed commands \u2014 Suno usually follows them but can ignore one. If a tag gets ignored, try the exact same prompt again once or twice before concluding the tag doesn\u2019t work; regeneration variance is real.',
    'Short, concrete tags (1\u20133 words) generally outperform long descriptive sentences.',
    'Instrumental tracks still benefit from structure tags in the Lyrics field \u2014 leaving that field completely empty gives Suno far less to work with than a handful of [bracketed] section markers.',
    'Naming distortion, reverb, or filtering on a specific element ("reverb-drenched chord stab") steers the result more precisely than putting the same word in a general mix-quality tag.',
  ],
};
