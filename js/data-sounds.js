/* ==========================================================================
   SOUND LIBRARY DATA  (v2 — expanded)
   Every entry: { id, name, category, subtype?, keyword, desc, role, engine, params }
   - keyword : the exact phrase to drop into a Suno Style-of-Music field
   - desc    : what the sound physically is
   - role    : why a techno producer reaches for it / what it does in a track
   - engine  : which synth engine in audio-engine.js renders the preview
   - params  : engine-specific synthesis parameters
   NOTE: previews are original Web Audio synthesis built to *approximate* the
   character of each sound — they are reference sketches, not the actual
   Suno output, and not samples of copyrighted drum machines or records.
   ========================================================================== */

window.SOUND_LIBRARY = [

// ---------------------------------------------------------------------- KICK
{
  id: 'kick-peak-time', name: 'Peak-Time Kick', category: 'kick',
  keyword: 'punchy peak-time techno kick',
  desc: 'A tight kick with a fast pitch snap from click to thud and a short tail.',
  role: 'The backbone of a peak-time set — short enough to stay out of the way at loud PA volumes, letting a separate sub layer carry the low-end weight.',
  engine: 'kick', params: { startFreq:180, endFreq:48, pitchDecay:0.045, ampDecay:0.32, drive:0.25, click:0.6, sub:0.5 }
},
{
  id: 'kick-rolling-minimal', name: 'Rolling Minimal Kick', category: 'kick',
  keyword: 'rolling minimal techno kick, soft transient',
  desc: 'A rounder, softer-attack kick with a longer pitch glide and gentle low end.',
  role: 'Built to loop for minutes without fatigue — minimal techno leans on a kick you can groove to for eight bars straight without it fighting the percussion.',
  engine: 'kick', params: { startFreq:140, endFreq:50, pitchDecay:0.06, ampDecay:0.28, drive:0.1, click:0.3, sub:0.4 }
},
{
  id: 'kick-industrial-distorted', name: 'Distorted Industrial Kick', category: 'kick',
  keyword: 'distorted industrial techno kick, saturated',
  desc: 'A heavily saturated kick where the drive stage adds grit and upper harmonics.',
  role: 'Gives industrial techno its mechanical, metallic low end — the distortion pushes the kick into the mids so it reads as aggressive even on small speakers.',
  engine: 'kick', params: { startFreq:160, endFreq:45, pitchDecay:0.05, ampDecay:0.4, drive:0.7, click:0.4, sub:0.3 }
},
{
  id: 'kick-deep-dub', name: 'Deep Dub Kick', category: 'kick',
  keyword: 'deep dub techno kick, soft attack, long tail',
  desc: 'A slow, round kick with almost no click and a long, warm decay.',
  role: 'Dub techno hides the kick inside the chords instead of in front of them — a soft attack lets it sit underneath reverb-drenched stabs without clashing.',
  engine: 'kick', params: { startFreq:110, endFreq:42, pitchDecay:0.09, ampDecay:0.5, drive:0.05, click:0.15, sub:0.7 }
},
{
  id: 'kick-hard-techno', name: 'Hard Techno Kick', category: 'kick',
  keyword: 'hard techno kick, distorted, aggressive transient',
  desc: 'A fast, splashy click into a heavily driven, almost square-wave body.',
  role: 'Hard techno and schranz push the kick until it becomes a rhythmic distortion instrument in its own right — it is loud enough to define the track’s whole identity.',
  engine: 'kick', params: { startFreq:200, endFreq:55, pitchDecay:0.035, ampDecay:0.3, drive:0.85, click:0.7, sub:0.35 }
},
{
  id: 'kick-acid-ready', name: 'Acid-Ready Kick', category: 'kick',
  keyword: 'tight acid techno kick, short decay',
  desc: 'A short, dry kick with a clear click, cut deliberately tight in the tail.',
  role: 'Leaves a pocket of silence for a resonant 303 bassline to squelch into — acid techno needs the kick out of the bass’s frequency space fast.',
  engine: 'kick', params: { startFreq:170, endFreq:50, pitchDecay:0.04, ampDecay:0.25, drive:0.3, click:0.55, sub:0.4 }
},
{
  id: 'kick-sub-warehouse', name: 'Sub-Heavy Warehouse Kick', category: 'kick',
  keyword: 'sub-heavy warehouse techno kick, deep low end',
  desc: 'A long, weighty kick where most of the energy sits below 60Hz.',
  role: 'Written for a big rig, not headphones — this is the kick that moves air in a warehouse and gives a track physical weight on a proper system.',
  engine: 'kick', params: { startFreq:130, endFreq:40, pitchDecay:0.07, ampDecay:0.55, drive:0.15, click:0.2, sub:0.85 }
},
{
  id: 'kick-lofi-analog', name: 'Lo-fi Analog Kick', category: 'kick',
  keyword: 'lo-fi analog drum machine kick, dusty',
  desc: 'A dulled, slightly boxy kick as if run through worn analog circuitry.',
  role: 'Adds character and imperfection — useful when a track is too clean and needs the warmth and grit of vintage drum-machine hardware.',
  engine: 'kick', params: { startFreq:150, endFreq:48, pitchDecay:0.05, ampDecay:0.3, drive:0.2, click:0.35, sub:0.3, tone:3600 }
},
{
  id: 'kick-hardgroove', name: 'Hardgroove Pumping Kick', category: 'kick',
  keyword: 'hardgroove pumping techno kick, tight body',
  desc: 'A compact, woody kick with a pronounced mid thump and a controlled sub tail.',
  role: 'Built to lock with percussion and a funky bassline — its short, punchy body leaves room for the swung hi-hats and tribal percussion that define hardgroove.',
  engine: 'kick', params: { startFreq:165, endFreq:52, pitchDecay:0.04, ampDecay:0.26, drive:0.2, click:0.5, sub:0.45, tone:2800 }
},
{
  id: 'kick-melodic-soft', name: 'Melodic Soft Kick', category: 'kick',
  keyword: 'soft melodic techno kick, warm round body',
  desc: 'A round, warm kick with a gentle click and a smooth, musical low end.',
  role: 'Keeps melodic techno grooving without overpowering emotive pads and leads — soft enough to sit under a breakdown but solid enough for a club mix.',
  engine: 'kick', params: { startFreq:140, endFreq:46, pitchDecay:0.06, ampDecay:0.42, drive:0.08, click:0.25, sub:0.6 }
},
{
  id: 'kick-hypnotic-damped', name: 'Hypnotic Damped Kick', category: 'kick',
  keyword: 'damped hypnotic techno kick, soft thud',
  desc: 'A deliberately muted kick with a soft beater and a quickly-squashed tail.',
  role: 'Lets percussion and texture carry the hypnotic groove while the kick acts as a felt pulse rather than an attention-grabbing hit.',
  engine: 'kick', params: { startFreq:135, endFreq:47, pitchDecay:0.055, ampDecay:0.22, drive:0.05, click:0.18, sub:0.35, tone:1200 }
},
{
  id: 'kick-tribal-low', name: 'Tribal Low Tom-Kick', category: 'kick',
  keyword: 'low tribal tom kick, round and pitched',
  desc: 'A round, pitched kick closer to a low floor tom, with a soft attack.',
  role: 'Blends the four-on-the-floor pulse with hand-drum character, anchoring tribal and afro-techno rhythms without a clinical drum-machine feel.',
  engine: 'kick', params: { startFreq:120, endFreq:58, pitchDecay:0.08, ampDecay:0.34, drive:0.05, click:0.2, sub:0.5 }
},
{
  id: 'kick-90s-rave', name: '90s Rave Kick', category: 'kick',
  keyword: '90s rave techno kick, punchy and bright',
  desc: 'A punchy, slightly bright kick with a snappy transient and compact tail.',
  role: 'The classic early-90s rave kick that cuts through big piano stabs, hoover bass and breakbeats — nostalgic but still club-effective.',
  engine: 'kick', params: { startFreq:175, endFreq:50, pitchDecay:0.045, ampDecay:0.28, drive:0.18, click:0.6, sub:0.4, tone:5200 }
},
{
  id: 'kick-berghain', name: 'Berlin Berghain-Style Kick', category: 'kick',
  keyword: 'Berlin Berghain-style techno kick, deep and dry',
  desc: 'A deep, dry, medium-long kick with a clean low body and minimal click.',
  role: 'The understated but physical kick at the heart of long, hypnotic Berlin sets — powerful without being aggressive, designed to marathon-mix.',
  engine: 'kick', params: { startFreq:130, endFreq:44, pitchDecay:0.07, ampDecay:0.45, drive:0.12, click:0.22, sub:0.7 }
},
{
  id: 'kick-schranz', name: 'Schranz Napalm Kick', category: 'kick',
  keyword: 'schranz napalm kick, heavily distorted clicky',
  desc: 'An extremely driven kick with a tearing click and a saturated, almost noisy body.',
  role: 'Defines schranz and industrial hard techno — the distortion turns the kick into a wall of rhythmic noise that dominates the entire mix.',
  engine: 'kick', params: { startFreq:210, endFreq:55, pitchDecay:0.03, ampDecay:0.32, drive:1, click:0.85, sub:0.4 }
},
{
  id: 'kick-trance', name: 'Trance-Techno Kick', category: 'kick',
  keyword: 'trance-techno kick, punchy with long sub tail',
  desc: 'A kick with a sharp beater and a longer, clean sub tail under it.',
  role: 'Gives uplifting and hard trance-techno crossovers their driving, elevated energy — the long tail sustains momentum under big leads and builds.',
  engine: 'kick', params: { startFreq:185, endFreq:47, pitchDecay:0.05, ampDecay:0.48, drive:0.15, click:0.55, sub:0.7 }
},
{
  id: 'kick-psy', name: 'Psy-Techno Kick', category: 'kick',
  keyword: 'psy-techno kick, punchy with rolling basstop',
  desc: 'A tight, clicky kick designed to sit against a fast rolling bassline.',
  role: 'Leaves precise space between kicks for a psytrance-style rolling bass to fire, keeping the low end fast and articulate instead of muddy.',
  engine: 'kick', params: { startFreq:190, endFreq:55, pitchDecay:0.035, ampDecay:0.2, drive:0.25, click:0.6, sub:0.45 }
},
{
  id: 'kick-electro', name: 'Electro-Techno Kick', category: 'kick',
  keyword: 'electro-techno 808-style kick, long sine pitch drop',
  desc: 'A clean sine kick with a longer, deeper pitch envelope, reminiscent of an 808.',
  role: 'Adds electro and Miami-bass weight to a techno framework — its deep, tonal tail works with robotic basslines and broken patterns.',
  engine: 'kick', params: { startFreq:220, endFreq:38, pitchDecay:0.12, ampDecay:0.5, drive:0.05, click:0.25, sub:0.6 }
},
{
  id: 'kick-birmingham', name: 'Birmingham Industrial Kick', category: 'kick',
  keyword: 'Birmingham industrial kick, raw boxy and saturated',
  desc: 'A raw, boxy, mid-heavy kick with moderate saturation and no polish.',
  role: 'Carries the monochrome, post-punk-infused pressure of UK industrial techno — stark, loud, and intentionally unpretty.',
  engine: 'kick', params: { startFreq:155, endFreq:46, pitchDecay:0.05, ampDecay:0.3, drive:0.55, click:0.4, sub:0.4, tone:2400 }
},
{
  id: 'kick-afterlife', name: 'Afterlife-Style Deep Kick', category: 'kick',
  keyword: 'Afterlife-style deep melodic techno kick, warm and wide',
  desc: 'A warm, full-bodied kick with a soft attack and a rounded, musical sub.',
  role: 'Powers festival-scale melodic deep techno — present enough for a mainstage but smooth enough to sit under orchestral pads and big leads.',
  engine: 'kick', params: { startFreq:145, endFreq:44, pitchDecay:0.06, ampDecay:0.46, drive:0.1, click:0.3, sub:0.7 }
},

// ----------------------------------------------------------------- SNARE/RIM
{
  id: 'snare-classic-techno', name: 'Classic Techno Snare', category: 'snare',
  keyword: 'classic techno snare, crisp and tight',
  desc: 'A tight snare built from a tonal body and a short noise burst.',
  role: 'Adds backbeat weight on beats 2 and 4, giving a groove a stronger, more song-like anchor than a clap alone.',
  engine: 'snare', params: { decay:0.2, tone:180, noise:0.6, snap:0.5 }
},
{
  id: 'snare-reverb-90s', name: 'Reverb 90s Rave Snare', category: 'snare',
  keyword: '90s rave snare with reverb tail',
  desc: 'A brighter snare with a longer decay that suggests a reverb tail.',
  role: 'A nostalgic rave accent — a single snare hit into a reverb tail marks a section change or fills the gap before a drop.',
  engine: 'snare', params: { decay:0.45, tone:210, noise:0.85, snap:0.7 }
},
{
  id: 'snare-industrial', name: 'Industrial Metal Snare', category: 'snare',
  keyword: 'industrial metal snare, harsh and distorted',
  desc: 'A harsh, distorted, metallic snare with a tearing noise component.',
  role: 'Reinforces an industrial or EBM-techno track’s aggressive, mechanical identity, cutting through walls of distortion.',
  engine: 'snare', params: { decay:0.28, tone:160, noise:1, snap:0.9, drive:0.7 }
},
{
  id: 'snare-lofi-brush', name: 'Lo-fi Brushy Snare', category: 'snare',
  keyword: 'lo-fi brushy snare, soft and dusty',
  desc: 'A soft, filtered, low-tuned snare with a dusty noise texture.',
  role: 'Brings warmth and a live, hand-played feel to deep, Detroit, or lo-fi raw techno without a sharp, digital attack.',
  engine: 'snare', params: { decay:0.18, tone:130, noise:0.5, snap:0.3, toneFilter:2600 }
},
{
  id: 'snare-march', name: 'EBM Marching Snare', category: 'snare',
  keyword: 'EBM marching snare roll, tight military',
  desc: 'A tight, snappy military-style snare with a crisp, even noise snap.',
  role: 'Lends EBM-techno its disciplined, martial cadence, especially effective in rolling fills and section builds.',
  engine: 'snare', params: { decay:0.16, tone:200, noise:0.7, snap:0.75 }
},
{
  id: 'snare-clap-stack', name: 'Snare + Clap Stack', category: 'snare',
  keyword: 'layered snare and clap stack, big backbeat',
  desc: 'A snare layered conceptually with a clap for a bigger, wider backbeat.',
  role: 'Gives peak-time and big-room techno a larger-than-life backbeat that reads clearly over loud kick and bass.',
  engine: 'snare', params: { decay:0.26, tone:190, noise:0.8, snap:0.6, clap:true }
},

// ----------------------------------------------------------------- HAT/CYMBAL
{
  id: 'hat-closed-tight', name: 'Closed Hat (Tight)', category: 'hat',
  keyword: 'tight closed hi-hat, 16th note',
  desc: 'A short, high, filtered noise tick with almost no ring.',
  role: 'Drives the groove forward on the 16ths without adding clutter — the shortness is what keeps a fast pattern feeling crisp instead of washy.',
  engine: 'hat', params: { decay:0.05, filterFreq:8000, filterQ:1.2, metallic:false, noiseType:'white' }
},
{
  id: 'hat-open-driving', name: 'Open Hat (Driving)', category: 'hat',
  keyword: 'driving open hi-hat, offbeat',
  desc: 'A longer, airier noise burst that rings out before the next kick cuts it off.',
  role: 'The classic offbeat “chick” that makes a four-on-the-floor track swing forward — it defines the pulse as much as the kick does.',
  engine: 'hat', params: { decay:0.28, filterFreq:7000, filterQ:0.9, metallic:false, noiseType:'white' }
},
{
  id: 'hat-metallic', name: 'Metallic Hat', category: 'hat',
  keyword: 'metallic techno hi-hat, bell-like',
  desc: 'A noise burst layered with a few inharmonic sine partials for a bell-like ring.',
  role: 'Reads as more “tuned” and deliberate than a plain noise hat — useful in melodic and hypnotic techno where every element needs a pitch identity.',
  engine: 'hat', params: { decay:0.22, filterFreq:9000, filterQ:2, metallic:true, noiseType:'white' }
},
{
  id: 'hat-shaker', name: 'Analog Shaker', category: 'hat',
  keyword: 'analog shaker loop, steady 16ths',
  desc: 'A soft, mid-filtered noise texture with a rounder envelope than a hat.',
  role: 'Fills the gaps between kick and hat with constant, low-key motion — a staple of tribal and hypnotic techno grooves that need to feel alive without new events.',
  engine: 'hat', params: { decay:0.09, filterFreq:4500, filterQ:0.6, metallic:false, noiseType:'pink' }
},
{
  id: 'hat-ride-hypnotic', name: 'Ride Cymbal (Hypnotic)', category: 'hat',
  keyword: 'hypnotic ride cymbal, sustained wash',
  desc: 'A sustained, shimmering noise wash with a slow decay and metallic overtones.',
  role: 'Sits underneath everything as a constant shimmer — hypnotic and Berlin-style techno often use it instead of a hat to soften the groove’s edges.',
  engine: 'hat', params: { decay:0.6, filterFreq:6500, filterQ:1.5, metallic:true, noiseType:'white' }
},
{
  id: 'hat-crash-riser', name: 'Crash Riser Cymbal', category: 'hat',
  keyword: 'crash cymbal riser, bright wash',
  desc: 'A long, bright, slowly-decaying cymbal wash used as a one-off accent.',
  role: 'Marks a section change — a single crash at the top of a drop or breakdown tells the listener’s ear “something just happened” without needing a full fill.',
  engine: 'hat', params: { decay:1.6, filterFreq:8000, filterQ:0.8, metallic:true, noiseType:'white' }
},
{
  id: 'hat-tape-saturated', name: 'Tape-Saturated Hat', category: 'hat',
  keyword: 'tape-saturated hi-hat, warm and dull',
  desc: 'A closed hat with its top end rolled off, as if recorded through tape.',
  role: 'Softens a pattern that feels too digital or brittle — common in dub and deep techno where warmth matters more than sparkle.',
  engine: 'hat', params: { decay:0.07, filterFreq:4200, filterQ:1, metallic:false, noiseType:'pink' }
},
{
  id: 'hat-industrial-metal', name: 'Industrial Metal Hat', category: 'hat',
  keyword: 'industrial metal hi-hat, harsh and clanky',
  desc: 'A harsh, high-Q metallic burst that sounds closer to struck metal than a cymbal.',
  role: 'Reinforces an industrial track’s mechanical, factory-floor identity — it is meant to sound like hardware, not a drum kit.',
  engine: 'hat', params: { decay:0.15, filterFreq:10500, filterQ:4, metallic:true, noiseType:'white' }
},
{
  id: 'hat-closed-707', name: 'Crisp 707-Style Closed Hat', category: 'hat',
  keyword: 'crisp 707-style closed hi-hat',
  desc: 'A crisp, slightly metallic closed hat with a clean, digital attack.',
  role: 'A staple of 90s and Detroit-flavored techno — its clean, defined tick keeps fast patterns articulate and mixes well with analog kicks.',
  engine: 'hat', params: { decay:0.06, filterFreq:9000, filterQ:1.5, metallic:true, noiseType:'white' }
},
{
  id: 'hat-open-pedal', name: 'Pedal Hat (Semi-Open)', category: 'hat',
  keyword: 'semi-open pedal hi-hat, tight chicken foot',
  desc: 'A short, choked open hat with a tight “chick” and minimal ring.',
  role: 'Adds subtle off-beat syncopation — its shorter decay keeps a groove bouncy without washing over the kick like a full open hat.',
  engine: 'hat', params: { decay:0.14, filterFreq:7500, filterQ:1.2, metallic:false, noiseType:'white' }
},
{
  id: 'hat-loose-swung', name: 'Loose Swung Hat', category: 'hat',
  keyword: 'loose swung hi-hat, off-grid groove',
  desc: 'A softer, slightly longer hat with a rounder body, suggesting a swung feel.',
  role: 'Helps hardgroove, tech-house, and minimal patterns feel human and funky instead of rigidly quantized.',
  engine: 'hat', params: { decay:0.1, filterFreq:6500, filterQ:0.8, metallic:false, noiseType:'pink' }
},
{
  id: 'hat-tambourine', name: 'Tambourine Loop', category: 'hat',
  keyword: 'tambourine percussion loop, bright jingle',
  desc: 'A bright, jangly metallic pattern evoking a shaken tambourine.',
  role: 'Adds a high-frequency shimmer and a folk/hand-percussion feel, useful in tribal, afro, and Balearic-leaning techno.',
  engine: 'hat', params: { decay:0.18, filterFreq:9500, filterQ:2.5, metallic:true, noiseType:'white' }
},
{
  id: 'hat-bell-ride', name: 'Ride Bell Ping', category: 'hat',
  keyword: 'ride bell ping, bright metallic accent',
  desc: 'A pitched, bell-like ride ping with a clear fundamental and bright overtones.',
  role: 'Cuts through deep or melodic mixes as a defined rhythmic marker — a cleaner, more tonal alternative to a washier ride cymbal.',
  engine: 'hat', params: { decay:0.5, filterFreq:11000, filterQ:3, metallic:true, noiseType:'white', bell:true }
},
{
  id: 'hat-hi-passed', name: 'Airy Hi-Passed Hat', category: 'hat',
  keyword: 'airy hi-passed hi-hat, minimal top end',
  desc: 'A very short, high-passed hat with almost no body, just air.',
  role: 'Adds subtle 16th-note movement without cluttering the mids — perfect for minimal and deep mixes that need only a whisper of top end.',
  engine: 'hat', params: { decay:0.04, filterFreq:11000, filterQ:1, metallic:false, noiseType:'white' }
},
{
  id: 'hat-psy-roll', name: 'Psy Rolling Hat', category: 'hat',
  keyword: 'psy-techno rolling hi-hat, fast 32nds',
  desc: 'A fast, tight hat designed for constant 16th/32nd-note rolling patterns.',
  role: 'Drives psy-techno and faster hardgroove grooves with relentless forward motion while staying small enough not to mask the bass.',
  engine: 'hat', params: { decay:0.04, filterFreq:9500, filterQ:1.8, metallic:false, noiseType:'white' }
},
{
  id: 'hat-vinyl-brush', name: 'Vinyl Brush Hat', category: 'hat',
  keyword: 'vinyl brush hi-hat, soft noisy texture',
  desc: 'A soft, pink-noise brush with a slow attack, like brushes on a hat surface.',
  role: 'Brings a jazzy, organic, nu-groove texture to deeper techno without the sharp attack of a digital hat.',
  engine: 'hat', params: { decay:0.16, filterFreq:5000, filterQ:0.5, metallic:false, noiseType:'pink' }
},

// --------------------------------------------------------------- PERCUSSION
{
  id: 'perc-analog-clap', name: 'Analog Clap', category: 'perc',
  keyword: 'classic analog clap, snappy',
  desc: 'A tight cluster of quick noise bursts through a mid-range bandpass filter.',
  role: 'The standard backbeat hit on beats 2 and 4 — it adds a human-feeling accent against the mechanical regularity of the kick.',
  engine: 'perc', params: { type:'clap', filterFreq:1500, decay:0.18, bursts:4 }
},
{
  id: 'perc-rave-clap-layered', name: 'Layered Rave Clap', category: 'perc',
  keyword: 'layered rave clap, wide and thick',
  desc: 'A wider, denser clap built from more overlapping bursts for extra body.',
  role: 'Gives peak-time and hard techno a bigger backbeat that still reads clearly over a loud, distorted kick.',
  engine: 'perc', params: { type:'clap', filterFreq:1800, decay:0.24, bursts:6 }
},
{
  id: 'perc-rimshot', name: 'Rimshot', category: 'perc',
  keyword: 'tight rimshot percussion',
  desc: 'A very short, high-pitched click with a touch of tonal snap.',
  role: 'Adds a light, dry accent between kicks without competing for low-mid space — useful for driving a groove without a full clap.',
  engine: 'perc', params: { type:'rim', filterFreq:2200, decay:0.06, pitch:900 }
},
{
  id: 'perc-tribal-conga', name: 'Tribal Conga Loop', category: 'perc',
  keyword: 'tribal conga percussion loop',
  desc: 'A short pitched-drum pattern with a hand-drum-like pitch envelope.',
  role: 'Brings a human, tribal groove into the pattern — a signature of tribal and hypnotic techno that moves the track away from pure machine rhythm.',
  engine: 'perc', params: { type:'tom', filterFreq:1200, decay:0.14, pitch:220 }
},
{
  id: 'perc-metallic-stab', name: 'Metallic Perc Stab', category: 'perc',
  keyword: 'metallic percussion stab',
  desc: 'A short cluster of inharmonic sine partials, like a struck piece of metal.',
  role: 'A texture hit rather than a rhythm hit — scattered through a pattern to add unpredictability and a cold, industrial color.',
  engine: 'perc', params: { type:'metal', filterFreq:3000, decay:0.2, pitch:650 }
},
{
  id: 'perc-woodblock', name: 'Woodblock Click', category: 'perc',
  keyword: 'woodblock click percussion',
  desc: 'A very short, dry, high-pitched knock with almost no resonance.',
  role: 'A precise rhythmic anchor for minimal and micro-house-leaning techno, where every hit needs to be tiny and exact.',
  engine: 'perc', params: { type:'wood', filterFreq:2800, decay:0.04, pitch:1500 }
},
{
  id: 'perc-industrial-hit', name: 'Industrial Metal Hit', category: 'perc',
  keyword: 'industrial metal hit percussion, harsh',
  desc: 'A loud, dissonant metallic impact with a longer, clanging decay.',
  role: 'Used sparingly as a signature accent in industrial techno — one well-placed hit can define the whole track’s character.',
  engine: 'perc', params: { type:'metal', filterFreq:2200, decay:0.45, pitch:340 }
},
{
  id: 'perc-modular-blip', name: 'Modular Percussion Blip', category: 'perc',
  keyword: 'modular synth percussion blip',
  desc: 'A tiny, pitched electronic blip with a fast pitch drop.',
  role: 'A modern, synthetic percussion accent common in minimal and modular-hardware-inspired techno, adding rhythmic detail without acoustic character.',
  engine: 'perc', params: { type:'blip', filterFreq:5000, decay:0.05, pitch:1100 }
},
{
  id: 'perc-bongo-high', name: 'High Bongo Hit', category: 'perc',
  keyword: 'high bongo percussion, dry hand drum',
  desc: 'A dry, high-pitched hand drum hit with a short tonal body.',
  role: 'Adds organic, syncopated detail to tribal and afro-techno grooves, layering naturally with congas and shakers.',
  engine: 'perc', params: { type:'tom', filterFreq:2200, decay:0.11, pitch:380 }
},
{
  id: 'perc-cowbell', name: 'Cowbell', category: 'perc',
  keyword: 'classic cowbell percussion, metallic',
  desc: 'A pitched, metallic cowbell-like hit with two clanging inharmonic tones.',
  role: 'A timeless rhythmic accent across Detroit, electro, and hardgroove — instantly adds funk and old-school character.',
  engine: 'perc', params: { type:'cowbell', filterFreq:3500, decay:0.18, pitch:800 }
},
{
  id: 'perc-tambourine-hit', name: 'Tambourine Hit', category: 'perc',
  keyword: 'tambourine hit, jangly accent',
  desc: 'A short jangly cluster of high metallic jingles.',
  role: 'Accents backbeats and transitions with a bright, acoustic shimmer in organic and Balearic-leaning techno.',
  engine: 'perc', params: { type:'tambourine', filterFreq:9000, decay:0.16, pitch:2400 }
},
{
  id: 'perc-808-tom', name: '808-Style Tom', category: 'perc',
  keyword: '808-style synth tom, pitched and punchy',
  desc: 'A punchy, pitched synth tom with a quick downward pitch envelope.',
  role: 'Used for dramatic fills and tonal accents — a rave and electro-techno favorite for building tension across a bar.',
  engine: 'perc', params: { type:'tom', filterFreq:1800, decay:0.22, pitch:180 }
},
{
  id: 'perc-rivet-metal', name: 'Rivet Metal Scrap', category: 'perc',
  keyword: 'rivet metal scrap percussion, industrial scrape',
  desc: 'A short, harsh metallic scrape combining noise and inharmonic tones.',
  role: 'An industrial-techno signature texture — sounds like machinery being struck, adding cold, factory-floor unpredictability.',
  engine: 'perc', params: { type:'scrape', filterFreq:4000, decay:0.35, pitch:500 }
},
{
  id: 'perc-timbale', name: 'Timbale Fill Hit', category: 'perc',
  keyword: 'timbale percussion, crisp high drum',
  desc: 'A crisp, high, open drum hit with a clear pitch and cutting attack.',
  role: 'Brings Latin and afro-cuban rhythmic color to tribal and hardgroove patterns, especially in fills and turnarounds.',
  engine: 'perc', params: { type:'tom', filterFreq:2600, decay:0.13, pitch:320 }
},
{
  id: 'perc-wooden-klak', name: 'Wooden Klak', category: 'perc',
  keyword: 'wooden klak percussion, minimal click',
  desc: 'An ultra-short, low-pitched wooden knock with almost no resonance.',
  role: 'A tiny, precise groove marker for Rominimal and minimal micro-percussion — felt more than heard, it locks the pocket.',
  engine: 'perc', params: { type:'wood', filterFreq:1800, decay:0.035, pitch:900 }
},
{
  id: 'perc-clap-reverb', name: 'Reverb Clap', category: 'perc',
  keyword: 'reverb clap, wide spacious tail',
  desc: 'A clap layered with a longer, washed-out tail suggesting hall reverb.',
  role: 'Creates space and drama on backbeats in deep and melodic techno, turning a simple clap into an atmospheric event.',
  engine: 'perc', params: { type:'clap', filterFreq:1600, decay:0.5, bursts:5, reverb:true }
},
{
  id: 'perc-djembe', name: 'Djembe Slap', category: 'perc',
  keyword: 'djembe slap percussion, earthy',
  desc: 'A sharp, earthy hand-drum slap with a bright attack and warm body.',
  role: 'Adds expressive, human rhythmic articulation to afro and tribal techno, making machine grooves feel played.',
  engine: 'perc', params: { type:'djembe', filterFreq:2000, decay:0.16, pitch:300 }
},
{
  id: 'perc-zap', name: 'Synth Zap Percussion', category: 'perc',
  keyword: 'synth zap percussion, electronic blip',
  desc: 'A fast, resonant electronic zap with a quick pitch dive.',
  role: 'A modern, synthetic groove accent for minimal, electro, and broken techno — small, clean, and unmistakably electronic.',
  engine: 'perc', params: { type:'zap', filterFreq:6000, decay:0.08, pitch:1400 }
},
{
  id: 'perc-shaker-metal', name: 'Metal Shaker', category: 'perc',
  keyword: 'metal shaker, bright gritty 16ths',
  desc: 'A brighter, grittier shaker with metallic jitter instead of soft sand.',
  role: 'Drives hypnotic and tech-house grooves with a crisp, constant high-frequency pulse that cuts through a busy mix.',
  engine: 'perc', params: { type:'shaker', filterFreq:8000, decay:0.1, pitch:6000 }
},

// -------------------------------------------------------------- BASS / SUB
{
  id: 'bass-acid-303', name: 'Rolling Acid Bassline (303-style)', category: 'bass',
  keyword: 'rolling acid 303 bassline, resonant squelch',
  desc: 'A resonant sawtooth line with a fast filter-envelope squelch on each note.',
  role: 'The defining sound of acid techno — the resonance and filter envelope turn a simple bassline into a constantly mutating lead voice.',
  engine: 'bass', params: { waveform:'sawtooth', baseFreq:65, filterCutoff:400, filterQ:14, filterEnvAmount:2600, filterEnvDecay:0.14, drive:0.2, sub:0.1, glide:false, pattern:'rolling' }
},
{
  id: 'bass-straight-sub', name: 'Straight Sub Bass', category: 'bass',
  keyword: 'deep straight sub bass, clean',
  desc: 'A pure, filtered sine/triangle low end with no movement or distortion.',
  role: 'Pure low-end weight that sits below everything else — used when the groove needs to feel physical without adding melodic content.',
  engine: 'bass', params: { waveform:'sine', baseFreq:45, filterCutoff:250, filterQ:0.7, filterEnvAmount:0, filterEnvDecay:0.1, drive:0, sub:0.9, glide:false, pattern:'single' }
},
{
  id: 'bass-reese', name: 'Reese Bass', category: 'bass',
  keyword: 'growling detuned reese bass',
  desc: 'Two or more detuned sawtooths beating against each other for a growling texture.',
  role: 'Adds a thick, moving low end with harmonic tension — common where a track wants more aggression than a clean sub without going fully distorted.',
  engine: 'bass', params: { waveform:'sawtooth', baseFreq:55, filterCutoff:700, filterQ:2, filterEnvAmount:200, filterEnvDecay:0.3, drive:0.15, sub:0.4, glide:false, pattern:'single', detuneVoices:true }
},
{
  id: 'bass-dub-chord', name: 'Dub Techno Bass Chord', category: 'bass',
  keyword: 'dub techno bass chord stab, filtered',
  desc: 'A low, filtered chord stab rather than a single note, with a soft attack.',
  role: 'In dub techno the bass often carries harmony, not just rhythm — a chord stab here does double duty as bassline and chord progression.',
  engine: 'bass', params: { waveform:'triangle', baseFreq:60, filterCutoff:350, filterQ:1.2, filterEnvAmount:150, filterEnvDecay:0.6, drive:0, sub:0.5, glide:false, pattern:'single', chord:true }
},
{
  id: 'bass-hoover', name: 'Hoover Bass', category: 'bass',
  keyword: 'rave hoover bass, rising growl',
  desc: 'A detuned, pitch-rising saw stack that swells like the classic rave “hoover” sound.',
  role: 'A nostalgic, aggressive texture for peak moments — instantly recognizable from early-90s rave and still used in hard and hard-groove techno for impact.',
  engine: 'bass', params: { waveform:'sawtooth', baseFreq:70, filterCutoff:900, filterQ:3, filterEnvAmount:400, filterEnvDecay:0.4, drive:0.3, sub:0.2, glide:true, pattern:'single', detuneVoices:true }
},
{
  id: 'bass-fm-growl', name: 'FM Growl Bass', category: 'bass',
  keyword: 'distorted FM growl bass, aggressive',
  desc: 'A harsh, ring-modulated, heavily distorted low end with an irregular growl.',
  role: 'Hard techno’s answer to a screaming lead — it fills the low-mid with aggression and pushes the whole track’s intensity up a notch.',
  engine: 'bass', params: { waveform:'square', baseFreq:60, filterCutoff:1200, filterQ:4, filterEnvAmount:300, filterEnvDecay:0.2, drive:0.75, sub:0.2, glide:false, pattern:'single', ringMod:true }
},
{
  id: 'bass-minimal-rolling', name: 'Minimal Rolling Bassline', category: 'bass',
  keyword: 'minimal rolling bassline groove, tight',
  desc: 'A short, dry, repeating low note pattern with a tight filter and light swing.',
  role: 'Keeps a minimal track moving for long stretches — the groove comes from subtle timing and filter changes rather than melody.',
  engine: 'bass', params: { waveform:'sawtooth', baseFreq:58, filterCutoff:500, filterQ:2, filterEnvAmount:250, filterEnvDecay:0.1, drive:0.05, sub:0.3, glide:false, pattern:'rolling' }
},
{
  id: 'bass-hard-distorted', name: 'Hard Techno Distorted Bass', category: 'bass',
  keyword: 'hard techno distorted bassline, wall of sound',
  desc: 'A fully saturated, near-square low end pushed hard enough to lose its pitch definition.',
  role: 'Fuses with the kick into a single wall of low-end energy — a hard techno production trademark where kick and bass are barely separable.',
  engine: 'bass', params: { waveform:'square', baseFreq:50, filterCutoff:1500, filterQ:1, filterEnvAmount:0, filterEnvDecay:0.1, drive:0.9, sub:0.5, glide:false, pattern:'single' }
},
{
  id: 'bass-acid-line-16', name: '16th Acid Bassline', category: 'bass',
  keyword: 'fast 16th-note acid 303 bassline, squelchy',
  desc: 'A fast, constant 16th-note 303-style line with tight, even squelch.',
  role: 'Powers acid and psy-techno tracks with relentless, hypnotic forward motion — the speed itself becomes the track’s energy.',
  engine: 'bass', params: { waveform:'sawtooth', baseFreq:65, filterCutoff:500, filterQ:16, filterEnvAmount:2200, filterEnvDecay:0.08, drive:0.25, sub:0.1, glide:false, pattern:'acid16' }
},
{
  id: 'bass-sub-pulse', name: 'Sub Pulse (Off-Beat)', category: 'bass',
  keyword: 'off-beat sub bass pulse, deep',
  desc: 'A clean sine sub pulsing on the off-beats between kicks.',
  role: 'Creates the classic pumping, driving feel in peak-time and big-room techno while keeping the low end perfectly controlled.',
  engine: 'bass', params: { waveform:'sine', baseFreq:45, filterCutoff:200, filterQ:0.7, filterEnvAmount:0, filterEnvDecay:0.1, drive:0, sub:0.95, glide:false, pattern:'offbeat' }
},
{
  id: 'bass-wobble', name: 'Wobble Bass', category: 'bass',
  keyword: 'wobble bass, LFO filter movement',
  desc: 'A saw/square bass with a slow LFO sweeping its filter for a wavering motion.',
  role: 'Adds dynamic, living movement to a low end that would otherwise be static — popular in bass-techno and darker, modern grooves.',
  engine: 'bass', params: { waveform:'sawtooth', baseFreq:55, filterCutoff:500, filterQ:6, filterEnvAmount:0, filterEnvDecay:0.2, drive:0.2, sub:0.4, glide:false, pattern:'single', lfo:true }
},
{
  id: 'bass-moog-sub', name: 'Moog-Style Sub Bass', category: 'bass',
  keyword: 'warm Moog-style analog sub bass',
  desc: 'A warm, rounded analog sub with soft saturation and slight harmonic richness.',
  role: 'Brings vintage, musical warmth to deep, Detroit, and melodic techno — it feels analog and fat without becoming aggressive.',
  engine: 'bass', params: { waveform:'triangle', baseFreq:48, filterCutoff:320, filterQ:1, filterEnvAmount:120, filterEnvDecay:0.2, drive:0.12, sub:0.8, glide:false, pattern:'single' }
},
{
  id: 'bass-reese-dark', name: 'Dark Neuro Reese', category: 'bass',
  keyword: 'dark neuro reese bass, modulated and tense',
  desc: 'A heavily detuned, modulated reese with a shifting, unstable timbre.',
  role: 'Adds cinematic, tense low-end movement to industrial and bass-techno — its constant motion keeps the low end menacing and evolving.',
  engine: 'bass', params: { waveform:'sawtooth', baseFreq:50, filterCutoff:800, filterQ:4, filterEnvAmount:300, filterEnvDecay:0.4, drive:0.4, sub:0.3, glide:false, pattern:'single', detuneVoices:true, lfo:true }
},
{
  id: 'bass-stab-offbeat', name: 'Off-Beat Bass Stab', category: 'bass',
  keyword: 'off-beat techno bass stab, bouncy',
  desc: 'A short, plucked bass stab hitting between the kicks.',
  role: 'Creates bounce and drive — the gap between the kick and the bass stab is what makes a techno groove feel propulsive.',
  engine: 'bass', params: { waveform:'square', baseFreq:65, filterCutoff:600, filterQ:3, filterEnvAmount:1200, filterEnvDecay:0.12, drive:0.1, sub:0.4, glide:false, pattern:'offbeat' }
},
{
  id: 'bass-808', name: '808 Sub Bass', category: 'bass',
  keyword: '808 sub bass, long distorted 808 tone',
  desc: 'A long, sustained sine/triangle 808-style sub with a pitched attack.',
  role: 'Gives electro-techno and bass-techno crossovers deep, tonal, trap-influenced sub weight that rings out under the groove.',
  engine: 'bass', params: { waveform:'sine', baseFreq:42, filterCutoff:260, filterQ:0.7, filterEnvAmount:0, filterEnvDecay:0.1, drive:0.1, sub:1, glide:true, pattern:'long' }
},
{
  id: 'bass-mid-bass-growl', name: 'Mid-Bass Growl', category: 'bass',
  keyword: 'mid-bass growl, distorted and syncopated',
  desc: 'A distorted bass sound living more in the low-mids than the sub.',
  role: 'Lets a hard or industrial track growl audibly even on small speakers, while a separate sub carries the actual low-end weight.',
  engine: 'bass', params: { waveform:'sawtooth', baseFreq:90, filterCutoff:900, filterQ:5, filterEnvAmount:600, filterEnvDecay:0.14, drive:0.6, sub:0.15, glide:false, pattern:'rolling' }
},
{
  id: 'bass-tribal-marimba', name: 'Tribal Marimba Bass', category: 'bass',
  keyword: 'marimba-style tribal bass, wooden and melodic',
  desc: 'A short, wooden, marimba-like bass pluck with a soft attack.',
  role: 'Adds melodic, organic, pitched percussion-bass color to tribal and afro-techno, giving the groove a hand-played, earthy feel.',
  engine: 'bass', params: { waveform:'triangle', baseFreq:80, filterCutoff:900, filterQ:2, filterEnvAmount:1400, filterEnvDecay:0.18, drive:0, sub:0.2, glide:false, pattern:'rolling' }
},
{
  id: 'bass-sequence-hypnotic', name: 'Hypnotic Bass Sequence', category: 'bass',
  keyword: 'hypnotic repeating bass sequence, pulsing',
  desc: 'A short, repeating synth bass pattern that cycles with little variation.',
  role: 'The meditative engine of hypnotic techno — a simple loop that locks the listener into a trance over long stretches.',
  engine: 'bass', params: { waveform:'sawtooth', baseFreq:58, filterCutoff:450, filterQ:3, filterEnvAmount:500, filterEnvDecay:0.1, drive:0.05, sub:0.4, glide:false, pattern:'sequence' }
},
{
  id: 'bass-drone-sub', name: 'Drone Sub Bass', category: 'bass',
  keyword: 'drone sub bass, sustained and static',
  desc: 'A sustained, almost static sub tone that holds under a whole section.',
  role: 'Maintains low-end pressure in intros and breakdowns when the kick drops out, giving ambient and dub sections a physical foundation.',
  engine: 'bass', params: { waveform:'sine', baseFreq:40, filterCutoff:180, filterQ:0.5, filterEnvAmount:0, filterEnvDecay:0.1, drive:0, sub:1, glide:false, pattern:'long' }
},
{
  id: 'bass-acid-hypnotic-dark', name: 'Dark Acid Bass', category: 'bass',
  keyword: 'dark hypnotic acid bassline, deep squelch',
  desc: 'A lower, slower, darker 303-style line with a deep, muted squelch.',
  role: 'Brings acid texture into hypnotic and Berlin-style techno without the peak-time brightness of a classic acid line.',
  engine: 'bass', params: { waveform:'sawtooth', baseFreq:52, filterCutoff:300, filterQ:12, filterEnvAmount:1400, filterEnvDecay:0.2, drive:0.15, sub:0.3, glide:true, pattern:'rolling' }
},

// ---------------------------------------------------------- LEAD / STAB / ARP
{
  id: 'lead-rave-stab', name: 'Rave Stab', category: 'lead', subtype:'stab',
  keyword: 'classic rave stab chord, filtered hit',
  desc: 'A fast-attack chord hit with a quick filter close, gone almost as soon as it lands.',
  role: 'A punctuation mark — used on off-beats or accents to add energy without ever becoming a sustained melodic element.',
  engine: 'lead', params: { subtype:'stab', waveform:'sawtooth', intervals:[0,7,12], baseFreq:220, detune:8, filterCutoff:3000, filterEnvAmount:2000, attack:0.003, decay:0.22 }
},
{
  id: 'lead-analog-pluck', name: 'Analog Pluck Synth', category: 'lead', subtype:'stab',
  keyword: 'analog pluck synth, warm decay',
  desc: 'A single warm note with a fast pluck-like attack and a natural, rounded decay.',
  role: 'Melodic techno’s bread and butter — plucks carry the emotional melody while staying rhythmically tight enough not to clutter the groove.',
  engine: 'lead', params: { subtype:'stab', waveform:'triangle', intervals:[0], baseFreq:330, detune:4, filterCutoff:2200, filterEnvAmount:1200, attack:0.004, decay:0.35 }
},
{
  id: 'lead-detuned-saw', name: 'Detuned Saw Lead', category: 'lead', subtype:'stab',
  keyword: 'detuned saw lead, wide and thick',
  desc: 'A thick, chorused lead built from several slightly-detuned sawtooth voices.',
  role: 'Fills out the top of a mix with width and body — a go-to for melodic and driving techno hooks that need to feel big without shouting.',
  engine: 'lead', params: { subtype:'stab', waveform:'sawtooth', intervals:[0], baseFreq:294, detune:14, filterCutoff:3400, filterEnvAmount:1500, attack:0.01, decay:0.5 }
},
{
  id: 'lead-hypnotic-arp', name: 'Hypnotic Arpeggio', category: 'lead', subtype:'arp',
  keyword: 'hypnotic 16th-note arpeggio sequence',
  desc: 'A fast, repeating sequence of short notes stepping through a small set of pitches.',
  role: 'The engine behind hypnotic and minimal techno’s trance-like pull — a simple pattern, repeated with tiny variations, that rewards long, close listening.',
  engine: 'lead', params: { subtype:'arp', waveform:'square', intervals:[0,3,7,10], baseFreq:440, detune:2, filterCutoff:2600, filterEnvAmount:900, attack:0.002, decay:0.09 }
},
{
  id: 'lead-acid-squelch', name: 'Acid Squelch Lead', category: 'lead', subtype:'arp',
  keyword: 'squelchy acid lead, high resonance',
  desc: 'A resonant, filter-swept lead line similar to the acid bassline but pitched higher and busier.',
  role: 'When the acid line moves from bass into lead territory it becomes the main melodic hook of the track, not just groove support.',
  engine: 'lead', params: { subtype:'arp', waveform:'sawtooth', intervals:[0,3,5,7], baseFreq:520, detune:0, filterCutoff:900, filterEnvAmount:2400, attack:0.001, decay:0.11 }
},
{
  id: 'lead-melodic-pluck-seq', name: 'Melodic Techno Pluck Sequence', category: 'lead', subtype:'arp',
  keyword: 'melodic techno pluck sequence, emotive',
  desc: 'A slower, more spacious sequence of plucked notes outlining a minor-key melody.',
  role: 'Carries the emotional arc of a melodic techno track across a long build — the space between notes matters as much as the notes themselves.',
  engine: 'lead', params: { subtype:'arp', waveform:'triangle', intervals:[0,3,7,10,12], baseFreq:262, detune:3, filterCutoff:2000, filterEnvAmount:800, attack:0.01, decay:0.3 }
},
{
  id: 'lead-filtered-stab', name: 'Filtered Stab Chord', category: 'lead', subtype:'stab',
  keyword: 'filtered stab chord hit, muted',
  desc: 'A chord hit with the filter closed down low so only its edge is audible.',
  role: 'A textural rather than melodic hit — implies harmony without drawing attention away from the groove, common in deep and minimal styles.',
  engine: 'lead', params: { subtype:'stab', waveform:'sawtooth', intervals:[0,4,7], baseFreq:196, detune:6, filterCutoff:900, filterEnvAmount:1400, attack:0.004, decay:0.28 }
},
{
  id: 'lead-fm-bell', name: 'FM Bell Lead', category: 'lead', subtype:'stab',
  keyword: 'metallic FM bell lead, glassy',
  desc: 'An inharmonic, bell-like tone with a bright, glassy attack and a slow fade.',
  role: 'Adds a cold, futuristic melodic color that cuts through dense percussion without needing much volume.',
  engine: 'lead', params: { subtype:'stab', waveform:'sine', intervals:[0,12,19], baseFreq:392, detune:0, filterCutoff:6000, filterEnvAmount:400, attack:0.002, decay:0.9, bell:true }
},
{
  id: 'lead-supersaw', name: 'Supersaw Lead Hook', category: 'lead', subtype:'stab',
  keyword: 'supersaw lead hook, wide and euphoric',
  desc: 'A stack of detuned sawtooths forming a huge, wide, euphoric lead.',
  role: 'The main hook in uplifting trance-techno and festival melodic techno — it fills the stereo field and carries the biggest emotional moment.',
  engine: 'lead', params: { subtype:'stab', waveform:'sawtooth', intervals:[0,7], baseFreq:349, detune:24, filterCutoff:4200, filterEnvAmount:1600, attack:0.008, decay:0.7, super:true }
},
{
  id: 'lead-sync-lead', name: 'Hard Sync Lead', category: 'lead', subtype:'stab',
  keyword: 'hard sync synth lead, bright and aggressive',
  desc: 'A bright, sync-style lead with a nasal, cutting timbre.',
  role: 'Cuts through dense hard and electro-techno mixes as a sharp, aggressive hook that never gets buried.',
  engine: 'lead', params: { subtype:'stab', waveform:'square', intervals:[0,12], baseFreq:392, detune:6, filterCutoff:2600, filterEnvAmount:3000, attack:0.002, decay:0.25, sync:true }
},
{
  id: 'lead-detroit-string-machine', name: 'Detroit String Machine Lead', category: 'lead', subtype:'stab',
  keyword: 'Detroit string-machine synth lead, soulful',
  desc: 'A warm, lush, slightly chorused synth-string lead with a gentle attack.',
  role: 'Carries the soulful, futuristic melody at the heart of Detroit techno — warm, analog, and emotionally direct.',
  engine: 'lead', params: { subtype:'stab', waveform:'sawtooth', intervals:[0,3,7], baseFreq:392, detune:12, filterCutoff:2400, filterEnvAmount:1000, attack:0.04, decay:0.8, ensemble:true }
},
{
  id: 'lead-pluck-deep', name: 'Deep Pluck', category: 'lead', subtype:'stab',
  keyword: 'deep pluck synth, muted and round',
  desc: 'A soft, muted, round pluck sitting in the midrange.',
  role: 'Adds gentle melodic movement to deep and minimal techno without stealing focus from the groove.',
  engine: 'lead', params: { subtype:'stab', waveform:'triangle', intervals:[0], baseFreq:262, detune:3, filterCutoff:1400, filterEnvAmount:700, attack:0.01, decay:0.4 }
},
{
  id: 'lead-arp-minor', name: 'Minor Arp Sequence', category: 'lead', subtype:'arp',
  keyword: 'minor-key arpeggio sequence, melancholic',
  desc: 'A melancholic minor arpeggio with a slower, more spacious step.',
  role: 'Builds bittersweet emotion in melodic and deep techno, often introduced under a breakdown and carried into the drop.',
  engine: 'lead', params: { subtype:'arp', waveform:'triangle', intervals:[0,3,7,10,12], baseFreq:294, detune:4, filterCutoff:2200, filterEnvAmount:700, attack:0.008, decay:0.25, stepDur:0.22 }
},
{
  id: 'lead-acid-303-high', name: 'High Acid 303 Lead', category: 'lead', subtype:'arp',
  keyword: 'high 303 acid lead, resonant squelchy sequence',
  desc: 'A high, resonant 303-style sequence with aggressive envelope squelch.',
  role: 'Takes the acid idea into lead territory — busy, squelchy, and hypnotic, it becomes the focal point of acid and psy-techno cuts.',
  engine: 'lead', params: { subtype:'arp', waveform:'sawtooth', intervals:[0,3,5,7,10], baseFreq:587, detune:0, filterCutoff:800, filterEnvAmount:3000, attack:0.001, decay:0.09, acid:true }
},
{
  id: 'lead-pizzicato', name: 'Pizzicato Synth Lead', category: 'lead', subtype:'stab',
  keyword: 'pizzicato synth lead, short and plucky',
  desc: 'A very short, rounded pluck resembling pizzicato strings.',
  role: 'Creates delicate, rhythmic melodic patterns in melodic and deep techno — short notes let a melody stay percussive and tight.',
  engine: 'lead', params: { subtype:'stab', waveform:'triangle', intervals:[0,7], baseFreq:440, detune:2, filterCutoff:2800, filterEnvAmount:1500, attack:0.002, decay:0.16 }
},
{
  id: 'lead-chord-stab-pwm', name: 'PWM Chord Stab', category: 'lead', subtype:'stab',
  keyword: 'PWM chord stab, thick and moving',
  desc: 'A pulse-width-modulated chord stab with a slowly shifting thickness.',
  role: 'Adds a rich, animated chord hit to classic and Detroit-flavored techno — the movement keeps the stab alive under repetition.',
  engine: 'lead', params: { subtype:'stab', waveform:'square', intervals:[0,3,7], baseFreq:220, detune:6, filterCutoff:2000, filterEnvAmount:1600, attack:0.004, decay:0.3, pwm:true }
},
{
  id: 'lead-psy-pluck', name: 'Psy-Techno Pluck', category: 'lead', subtype:'arp',
  keyword: 'psy-techno pluck, fast and resonant',
  desc: 'A fast, resonant, short pluck with a tight, wet tail, often run in rapid sequences.',
  role: 'Delivers the trippy, high-energy lead lines in psy-techno crossovers, stacking into dense, hallucinatory patterns.',
  engine: 'lead', params: { subtype:'arp', waveform:'sawtooth', intervals:[0,7,10,12], baseFreq:440, detune:2, filterCutoff:1800, filterEnvAmount:1600, attack:0.001, decay:0.08 }
},
{
  id: 'lead-detuned-chord', name: 'Detuned Chord Hit', category: 'lead', subtype:'stab',
  keyword: 'detuned minor chord hit, wide and moody',
  desc: 'A wide, detuned minor chord with a soft attack and a long-ish decay.',
  role: 'A single harmonic event that sets mood in deep and melodic techno — useful as a recurring motif across a long arrangement.',
  engine: 'lead', params: { subtype:'stab', waveform:'sawtooth', intervals:[0,3,7,10], baseFreq:196, detune:18, filterCutoff:2600, filterEnvAmount:1200, attack:0.02, decay:0.6 }
},
{
  id: 'lead-bleep', name: 'Bleep Techno Lead', category: 'lead', subtype:'stab',
  keyword: 'bleep techno lead, simple sine bleep',
  desc: 'A simple, pure sine/triangle bleep with a soft attack and quick decay.',
  role: 'A nod to early UK bleep techno — a minimal, melodic signal that cuts through with clarity and old-school character.',
  engine: 'lead', params: { subtype:'stab', waveform:'sine', intervals:[0,12], baseFreq:523, detune:0, filterCutoff:4000, filterEnvAmount:300, attack:0.003, decay:0.25 }
},
{
  id: 'lead-arp-fast-hypnotic', name: 'Fast Hypnotic Gate Arp', category: 'lead', subtype:'arp',
  keyword: 'fast gated hypnotic arpeggio, trance-like',
  desc: 'A fast, tightly gated arpeggio that pulses with a trance-like insistence.',
  role: 'The hypnotic centerpiece of long-building techno — its repetition and motion reward extended DJ blends and long mixes.',
  engine: 'lead', params: { subtype:'arp', waveform:'sawtooth', intervals:[0,3,7,12], baseFreq:392, detune:5, filterCutoff:2400, filterEnvAmount:1100, attack:0.002, decay:0.07, stepDur:0.09 }
},

// --------------------------------------------------------- PAD / CHORD / DRONE
{
  id: 'pad-dark-analog', name: 'Dark Analog Pad', category: 'pad',
  keyword: 'dark analog pad, slow attack',
  desc: 'A slow-swelling, minor-key chord built from several detuned oscillators.',
  role: 'Sets the emotional undertone of a track — dark pads are the difference between a techno track that grooves and one that feels ominous.',
  engine: 'pad', params: { intervals:[0,3,7], baseFreq:130, voices:4, detune:10, attack:1.2, release:1.8, filterCutoff:1400, lfoRate:0.15, lfoDepth:200, waveform:'sawtooth' }
},
{
  id: 'pad-evolving-drone', name: 'Slow Evolving Drone', category: 'pad',
  keyword: 'slow evolving drone pad, atmospheric',
  desc: 'A long, single sustained tone that slowly shifts timbre via a slow filter sweep.',
  role: 'Glue for long transitions and intros — a drone gives the ear something constant to hold onto while other elements enter and leave.',
  engine: 'pad', params: { intervals:[0], baseFreq:110, voices:3, detune:6, attack:2, release:3, filterCutoff:800, lfoRate:0.08, lfoDepth:300, waveform:'sine' }
},
{
  id: 'pad-detuned-wash', name: 'Detuned Chord Wash', category: 'pad',
  keyword: 'detuned chord wash pad, wide',
  desc: 'A wide, shimmering chord with heavy detuning for a chorused, ambient wash.',
  role: 'Fills the stereo field behind a sparse arrangement, giving minimal productions a sense of depth without adding rhythmic complexity.',
  engine: 'pad', params: { intervals:[0,4,7,11], baseFreq:174, voices:5, detune:16, attack:1.5, release:2.2, filterCutoff:2200, lfoRate:0.2, lfoDepth:400, waveform:'sawtooth' }
},
{
  id: 'pad-dub-chord-reverb', name: 'Dub Chord Stab (Reverb-Drenched)', category: 'pad',
  keyword: 'reverb-drenched dub chord stab, spacious',
  desc: 'A short chord hit conceptually designed to trail into a long, spacious reverb tail.',
  role: 'The signature dub techno move — a simple chord becomes an atmosphere in its own right once it is soaked in reverb and left to decay.',
  engine: 'pad', params: { intervals:[0,3,7,10], baseFreq:220, voices:3, detune:5, attack:0.05, release:2.6, filterCutoff:1800, lfoRate:0.1, lfoDepth:150, waveform:'triangle' }
},
{
  id: 'pad-warehouse-ambience', name: 'Warehouse Ambience Drone', category: 'pad',
  keyword: 'warehouse ambience drone, low rumble',
  desc: 'A low, murky drone built to sound like distant room tone and machinery.',
  role: 'Used under intros and breakdowns to plant the listener physically “in the room” before the groove starts.',
  engine: 'pad', params: { intervals:[0,5], baseFreq:70, voices:3, detune:8, attack:2.5, release:3, filterCutoff:500, lfoRate:0.05, lfoDepth:120, waveform:'sawtooth' }
},
{
  id: 'pad-melodic-string', name: 'Melodic Techno String Pad', category: 'pad',
  keyword: 'melodic techno string pad, emotive',
  desc: 'A string-like sustained pad with a slower attack and a rich, layered harmonic.',
  role: 'Brings the cinematic, emotional lift that defines modern melodic techno breakdowns and peaks.',
  engine: 'pad', params: { intervals:[0,4,7,12], baseFreq:196, voices:5, detune:9, attack:1.6, release:2, filterCutoff:2600, lfoRate:0.12, lfoDepth:250, waveform:'sawtooth' }
},
{
  id: 'pad-sub-drone', name: 'Sub-Bass Drone', category: 'pad',
  keyword: 'sub bass drone, deep and static',
  desc: 'A very low, nearly static sine tone sustained for a long duration.',
  role: 'A foundation layer under a breakdown or ambient section, keeping low-end presence even when the kick drops out.',
  engine: 'pad', params: { intervals:[0], baseFreq:42, voices:1, detune:0, attack:1, release:2, filterCutoff:200, lfoRate:0.05, lfoDepth:20, waveform:'sine' }
},
{
  id: 'pad-choir', name: 'Synth Choir Pad', category: 'pad',
  keyword: 'synthetic choir pad, ethereal and wide',
  desc: 'A soft, vowel-like synthetic choir with a slow swell and wide spread.',
  role: 'Adds an ethereal, human-but-not-human emotion to melodic and ambient techno breakdowns, lifting them into cinematic territory.',
  engine: 'pad', params: { intervals:[0,7,12], baseFreq:220, voices:4, detune:8, attack:1.8, release:2.4, filterCutoff:2400, lfoRate:0.18, lfoDepth:350, waveform:'sawtooth', choir:true }
},
{
  id: 'pad-berlin-dub', name: 'Berlin Dub Chord Pad', category: 'pad',
  keyword: 'Berlin dub chord pad, washed-out and delayed',
  desc: 'A washed-out, filtered chord pad with a slow attack and long, echoey tail.',
  role: 'Defines deep, dubbed-out Berlin techno — chords hang in space instead of hitting, creating a hypnotic, hazy atmosphere.',
  engine: 'pad', params: { intervals:[0,3,7], baseFreq:174, voices:3, detune:6, attack:1.2, release:3, filterCutoff:1200, lfoRate:0.1, lfoDepth:200, waveform:'triangle' }
},
{
  id: 'pad-bright-supersaw', name: 'Bright Supersaw Pad', category: 'pad',
  keyword: 'bright supersaw pad, big and euphoric',
  desc: 'A big, bright stack of detuned saws with a moderately fast attack.',
  role: 'Provides the massive, open backdrop behind uplifting and festival melodic techno drops.',
  engine: 'pad', params: { intervals:[0,4,7], baseFreq:262, voices:6, detune:18, attack:0.8, release:1.8, filterCutoff:3800, lfoRate:0.3, lfoDepth:500, waveform:'sawtooth' }
},
{
  id: 'pad-metallic', name: 'Metallic Glass Pad', category: 'pad',
  keyword: 'metallic glass pad, cold shimmering',
  desc: 'A cold, shimmering pad built from inharmonic, bell-like partials.',
  role: 'Creates a futuristic, alien atmosphere in experimental and dark techno — it feels icy and synthetic rather than warm.',
  engine: 'pad', params: { intervals:[0,12,19], baseFreq:220, voices:2, detune:4, attack:1.4, release:2.6, filterCutoff:5000, lfoRate:0.25, lfoDepth:600, waveform:'sine', metallic:true }
},
{
  id: 'pad-organ', name: 'Detroit Organ Pad', category: 'pad',
  keyword: 'Detroit organ chord pad, warm and soulful',
  desc: 'A warm, sustained organ-like chord with a gentle attack and drawbar color.',
  role: 'Brings deep, soulful house-meets-techno harmony to Detroit and nu-groove influenced tracks.',
  engine: 'pad', params: { intervals:[0,4,7,11], baseFreq:196, voices:3, detune:4, attack:0.3, release:1.4, filterCutoff:2200, lfoRate:0.2, lfoDepth:180, waveform:'square', organ:true }
},
{
  id: 'pad-dark-cinematic', name: 'Cinematic Dark Pad', category: 'pad',
  keyword: 'cinematic dark pad, ominous and tense',
  desc: 'A low, ominous, minor-ninth pad with slow movement and heavy tension.',
  role: 'Builds dread and scale in breakdowns and intros — the bed under which a kick can re-enter with maximum impact.',
  engine: 'pad', params: { intervals:[0,3,7,10,14], baseFreq:98, voices:4, detune:11, attack:2.2, release:3, filterCutoff:1100, lfoRate:0.07, lfoDepth:220, waveform:'sawtooth' }
},
{
  id: 'pad-ambient-piano', name: 'Ambient Felt Piano Pad', category: 'pad',
  keyword: 'ambient felt piano texture, soft and distant',
  desc: 'A soft, distant, piano-like texture with a gentle attack and long sustain.',
  role: 'Adds intimate, human, cinematic emotion to ambient and melodic techno — it feels close and personal even over a big system.',
  engine: 'pad', params: { intervals:[0,7,12], baseFreq:262, voices:2, detune:2, attack:0.6, release:2.4, filterCutoff:2600, lfoRate:0.15, lfoDepth:120, waveform:'triangle', piano:true }
},
{
  id: 'pad-tribal-ambient', name: 'Tribal Ambient Bed', category: 'pad',
  keyword: 'tribal ambient pad bed, earthy and airy',
  desc: 'An airy, earthy ambient bed combining soft tonal drift with airy noise.',
  role: 'Underpins afro and tribal techno arrangements with atmosphere that feels open and natural rather than urban or industrial.',
  engine: 'pad', params: { intervals:[0,5,7], baseFreq:130, voices:3, detune:7, attack:2, release:2.8, filterCutoff:1600, lfoRate:0.12, lfoDepth:250, waveform:'triangle', airy:true }
},

// ------------------------------------------------------------- FX / RISER / IMPACT
{
  id: 'fx-white-noise-riser', name: 'White Noise Riser', category: 'fx',
  keyword: 'white noise riser, building tension',
  desc: 'A filtered noise sweep that rises in pitch and volume over several bars.',
  role: 'The most common build tool in electronic music — it tells the listener’s ear that a drop or new section is coming.',
  engine: 'fx', params: { type:'riser', startFreq:200, endFreq:9000, duration:3.2, noiseMix:1 }
},
{
  id: 'fx-filter-sweep-riser', name: 'Resonant Filter Sweep Riser', category: 'fx',
  keyword: 'resonant filter sweep riser',
  desc: 'A resonant filter opening slowly on a held tone, adding a whistling edge as it climbs.',
  role: 'A more melodic alternative to a pure noise riser — useful when the build needs a pitched element rather than pure texture.',
  engine: 'fx', params: { type:'sweep', startFreq:150, endFreq:6000, duration:3.6, noiseMix:0.4 }
},
{
  id: 'fx-downlifter-impact', name: 'Cinematic Downlifter Impact', category: 'fx',
  keyword: 'cinematic downlifter impact, sub drop',
  desc: 'A sharp hit followed by a fast downward pitch and volume sweep.',
  role: 'Marks the exact moment of a drop or transition with a physical, felt impact rather than just a rhythmic change.',
  engine: 'fx', params: { type:'downlifter', startFreq:2000, endFreq:30, duration:1.4, noiseMix:0.3 }
},
{
  id: 'fx-reverse-cymbal', name: 'Reverse Cymbal Swell', category: 'fx',
  keyword: 'reverse cymbal swell, into the drop',
  desc: 'A cymbal-like wash that swells upward in volume and cuts off abruptly, as if played backwards.',
  role: 'A classic transition device — the abrupt cutoff creates a small silence that makes the next hit land harder.',
  engine: 'fx', params: { type:'reverseCymbal', startFreq:4000, endFreq:9000, duration:1.8, noiseMix:0.9 }
},
{
  id: 'fx-scifi-sweep', name: 'Sci-Fi Sweep', category: 'fx',
  keyword: 'sci-fi sweep fx, resonant',
  desc: 'A fast, highly resonant filter sweep across a wide frequency range, almost tonal.',
  role: 'Adds a futuristic, otherworldly texture used sparingly as an ear-catching transition or intro element.',
  engine: 'fx', params: { type:'sweep', startFreq:100, endFreq:8000, duration:1.6, noiseMix:0.15 }
},
{
  id: 'fx-sidechain-pump', name: 'Sidechain Pumping FX Texture', category: 'fx',
  keyword: 'sidechain pumping fx texture, breathing',
  desc: 'A sustained pad-like texture with a rhythmic volume pump synced to the beat.',
  role: 'Suno cannot sidechain a mix the way a DAW can, but naming this effect nudges the model toward that pumping, “breathing” rhythmic energy in the arrangement.',
  engine: 'fx', params: { type:'pump', startFreq:300, endFreq:300, duration:2, noiseMix:0.2 }
},
{
  id: 'fx-metallic-clang', name: 'Metallic Clang Impact', category: 'fx',
  keyword: 'metallic clang impact, industrial hit',
  desc: 'A dissonant, ringing metallic hit with a long, irregular decay.',
  role: 'A signature industrial techno accent used at section changes for shock value rather than groove.',
  engine: 'fx', params: { type:'clang', startFreq:1200, endFreq:1200, duration:1.2, noiseMix:0.3 }
},
{
  id: 'fx-tension-riser', name: 'Rising Tension Build-Up FX', category: 'fx',
  keyword: 'rising tension buildup fx, snare-roll style',
  desc: 'A rapid series of short, accelerating hits that increase in density toward a peak.',
  role: 'Mimics a drum-roll build — creates urgency right before a drop even in a fully synthesized, non-acoustic arrangement.',
  engine: 'fx', params: { type:'tensionRiser', startFreq:2000, endFreq:2000, duration:2.4, noiseMix:0.6 }
},
{
  id: 'fx-reverse-kick-swell', name: 'Reverse Kick Swell', category: 'fx',
  keyword: 'reverse kick swell, into the beat',
  desc: 'A low tone that swells upward in volume and pitch, aimed at landing right on the next downbeat.',
  role: 'A subtle transition trick borrowed from dub and minimal techno to lead the ear back into the groove after a breakdown.',
  engine: 'fx', params: { type:'reverseCymbal', startFreq:40, endFreq:180, duration:1.1, noiseMix:0.05 }
},
{
  id: 'fx-snare-rush', name: 'Snare Rush Build', category: 'fx',
  keyword: 'snare rush build, accelerating drum roll',
  desc: 'An accelerating snare/noise roll that doubles in density toward its peak.',
  role: 'A classic EDM/peak-time build effect — the increasing rate of hits creates undeniable release tension into a drop.',
  engine: 'fx', params: { type:'snareRush', startFreq:2200, endFreq:2200, duration:3, noiseMix:0.8 }
},
{
  id: 'fx-siren', name: 'Rave Siren FX', category: 'fx',
  keyword: 'rave siren fx, pitched warning tone',
  desc: 'A loud, pitched, modulating siren tone rising and falling like a warning alarm.',
  role: 'A peak-time and rave weapon — instantly signals intensity and nods to old-school sound-system culture.',
  engine: 'fx', params: { type:'siren', startFreq:440, endFreq:880, duration:2.4, noiseMix:0 }
},
{
  id: 'fx-boom-impact', name: 'Cinematic Boom Impact', category: 'fx',
  keyword: 'cinematic boom impact, sub hit',
  desc: 'A huge sub boom with a noise transient designed to feel like a trailer hit.',
  role: 'Anchors a major section change with physical weight — a single boom can make a drop feel larger than the elements alone.',
  engine: 'fx', params: { type:'boom', startFreq:120, endFreq:35, duration:2, noiseMix:0.5 }
},
{
  id: 'fx-vinyl-stop', name: 'Vinyl Brake / Stop FX', category: 'fx',
  keyword: 'vinyl brake stop fx, turntable slowdown',
  desc: 'A sound that slows in pitch and volume as if a turntable is being braked to a stop.',
  role: 'A dramatic stop-start transition — the dead silence after it makes the next hit land with maximum shock.',
  engine: 'fx', params: { type:'vinylStop', startFreq:600, endFreq:80, duration:1.6, noiseMix:0.1 }
},
{
  id: 'fx-laser-zap', name: 'Laser Zap FX', category: 'fx',
  keyword: 'laser zap synth fx, retro rave',
  desc: 'A fast, bright, descending synth zap reminiscent of retro rave effects.',
  role: 'Adds playful, old-school rave energy as a quick accent or transition fill.',
  engine: 'fx', params: { type:'laser', startFreq:2400, endFreq:300, duration:0.6, noiseMix:0 }
},
{
  id: 'fx-uplift-arp', name: 'Uplifting Arp Rush', category: 'fx',
  keyword: 'uplifting arp rush, rising sequenced notes',
  desc: 'A quickly ascending run of short arpeggiated notes over several octaves.',
  role: 'Used in trance-techno builds to create a sense of rocketing upward before a euphoric drop.',
  engine: 'fx', params: { type:'arpRush', startFreq:220, endFreq:3520, duration:2.2, noiseMix:0 }
},
{
  id: 'fx-sub-drop', name: 'Simple Sub Drop', category: 'fx',
  keyword: 'simple sub drop fx, deep sine fall',
  desc: 'A deep sine tone falling quickly into the sub register.',
  role: 'A clean, modern transition accent — adds low-end weight to a drop without a full cinematic impact.',
  engine: 'fx', params: { type:'downlifter', startFreq:180, endFreq:30, duration:0.9, noiseMix:0 }
},
{
  id: 'fx-glitch-cut', name: 'Glitch Stutter Cut', category: 'fx',
  keyword: 'glitch stutter cut fx, digital break-up',
  desc: 'A burst of stuttering, bit-crushed digital fragments that cut the audio.',
  role: 'Brings broken/glitch-techno energy into a transition or breakdown — a sudden digital malfunction that resets momentum.',
  engine: 'fx', params: { type:'glitch', startFreq:1500, endFreq:1500, duration:1.1, noiseMix:0.7 }
},
{
  id: 'fx-dark-horn', name: 'Dark Horn Hit', category: 'fx',
  keyword: 'dark rave horn hit, ominous',
  desc: 'A low, brassy, ominous sustained hit like a distant warning horn.',
  role: 'A dramatic, old-school-rave-meets-cinema accent that signals a big moment with menace.',
  engine: 'fx', params: { type:'horn', startFreq:110, endFreq:90, duration:1.8, noiseMix:0.1 }
},
{
  id: 'fx-tape-stop', name: 'Tape Stop FX', category: 'fx',
  keyword: 'tape stop fx, spinning down',
  desc: 'A pitched-down, slowing tail as if tape or a platter is spinning to a halt.',
  role: 'A lo-fi transition trick — useful in raw/broken and old-school-flavored tracks for a satisfying dead stop.',
  engine: 'fx', params: { type:'vinylStop', startFreq:800, endFreq:60, duration:1.3, noiseMix:0.15 }
},
{
  id: 'fx-white-noise-downlifter', name: 'White Noise Downlifter', category: 'fx',
  keyword: 'white noise downlifter, falling tension',
  desc: 'A noise sweep that falls in frequency and volume after a peak.',
  role: 'Exits a big section and strips energy away, leading into a breakdown or teasing the next build.',
  engine: 'fx', params: { type:'downlifterNoise', startFreq:9000, endFreq:200, duration:2.2, noiseMix:1 }
},
{
  id: 'fx-tonal-rise', name: 'Tonal Pitch Riser', category: 'fx',
  keyword: 'tonal pitch riser, rising synth note',
  desc: 'A held synth note that rises in pitch with a smooth portamento.',
  role: 'A musical, tension-building alternative to a noise riser — it lifts toward the key of the incoming drop.',
  engine: 'fx', params: { type:'sweep', startFreq:220, endFreq:1760, duration:2.6, noiseMix:0 }
},

// --------------------------------------------------------- TEXTURE / ATMOSPHERE
{
  id: 'texture-vinyl-crackle', name: 'Vinyl Crackle / Tape Hiss', category: 'texture',
  keyword: 'vinyl crackle tape hiss texture, warm',
  desc: 'A constant, low-level crackling noise texture evoking an old record or tape.',
  role: 'Adds analog warmth and imperfection under a clean digital arrangement, common in dub and deep techno.',
  engine: 'texture', params: { type:'crackle', filterFreq:5000, filterQ:0.7, lfoRate:0.3, lfoDepth:0.4, duration:4 }
},
{
  id: 'texture-industrial-noise-bed', name: 'Industrial Noise Texture Bed', category: 'texture',
  keyword: 'industrial noise texture bed, grinding',
  desc: 'A dense, grinding wall of filtered noise sustained under the main elements.',
  role: 'Fills the background with mechanical chaos, reinforcing an industrial track’s factory-floor atmosphere.',
  engine: 'texture', params: { type:'noiseBed', filterFreq:1800, filterQ:2, lfoRate:0.4, lfoDepth:0.6, duration:4 }
},
{
  id: 'texture-modular-drone', name: 'Modular Machine Drone', category: 'texture',
  keyword: 'modular machine drone texture, mechanical',
  desc: 'A low, irregular, slowly modulating tone resembling idle hardware or a modular patch.',
  role: 'Adds unpredictable, organic movement to an otherwise rigid grid-based arrangement.',
  engine: 'texture', params: { type:'drone', baseFreq:65, filterFreq:900, filterQ:1.5, lfoRate:0.6, lfoDepth:0.5, duration:4.5 }
},
{
  id: 'texture-warehouse-hum', name: 'Warehouse Machine Hum Ambience', category: 'texture',
  keyword: 'warehouse machine hum ambience',
  desc: 'A steady, low hum meant to suggest distant ventilation or machinery.',
  role: 'A near-subliminal layer that gives an intro or breakdown a physical sense of place.',
  engine: 'texture', params: { type:'hum', baseFreq:110, filterFreq:600, filterQ:3, lfoRate:0.1, lfoDepth:0.15, duration:5 }
},
{
  id: 'texture-granular-static', name: 'Granular Static Texture', category: 'texture',
  keyword: 'granular static texture, glitchy',
  desc: 'A stuttering, grainy noise texture built from rapid tiny bursts.',
  role: 'Adds a modern, glitchy detail layer favored in more experimental and broken-techno productions.',
  engine: 'texture', params: { type:'granular', filterFreq:4000, filterQ:1, lfoRate:8, lfoDepth:0.8, duration:3.5 }
},
{
  id: 'texture-sub-rumble', name: 'Distant Sub Rumble Texture', category: 'texture',
  keyword: 'distant sub rumble texture, ominous',
  desc: 'A very low, slowly fluctuating rumble with almost no defined pitch.',
  role: 'Builds unease under a breakdown or intro without a defined bassline, common in darker techno subgenres.',
  engine: 'texture', params: { type:'rumble', baseFreq:35, filterFreq:150, filterQ:1, lfoRate:0.15, lfoDepth:0.3, duration:5 }
},
{
  id: 'texture-broken-radio', name: 'Broken Radio Static FX', category: 'texture',
  keyword: 'broken radio static texture, lo-fi',
  desc: 'A narrow-band, crackling noise texture like a badly tuned radio signal.',
  role: 'A quick ear-catching texture for transitions or intros that need a lo-fi, found-sound feel.',
  engine: 'texture', params: { type:'staticRadio', filterFreq:2200, filterQ:6, lfoRate:1.2, lfoDepth:0.7, duration:3 }
},
{
  id: 'texture-rain', name: 'Distant Rain Ambience', category: 'texture',
  keyword: 'distant rain ambience texture, soft',
  desc: 'A soft, steady layer of filtered noise resembling distant rainfall.',
  role: 'Adds calm, natural atmosphere under ambient, deep, and melodic sections without a mechanical feel.',
  engine: 'texture', params: { type:'rain', filterFreq:3500, filterQ:0.5, lfoRate:0.2, lfoDepth:0.25, duration:5 }
},
{
  id: 'texture-field-crowd', name: 'Crowd / Room Ambience', category: 'texture',
  keyword: 'distant crowd room ambience, live club feel',
  desc: 'A soft, murmurous bed suggesting a distant crowd or room reflection.',
  role: 'Gives a track a “live in the room” feeling, useful for intros or as atmosphere under a big-room drop.',
  engine: 'texture', params: { type:'crowd', filterFreq:1600, filterQ:0.6, lfoRate:0.5, lfoDepth:0.2, duration:5 }
},
{
  id: 'texture-tape-wow', name: 'Tape Wow & Flutter', category: 'texture',
  keyword: 'tape wow and flutter texture, warbly',
  desc: 'A subtle, slowly warbling modulation suggesting an aging tape machine.',
  role: 'Adds organic instability and vintage warmth, making sustained pads and drones feel alive and imperfect.',
  engine: 'texture', params: { type:'drone', baseFreq:110, filterFreq:1200, filterQ:1, lfoRate:0.4, lfoDepth:0.4, duration:4.5, warble:true }
},
{
  id: 'texture-bitcrush-dust', name: 'Digital Dust / Bit Glitch', category: 'texture',
  keyword: 'digital dust bit glitch texture, aliased',
  desc: 'A sparse, aliased glitch layer of tiny digital artifacts.',
  role: 'Brings modern, computerized imperfection to minimal and broken techno without overpowering the groove.',
  engine: 'texture', params: { type:'digitalDust', filterFreq:5000, filterQ:1, lfoRate:6, lfoDepth:0.7, duration:3.5 }
},
{
  id: 'texture-wind', name: 'Howling Wind Drone', category: 'texture',
  keyword: 'howling wind drone texture, cold and open',
  desc: 'A cold, slowly howling wind-like texture with shifting bandpass peaks.',
  role: 'Creates vast, open, desolate atmosphere in ambient and dark techno intros and breakdowns.',
  engine: 'texture', params: { type:'wind', filterFreq:800, filterQ:3, lfoRate:0.2, lfoDepth:0.8, duration:5 }
},
{
  id: 'texture-metal-tail', name: 'Sustained Metal Ring Tail', category: 'texture',
  keyword: 'sustained metal ring texture, cold resonance',
  desc: 'A long, cold, inharmonic ring resembling a struck metal tank or pipe.',
  role: 'Lingers after industrial hits as a cold resonant tail, extending the sense of a huge metallic space.',
  engine: 'texture', params: { type:'metalRing', baseFreq:220, filterFreq:2500, filterQ:4, lfoRate:0.3, lfoDepth:0.3, duration:4 }
},
{
  id: 'texture-underwater', name: 'Underwater Dub Texture', category: 'texture',
  keyword: 'underwater dub texture, muffled and wobbly',
  desc: 'A muffled, slow, wobbling low-passed noise and tone bed.',
  role: 'A heavily dubbed-out, submerged atmosphere for deep dub techno and ambient transitions.',
  engine: 'texture', params: { type:'underwater', baseFreq:80, filterFreq:350, filterQ:1.5, lfoRate:0.25, lfoDepth:0.4, duration:4.5 }
},
{
  id: 'texture-crickets-night', name: 'Night Insects / Field Texture', category: 'texture',
  keyword: 'night insects field texture, organic ambience',
  desc: 'A soft, high, irregular shimmer evoking crickets and open night air.',
  role: 'Adds a natural, outdoor, almost ambient-techno atmosphere — an unexpected organic bed under electronic elements.',
  engine: 'texture', params: { type:'night', filterFreq:6000, filterQ:2, lfoRate:7, lfoDepth:0.3, duration:4.5 }
},

// ------------------------------------------------------------- VOCAL CHOP
{
  id: 'vocal-chop-female', name: 'Female Vocal Chop', category: 'vocal',
  keyword: 'pitched female vocal chop, one-shot hook',
  desc: 'A short, pitched, syllable-like vocal snippet used as a melodic hit.',
  role: 'Modern techno and melodic techno use vocal chops as hooks without committing to full lyrics — catchy but wordless.',
  engine: 'vocal', params: { gender:'female', vowel:'ah', pitch:392, decay:0.35, formant:1.1, reverb:0.2 }
},
{
  id: 'vocal-chop-male', name: 'Male Vocal Chop', category: 'vocal',
  keyword: 'deep male vocal chop, pitched phrase',
  desc: 'A short, deep male-voice snippet tuned to a note.',
  role: 'Adds a human, soulful hook element to deep, Detroit, and tech-house-leaning techno.',
  engine: 'vocal', params: { gender:'male', vowel:'oh', pitch:196, decay:0.4, formant:0.9, reverb:0.25 }
},
{
  id: 'vocal-chop-chopped', name: 'Chopped & Stuttered Vocal', category: 'vocal',
  keyword: 'chopped stuttered vocal sample, rhythmic glitchy',
  desc: 'A vocal fragment cut into rapid, rhythmic stutters.',
  role: 'Creates rhythmic, glitchy vocal energy in modern peak-time and bass-techno without becoming a full vocal line.',
  engine: 'vocal', params: { gender:'female', vowel:'ee', pitch:330, decay:0.6, formant:1.2, chop:true }
},
{
  id: 'vocal-spoken-word', name: 'Spoken-Word Fragment', category: 'vocal',
  keyword: 'spoken-word vocal fragment, whispered monotone',
  desc: 'A short, monotone spoken phrase fragment rather than a sung note.',
  role: 'Adds narrative or mood to dark, industrial, and cinematic techno — a single phrase can define a track’s identity.',
  engine: 'vocal', params: { gender:'male', vowel:'oh', pitch:110, decay:0.9, formant:0.8, spoken:true, reverb:0.4 }
},
{
  id: 'vocal-ahh-pad', name: 'Ethereal Ahh Vocal Pad', category: 'vocal',
  keyword: 'ethereal ahh vocal pad, sustained choir-like',
  desc: 'A sustained, breathy “ahh” that behaves like a pad.',
  role: 'Brings an emotional, human texture to melodic and ambient techno breakdowns without sung lyrics.',
  engine: 'vocal', params: { gender:'female', vowel:'ah', pitch:262, decay:2.4, formant:1.1, reverb:0.5, pad:true }
},
{
  id: 'vocal-cut-up-hook', name: 'Cut-Up Vocal Hook', category: 'vocal',
  keyword: 'cut-up vocal hook, rhythmic pitch-shifted',
  desc: 'A rhythmic, pitch-shifted vocal phrase chopped across the beat.',
  role: 'A memorable, radio-leaning hook device in festival and big-room techno crossovers.',
  engine: 'vocal', params: { gender:'female', vowel:'oh', pitch:440, decay:0.8, formant:1.15, hook:true }
},
{
  id: 'vocal-whisper', name: 'Whispered Vocal Texture', category: 'vocal',
  keyword: 'whispered vocal texture, intimate and eerie',
  desc: 'A breathy, unpitched whisper used as texture rather than melody.',
  role: 'Adds intimacy and unease to dark, minimal, and cinematic techno — close-mic’d and unsettling.',
  engine: 'vocal', params: { gender:'female', vowel:'ah', pitch:160, decay:1.2, formant:1, whisper:true, reverb:0.35 }
},
{
  id: 'vocal-male-chant', name: 'Male Chant / Rave Shout', category: 'vocal',
  keyword: 'male rave chant shout, crowd energy',
  desc: 'A short, percussive male shout or chant hit.',
  role: 'Injects raw crowd energy into peak-time, hard, and old-school-rave moments.',
  engine: 'vocal', params: { gender:'male', vowel:'ah', pitch:180, decay:0.3, formant:0.85, shout:true, reverb:0.2 }
},

];
