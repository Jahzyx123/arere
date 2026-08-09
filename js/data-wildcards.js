/* ==========================================================================
   WILDCARD PROMPT INJECTOR — DATA
   Each "pool" is an array of surprising, deliberately off-genre descriptive
   tags. The Wildcard Injector draws one tag per pool and appends the active
   ones to your locked core prompt, forcing Suno out of its comfort zone.
   Lock a card (🔒) to freeze a tag you love; re-roll the rest freely.
   ========================================================================== */

window.WILDCARD_POOLS = [
  {
    id: 'instrument',
    label: 'Unexpected Instrument',
    icon: '\u{1F3B9}',
    blurb: 'A sound source that has no business being in a techno track.',
    tags: [
      'music-box melody', 'baroque harpsichord trills', 'gamelan ensemble',
      'kazoo riff', 'theremin lead', 'sitar drone', 'wheezing accordion chords',
      'choir-boy soprano', 'brass fanfare stabs', 'toy piano plinks',
      'koto string plucks', 'distant bagpipe drones', 'ukulele skank',
      'dreamy vibraphone', 'mandolin tremolo', 'steel-drum melody',
      'mariachi trumpets', 'orchestral timpani rolls', 'fujara flute overtone',
      'prepared-piano plunks', 'throat-singing overtone', 'lute tremolo',
      'zither strums', 'spinet harpsichord', 'hang-drum ping',
      'reed organ pump', 'psaltery drones', 'mbira thumb piano',
      'sleigh-bell crescendo', 'gong resonance'
    ]
  },
  {
    id: 'space',
    label: 'Sonic Space / Production',
    icon: '\u{1F30C}',
    blurb: 'A weird room, medium, or lo-fi treatment over the whole mix.',
    tags: [
      'recorded in a cathedral cistern', 'AM-radio telephone filter',
      'underwater and muffled', 'warbling cassette tape',
      'crackling 78rpm shellac', 'binaural room tone',
      'through a broken megaphone', 'vast concrete-tunnel reverb',
      'bit-crushed 8-bit', 'lo-fi VHS warble', 'dripping spring reverb',
      'dub tape-delay wash', 'stadium PA system', 'close-mic\u2019d and bone dry',
      'through a tin-can telephone', 'resampled to 8kHz', 'inside a metal tanker',
      'rainy warehouse ambience', 'telephone hold-music EQ',
      'dictaphone mono crunch', 'bleeding from a neighboring club',
      'old PA feedback haze', 'wind-tunnel slapback',
      'through a spinning Leslie cabinet'
    ]
  },
  {
    id: 'rhythm',
    label: 'Rhythm / Feel',
    icon: '\u{1F941}',
    blurb: 'A rhythmic grid or swing that fights the four-on-the-floor.',
    tags: [
      'half-time lurch', 'cut-up breakbeat', 'shuffled 16ths',
      'military snare march', '6/8 lilt', 'reggaeton dembow pulse',
      'boom-bap swing', 'broken-beat stagger',
      'four-to-the-floor but limping', 'samba-school percussion barrage',
      'waltz-time march', 'two-step garage skip', 'jerky off-grid groove',
      'double-time hi-hat frenzy', 'dembow-meets-techno',
      'slow-mo trap hi-hats', 'Afro-Cuban clave', 'Baltimore club claps',
      'Jersey-club bed squeaks', 'footwork juke pattern'
    ]
  },
  {
    id: 'crossover',
    label: 'Crossover / Source',
    icon: '\u{1F3AC}',
    blurb: 'A completely different genre or cinematic world bleeding in.',
    tags: [
      'spaghetti-western whistle', '80s horror-soundtrack dread',
      'vaporwave slo-mo', 'circus calliope', 'exotica lounge',
      'Italo-disco arpeggio', 'no-wave skronk', 'krautrock motorik',
      'Ennio-Morricone twang', 'James-Bond noir jazz',
      'video-game menu music', 'gospel-choir lift', 'surf-rock reverb twang',
      'Tuvan throat singing', 'parlour piano rag', 'cosmic synthwave',
      'spaghetti-industrial twang', '70s police-chase funk',
      'medieval minstrel drone', 'spy-film tremolo guitar',
      'holiday-carol bells', 'south-of-the-border trumpet',
      'Hawaiian slack-key', 'noir saxophone solo'
    ]
  },
  {
    id: 'texture',
    label: 'Texture / FX',
    icon: '\u2728',
    blurb: 'A strange texture or transition layer running under the track.',
    tags: [
      'glitchy transition stutters', 'contact-mic metal scrapes',
      'field-recording crowd murmur', 'rain on a tin roof',
      'distant fireworks', 'dead TV-channel static',
      'wind howling through wire', 'bubbling water',
      'machine-shop clangs', 'vinyl locked-groove loop',
      'sci-fi computer blips', 'night-insect chatter',
      'paper-tearing rhythm', 'broken-modem squawk',
      'sparkling granular shimmer', 'spinning-coin tail',
      'rustling plastic bags', 'bowed cymbal screech',
      'shortwave radio drift', 'typewriter clatter',
      'distant thunder cracks', 'boiling water texture',
      'marble-clacking percussion', 'neon-sign buzz'
    ]
  }
];

// Weirdness presets decide which pools are active by default.
window.WILDCARD_PRESETS = [
  { id: 'mild', label: 'Mild', icon: '\u{1F60C}', active: ['space', 'texture'],
    note: 'One treatment + one texture. Barely weird.' },
  { id: 'wild', label: 'Wild', icon: '\u{1F31A}', active: ['instrument', 'space', 'texture'],
    note: 'An instrument, a space, and a texture — three tags.' },
  { id: 'unhinged', label: 'Unhinged', icon: '\u{1F92A}', active: ['instrument', 'space', 'rhythm', 'crossover', 'texture'],
    note: 'Everything on. Maximum creative chaos.' }
];
