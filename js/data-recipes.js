/* ==========================================================================
   TRACK FORMULAS
   Full production recipes for Suno. Each recipe targets the two fields Suno
   actually has: the Style-of-Music field (plain comma-separated tags, no
   brackets, tempo/key written as text) and the Lyrics field (used purely for
   [bracketed] structure tags since these tracks are instrumental).
   stylePrompt   -> paste into "Style of Music" (written for v4.5 / v5 / v5.5,
                    ~1000 char cap; safely under that here)
   shortPromptV4 -> a trimmed fallback under ~190 chars for the older v4 cap
   structure     -> paste into "Lyrics" field on an instrumental track
   ========================================================================== */

window.TRACK_RECIPES = [

{
  id: 'peak-time', name: 'Peak-Time / Driving Techno', bpm: '130\u2013135', key: 'A minor',
  tagline: 'The 2am main-room formula \u2014 relentless, forward-moving, built to fill a floor.',
  stylePrompt: 'peak-time driving techno, warehouse rave energy, punchy peak-time kick, rolling minimal bassline, driving open hi-hat, layered rave clap, white noise riser, sidechain pumping texture, dark and hypnotic mood, tight punchy club mix, 132 BPM, A minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'peak-time driving techno, punchy kick, rolling bassline, dark warehouse energy, 132 BPM, instrumental',
  structure: [
    { tag: '[Intro | filtered kick and hat only, no bass]', note: '' },
    { tag: '[Build-Up | white noise riser, filter opening]', note: '' },
    { tag: '[Drop | full kick, rolling bassline, driving hats]', note: '' },
    { tag: '[Instrumental Break | stab chords, groove continues]', note: '' },
    { tag: '[Breakdown | kick removed, pad and riser only]', note: '' },
    { tag: '[Drop | full groove returns, layered clap added]', note: '' },
    { tag: '[Outro | filtered kick fading, hats only]', note: '' }
  ],
  commentary: [
    'This is the DJ-tool formula: everything exists to serve the groove, and nothing competes with the kick and bassline for attention. Keep the style prompt front-loaded with "driving" and "peak-time" \u2014 Suno leans on the first words in the field more heavily than the last.',
    'The white noise riser into the drop is doing a lot of work here. Without a real DAW to automate a filter sweep, naming the riser explicitly in the Style field is the closest you can get to that build-and-release tension in one generation.',
    'If the first result feels too polite, add "raw" or "distorted" before the kick tag and regenerate \u2014 small single-word changes near the front of the prompt move the needle more than long descriptive sentences.'
  ],
  keySounds: ['kick-peak-time','bass-minimal-rolling','hat-open-driving','perc-rave-clap-layered','fx-white-noise-riser']
},

{
  id: 'melodic-techno', name: 'Melodic Techno', bpm: '122\u2013126', key: 'F minor',
  tagline: 'Emotional, cinematic, built around a hook you remember after the track ends.',
  stylePrompt: 'melodic techno, cinematic and emotional, warm analog pad, melodic techno string pad, detuned saw lead, punchy peak-time kick, deep sub bass, reverb-heavy spacious mix, uplifting yet dark mood, 124 BPM, F minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'melodic techno, emotional cinematic mood, warm pad, detuned lead, 124 BPM, instrumental',
  structure: [
    { tag: '[Intro | solo pad, no drums, atmospheric]', note: '' },
    { tag: '[Build-Up | kick enters, arpeggio begins]', note: '' },
    { tag: '[Drop | full groove, main melodic lead enters]', note: '' },
    { tag: '[Breakdown | drums drop out, pad and lead only, emotional]', note: '' },
    { tag: '[Build-Up | tension rebuilds, filter opening]', note: '' },
    { tag: '[Final Drop | full arrangement, most intense point]', note: '' },
    { tag: '[Outro | pad fades, lead trails off]', note: '' }
  ],
  commentary: [
    'Melodic techno lives or dies on the breakdown. Spend your character budget describing the emotional quality of the pad and lead ("cinematic", "bittersweet", "uplifting yet dark") rather than more drum detail \u2014 the drums are almost secondary to the mood here.',
    'The genre pairs two moods that seem contradictory ("uplifting yet dark") on purpose. That tension is exactly what separates melodic techno from straightforward trance, and naming both sides of it explicitly helps Suno land in that specific emotional space instead of tipping fully euphoric.',
    'Because this style depends on a strong breakdown-to-drop transition, the [Build-Up] tag right before [Final Drop] is doing the heaviest lifting in the whole structure block \u2014 don\u2019t skip it even though it repeats.'
  ],
  keySounds: ['pad-melodic-string','lead-detuned-saw','bass-straight-sub','pad-dark-analog']
},

{
  id: 'hard-techno', name: 'Hard Techno', bpm: '145\u2013155', key: 'G minor',
  tagline: 'Distorted, relentless, built for a warehouse at full volume.',
  stylePrompt: 'hard techno, distorted and aggressive, hard techno kick, distorted bassline wall of sound, industrial metal hi-hat, FM growl bass, rising tension buildup fx, raw and unpolished mix, dark relentless mood, 148 BPM, G minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'hard techno, distorted aggressive kick, raw industrial energy, 148 BPM, instrumental',
  structure: [
    { tag: '[Intro | distorted kick alone, building]', note: '' },
    { tag: '[Build-Up | tension riser, hats layering in]', note: '' },
    { tag: '[Drop | full distorted kick and bass wall]', note: '' },
    { tag: '[Instrumental Break | stripped to kick and one metallic perc]', note: '' },
    { tag: '[Drop | full intensity returns, harder than before]', note: '' },
    { tag: '[Outro | abrupt cut or fast fade, no soft ending]', note: '' }
  ],
  commentary: [
    'Say "distorted" more than once, in different places \u2014 on the kick tag and on the bass tag separately. Hard techno\u2019s whole identity is kick and bass fusing into one distorted low-end object, so naming distortion on both elements individually matters more than one general "distorted" descriptor.',
    'Resist the urge to add melodic elements. The genre\u2019s power comes from repetition and pressure, not variation \u2014 a clean chord stab in the middle of this style prompt will usually soften the track more than you want.',
    'An abrupt outro is a genre convention, not a mistake \u2014 hard techno tracks in a DJ set often just cut rather than fade, so don\u2019t be afraid to write that explicitly if the first take fades out too gently.'
  ],
  keySounds: ['kick-hard-techno','bass-hard-distorted','bass-fm-growl','hat-industrial-metal','fx-tension-riser']
},

{
  id: 'dub-techno', name: 'Dub Techno', bpm: '118\u2013124', key: 'C minor',
  tagline: 'Deep, spacious, chord-driven \u2014 the Basic Channel lineage.',
  stylePrompt: 'dub techno, deep and spacious, deep dub techno kick, reverb-drenched dub chord stab, warm sub bass, vinyl crackle tape hiss texture, warehouse ambience drone, minimal and hypnotic mood, dubbed-out reverb-heavy mix, 121 BPM, C minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'dub techno, deep spacious reverb chords, soft kick, hypnotic, 121 BPM, instrumental',
  structure: [
    { tag: '[Intro | drone and tape hiss, no kick]', note: '' },
    { tag: '[Instrumental | kick enters, chord stab established]', note: '' },
    { tag: '[Instrumental | groove locked in, minimal variation]', note: '' },
    { tag: '[Breakdown | kick drops, chord and reverb tail only]', note: '' },
    { tag: '[Instrumental | groove returns, subtle new texture layer]', note: '' },
    { tag: '[Outro | chord decays into silence, drone remains]', note: '' }
  ],
  commentary: [
    'The word doing the most work in this prompt is "reverb" \u2014 attach it to the chord stab specifically, not just the overall mix. Dub techno\u2019s entire atmosphere comes from a short chord decaying into a long reverb tail, and Suno needs that spatial detail spelled out per-element, not as a generic mix note.',
    'This is one of the few techno styles where "minimal variation" is a feature to ask for directly. If the output keeps introducing new melodic ideas, add "repetitive, hypnotic, one chord throughout" to pull it back toward the genre\u2019s meditative core.',
    'Because the whole track leans on space and silence, the [Breakdown] tag matters more here than in almost any other subgenre \u2014 don\u2019t skip it even on a short instrumental generation.'
  ],
  keySounds: ['kick-deep-dub','pad-dub-chord-reverb','bass-dub-chord','texture-vinyl-crackle','pad-warehouse-ambience']
},

{
  id: 'minimal-techno', name: 'Minimal Techno', bpm: '125\u2013130', key: 'D minor',
  tagline: 'Groove over melody \u2014 small changes, long loops, total focus on the pocket.',
  stylePrompt: 'minimal techno, stripped-back and hypnotic, rolling minimal techno kick, minimal rolling bassline groove, tight closed hi-hat, woodblock click percussion, subtle filtered stab chord, clean dry mix, understated groove-focused mood, 127 BPM, D minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'minimal techno, stripped back groove, subtle rolling bassline, dry mix, 127 BPM, instrumental',
  structure: [
    { tag: '[Intro | kick and one percussion element only]', note: '' },
    { tag: '[Instrumental | bassline enters, groove established]', note: '' },
    { tag: '[Instrumental | one small element added, otherwise repetitive]', note: '' },
    { tag: '[Breakdown | brief drop to kick and hat alone]', note: '' },
    { tag: '[Instrumental | full groove returns]', note: '' },
    { tag: '[Outro | elements drop out one at a time]', note: '' }
  ],
  commentary: [
    'Say less on purpose. A shorter, sparser style prompt genuinely suits minimal techno better than a dense one \u2014 this is a style where naming five carefully chosen elements beats naming twelve.',
    'Ask for "dry" and "clean" explicitly. Minimal techno usually avoids the big reverb washes that dub and melodic techno lean on, so if the output comes back sounding lush or atmospheric, that\u2019s the tag to add.',
    'The interest in minimal techno comes from what changes bar to bar, not from big drops. Writing "one small element added" into the structure block nudges Suno toward incremental variation instead of a dramatic arrangement.'
  ],
  keySounds: ['kick-rolling-minimal','bass-minimal-rolling','hat-closed-tight','perc-woodblock']
},

{
  id: 'acid-techno', name: 'Acid Techno', bpm: '130\u2013138', key: 'E minor',
  tagline: 'The 303 squelch is the lead instrument \u2014 everything else supports it.',
  stylePrompt: 'acid techno, squelchy and hypnotic, rolling acid 303 bassline, tight acid techno kick, tight closed hi-hat, analog clap, resonant filter sweep riser, raw analog warehouse mood, 134 BPM, E minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'acid techno, squelchy 303 bassline, tight kick, raw warehouse, 134 BPM, instrumental',
  structure: [
    { tag: '[Intro | acid bassline alone, filter closed]', note: '' },
    { tag: '[Build-Up | kick enters, filter slowly opening]', note: '' },
    { tag: '[Drop | full groove, resonance pushed higher]', note: '' },
    { tag: '[Instrumental Break | acid line mutates, new filter pattern]', note: '' },
    { tag: '[Drop | peak resonance and energy]', note: '' },
    { tag: '[Outro | filter closes back down, bassline alone again]', note: '' }
  ],
  commentary: [
    'Lead with "303" and "acid" and "squelchy" \u2014 these are strong, well-represented style words that reliably steer the model, much more than a generic "bassline" tag would.',
    'The genre\u2019s whole arc is a filter opening and closing. Writing that motion into the structure block ("filter closed" \u2192 "filter opening" \u2192 "resonance pushed higher" \u2192 "filter closes back down") gives Suno an actual shape to follow across the track instead of a flat loop.',
    'Keep the kick tight and out of the way \u2014 the acid line needs the low-mid frequency space to read clearly, so avoid pairing it with a sub-heavy kick in the same prompt.'
  ],
  keySounds: ['bass-acid-303','kick-acid-ready','lead-acid-squelch','fx-filter-sweep-riser']
},

{
  id: 'industrial-techno', name: 'Industrial Techno', bpm: '132\u2013142', key: 'B minor',
  tagline: 'Mechanical, cold, and metallic \u2014 techno built to sound like a factory floor.',
  stylePrompt: 'industrial techno, cold and mechanical, distorted industrial techno kick, industrial noise texture bed, metallic clang impact, industrial metal hi-hat, sub-heavy warehouse techno kick, harsh unpolished mix, dark relentless mood, 136 BPM, B minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'industrial techno, cold mechanical, distorted kick, metallic clangs, 136 BPM, instrumental',
  structure: [
    { tag: '[Intro | noise texture bed, metallic hits scattered]', note: '' },
    { tag: '[Build-Up | kick enters underneath the noise]', note: '' },
    { tag: '[Drop | full mechanical groove, harsh and loud]', note: '' },
    { tag: '[Instrumental Break | percussion only, noise bed continues]', note: '' },
    { tag: '[Drop | groove returns, more distortion than before]', note: '' },
    { tag: '[Outro | noise bed remains after drums cut out]', note: '' }
  ],
  commentary: [
    'This is the one subgenre where "unpolished" and "harsh" belong in the prompt on purpose. A clean, radio-ready mix tag actively works against this style \u2014 say the opposite of what you\u2019d usually ask for in a mix-quality tag.',
    'Texture carries as much weight as rhythm here. The noise-bed and metallic-clang tags aren\u2019t decoration \u2014 they\u2019re load-bearing elements of the genre\u2019s identity, so don\u2019t crowd them out to make room for melodic tags.',
    'Letting the noise bed survive into the outro (after the drums cut) is a genre signature \u2014 it\u2019s worth spelling out explicitly since Suno will otherwise default to fading everything out together.'
  ],
  keySounds: ['kick-industrial-distorted','texture-industrial-noise-bed','fx-metallic-clang','hat-industrial-metal','kick-sub-warehouse']
},

{
  id: 'hypnotic-techno', name: 'Hypnotic Techno', bpm: '130\u2013134', key: 'A minor',
  tagline: 'Trance-inducing repetition \u2014 close-listening techno built for headphones and long sets.',
  stylePrompt: 'hypnotic techno, trance-inducing and repetitive, hypnotic ride cymbal, hypnotic 16th-note arpeggio, rolling minimal techno kick, tribal conga percussion loop, subtle detuned chord wash, dry close-mic\u2019d percussive mix, meditative mood, 132 BPM, A minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'hypnotic techno, repetitive percussive groove, ride cymbal, 132 BPM, instrumental',
  structure: [
    { tag: '[Intro | percussion loop alone, building slowly]', note: '' },
    { tag: '[Instrumental | kick and arpeggio enter, locked groove]', note: '' },
    { tag: '[Instrumental | micro-variation only, hypnotic and steady]', note: '' },
    { tag: '[Instrumental | one new percussive layer introduced]', note: '' },
    { tag: '[Breakdown | brief thinning, groove never fully stops]', note: '' },
    { tag: '[Outro | percussion loop continues, fades very slowly]', note: '' }
  ],
  commentary: [
    'Ask for micro-percussion detail (ride, shaker, conga) rather than big synth elements \u2014 hypnotic techno\u2019s pull comes from layered, close-mic\u2019d percussion texture more than from melody or drops.',
    'The word "repetitive" is doing real work in this prompt and shouldn\u2019t be cut for space \u2014 without it Suno tends to introduce more arrangement variety than the genre actually wants.',
    'Notice the outro says the groove "never fully stops" \u2014 hypnotic techno rarely uses a hard breakdown the way peak-time techno does; the goal is a groove you can stay inside of for eight minutes, not a rollercoaster of tension and release.'
  ],
  keySounds: ['hat-ride-hypnotic','lead-hypnotic-arp','perc-tribal-conga','kick-rolling-minimal','pad-detuned-wash']
},

{
  id: 'detroit-techno', name: 'Detroit Techno', bpm: '120\u2013130', key: 'F minor',
  tagline: 'The originators\u2019 sound \u2014 soulful, machine-funk, melodic but raw.',
  stylePrompt: 'Detroit techno, soulful machine-funk, analog pluck synth, warm analog pad, lo-fi analog drum machine kick, classic analog clap, deep straight sub bass, warm vintage analog mix, futuristic yet soulful mood, 124 BPM, F minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'Detroit techno, soulful machine-funk, analog pluck, warm vintage mix, 124 BPM, instrumental',
  structure: [
    { tag: '[Intro | pluck synth melody alone]', note: '' },
    { tag: '[Instrumental | drum machine groove enters]', note: '' },
    { tag: '[Instrumental | pad layer added, groove deepens]', note: '' },
    { tag: '[Breakdown | drums thin out, melody remains]', note: '' },
    { tag: '[Instrumental | full groove returns]', note: '' },
    { tag: '[Outro | melody fades over continuing groove]', note: '' }
  ],
  commentary: [
    'Lean on the phrase "soulful machine-funk" \u2014 it captures the genre\u2019s founding idea (Kraftwerk\u2019s machine precision crossed with Detroit funk and soul) more efficiently than a longer description would, and it\u2019s a phrase the model has plenty of reference material for.',
    'Ask for "warm" and "vintage" on the mix, not "clean" or "modern" \u2014 the genre\u2019s identity is inseparable from the imperfections of early-80s drum machines and analog synths.',
    'Melody matters more here than in most techno subgenres \u2014 the pluck synth is closer to a lead instrument carrying a real musical idea than a rhythmic accent, so give it a clear, sustained role across the whole structure.'
  ],
  keySounds: ['lead-analog-pluck','kick-lofi-analog','pad-dark-analog','perc-analog-clap','bass-straight-sub']
},

{
  id: 'raw-broken-techno', name: 'Raw / Broken Techno', bpm: '135\u2013145', key: 'C# minor',
  tagline: 'Deliberately off-grid \u2014 lo-fi, irregular, closer to noise music than club polish.',
  stylePrompt: 'raw broken techno, lo-fi and irregular, distorted industrial techno kick, granular static texture, modular synth percussion blip, broken radio static texture, degraded low-fidelity mix, unpredictable glitchy mood, 140 BPM, C# minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'raw broken techno, lo-fi glitchy irregular groove, distorted kick, 140 BPM, instrumental',
  structure: [
    { tag: '[Intro | static texture and broken rhythmic fragments]', note: '' },
    { tag: '[Instrumental | irregular kick pattern establishes]', note: '' },
    { tag: '[Instrumental | glitch elements layer in, unstable groove]', note: '' },
    { tag: '[Breakdown | texture only, rhythm falls apart intentionally]', note: '' },
    { tag: '[Instrumental | groove reassembles, rougher than before]', note: '' },
    { tag: '[Outro | disintegrates into static]', note: '' }
  ],
  commentary: [
    'This is the one recipe where you explicitly want Suno to sound imperfect \u2014 "degraded", "lo-fi", and "unpredictable" are doing the opposite job of most production tags, which usually push toward polish.',
    'Because this style resists the neat verse/drop structure the model defaults to, expect to regenerate a few times and possibly stitch two generations together \u2014 the [Breakdown | rhythm falls apart intentionally] tag is the hardest one for any AI model to nail on the first try.',
    'If the result still sounds too clean, add "tape-warped" or "malfunctioning drum machine" near the front of the style prompt \u2014 concrete, almost narrative imagery tends to outperform abstract adjectives like "raw" alone.'
  ],
  keySounds: ['kick-industrial-distorted','texture-granular-static','perc-modular-blip','texture-broken-radio']
},

{
  id: 'deep-techno', name: 'Deep Techno', bpm: '122\u2013128', key: 'G minor',
  tagline: 'Warm, rounded, groove-first \u2014 the deep house/techno crossover sound.',
  stylePrompt: 'deep techno, warm and rounded, rolling minimal techno kick, deep straight sub bass, tape-saturated hi-hat, filtered stab chord, dark analog pad, warm smooth club mix, laid-back nocturnal mood, 125 BPM, G minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'deep techno, warm rounded groove, sub bass, laid-back nocturnal mood, 125 BPM, instrumental',
  structure: [
    { tag: '[Intro | pad and sub bass, slow entry]', note: '' },
    { tag: '[Instrumental | kick and hat groove locks in]', note: '' },
    { tag: '[Instrumental | stab chord adds harmonic movement]', note: '' },
    { tag: '[Breakdown | groove thins, pad carries the section]', note: '' },
    { tag: '[Instrumental | full groove returns, slightly fuller]', note: '' },
    { tag: '[Outro | groove loops down to just kick and pad]', note: '' }
  ],
  commentary: [
    'Deep techno sits right between deep house and techno, so words like "warm", "rounded", and "smooth" matter as much as the tempo tag \u2014 without them the model can just as easily land on a colder, more minimal result.',
    'This style rewards a slightly higher word count on mood versus rhythm compared to peak-time techno \u2014 the groove itself is simple and repetitive on purpose, so the atmosphere words are what separate a good result from a generic one.',
    'A tape-saturated hat instead of a bright digital one is a small choice that does a lot here \u2014 it is the detail most likely to push the whole mix toward that late-night, rounded-off character.'
  ],
  keySounds: ['bass-straight-sub','hat-tape-saturated','pad-dark-analog','lead-filtered-stab']
},

{
  id: 'ambient-techno', name: 'Ambient / Downtempo Techno', bpm: '100\u2013118', key: 'D minor',
  tagline: 'Beatless or half-tempo \u2014 built for intros, outros, or a full listening-room track.',
  stylePrompt: 'ambient techno, downtempo and atmospheric, slow evolving drone pad, warehouse ambience drone, distant sub rumble texture, sparse filtered percussion, reverb-heavy spacious mix, contemplative introspective mood, 108 BPM, D minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'ambient techno, downtempo atmospheric drone, sparse and spacious, 108 BPM, instrumental',
  structure: [
    { tag: '[Intro | drone alone, no rhythm]', note: '' },
    { tag: '[Instrumental | sparse percussion enters, very slow]', note: '' },
    { tag: '[Instrumental | texture layers build gradually]', note: '' },
    { tag: '[Instrumental | peak density, still restrained]', note: '' },
    { tag: '[Outro | percussion fades, drone remains and dissolves]', note: '' }
  ],
  commentary: [
    'Drop "kick" from the prompt entirely, or demote it to "sparse filtered percussion" \u2014 the genre\u2019s whole point is the absence of a driving four-on-the-floor pulse, so naming a kick at all can pull the result back toward standard techno.',
    'This is a natural choice for a track intro or outro rather than a full song \u2014 consider generating it short and using it to bookend a peak-time or hard techno track in your DAW.',
    'Silence is a tag you can ask for. Phrases like "sparse", "restrained", and "contemplative" tell Suno to leave space in the arrangement, which is normally the opposite of what club-focused prompts request.'
  ],
  keySounds: ['pad-evolving-drone','pad-warehouse-ambience','texture-sub-rumble']
},

{
  id: 'tribal-techno', name: 'Tribal Techno', bpm: '124\u2013130', key: 'E minor',
  tagline: 'Percussion-forward and organic \u2014 hand drums over pure machine rhythm.',
  stylePrompt: 'tribal techno, percussive and organic, tribal conga percussion loop, analog shaker loop, rolling minimal techno kick, woodblock click percussion, warm analog pad, live-feeling percussive mix, earthy hypnotic mood, 127 BPM, E minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'tribal techno, organic percussive groove, hand drums, hypnotic, 127 BPM, instrumental',
  structure: [
    { tag: '[Intro | percussion ensemble alone, call-and-response feel]', note: '' },
    { tag: '[Instrumental | kick enters underneath the percussion]', note: '' },
    { tag: '[Instrumental | full percussive layering, groove peaks]', note: '' },
    { tag: '[Breakdown | percussion thins to one or two elements]', note: '' },
    { tag: '[Instrumental | full percussion returns]', note: '' },
    { tag: '[Outro | percussion loop fades out gradually]', note: '' }
  ],
  commentary: [
    'Name at least three distinct percussion instruments in the prompt (conga, shaker, woodblock) rather than one generic "percussion" tag \u2014 this genre is defined by layered hand-drum-style interplay, and Suno needs the individual pieces named to build that texture.',
    'Keep the kick and bass relatively plain and out of the spotlight \u2014 unlike acid or hard techno, tribal techno puts the rhythmic interest almost entirely in the percussion layer, not the low end.',
    '"Live-feeling" is worth the characters it costs \u2014 it nudges the mix away from the ultra-quantized, grid-locked feel of most machine techno and toward something closer to a hand-played rhythm ensemble.'
  ],
  keySounds: ['perc-tribal-conga','hat-shaker','perc-woodblock','kick-rolling-minimal']
},

{
  id: 'uplifting-trance-techno', name: 'Uplifting / Trance-Techno Crossover', bpm: '132\u2013138', key: 'A minor',
  tagline: 'Techno structure, trance-scale euphoria \u2014 big rooms and bigger builds.',
  stylePrompt: 'uplifting trance-techno crossover, euphoric and driving, punchy peak-time kick, detuned saw lead, melodic techno string pad, resonant filter sweep riser, white noise riser, bright energetic mix, euphoric and triumphant mood, 135 BPM, A minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'trance-techno crossover, euphoric uplifting energy, big lead, 135 BPM, instrumental',
  structure: [
    { tag: '[Intro | pad and lead motif, no drums]', note: '' },
    { tag: '[Build-Up | kick enters, riser climbs steadily]', note: '' },
    { tag: '[Drop | full groove, lead melody at full volume]', note: '' },
    { tag: '[Breakdown | drums drop, pad and lead swell emotionally]', note: '' },
    { tag: '[Build-Up | second riser, longer and higher than the first]', note: '' },
    { tag: '[Final Drop | peak energy, all elements combined]', note: '' },
    { tag: '[Outro | lead melody repeats and fades]', note: '' }
  ],
  commentary: [
    'This crossover leans harder on trance-style dynamics than most techno on this list \u2014 two full build-and-drop cycles instead of one, with the second build explicitly longer, mirrors how trance earns its biggest moment by making the listener wait slightly longer the second time.',
    '"Euphoric" and "triumphant" are strong, well-worn mood words in Suno\u2019s training data for this kind of crossover \u2014 they tend to move the result further than more technical descriptors would.',
    'If the result leans too far into trance and loses the techno groove underneath, add "techno swing" or re-emphasize "driving kick" earlier in the prompt \u2014 word order is doing real steering work in a crossover style like this one.'
  ],
  keySounds: ['lead-detuned-saw','pad-melodic-string','kick-peak-time','fx-filter-sweep-riser','fx-white-noise-riser']
},

{
  id: 'hardgroove-techno', name: 'Hardgroove Techno', bpm: '128\u2013134', key: 'F minor',
  tagline: 'Funky, percussive, and driving \u2014 techno with a swing in its hips.',
  stylePrompt: 'hardgroove techno, funky and percussive, punchy peak-time kick, tribal conga percussion loop, metallic percussion stab, rolling acid 303 bassline, analog shaker loop, tight groove-focused mix, driving funky mood, 130 BPM, F minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'hardgroove techno, funky percussive driving groove, tight mix, 130 BPM, instrumental',
  structure: [
    { tag: '[Intro | percussion groove alone, funky and syncopated]', note: '' },
    { tag: '[Instrumental | kick and bassline lock into the groove]', note: '' },
    { tag: '[Instrumental | full percussion layering, peak funk]', note: '' },
    { tag: '[Breakdown | percussion solo, drums thin out]', note: '' },
    { tag: '[Instrumental | full groove returns]', note: '' },
    { tag: '[Outro | percussion loop rides out and fades]', note: '' }
  ],
  commentary: [
    'The word "funky" is unusual in a techno prompt and that\u2019s exactly why it earns its place \u2014 it tells Suno to introduce syncopation and swing that a purely "driving" or "peak-time" tag wouldn\u2019t ask for.',
    'This is one of the few recipes on this list that pairs hand percussion with an acid bassline \u2014 the combination is the genre\u2019s signature, so keep both explicitly named rather than letting one imply the other.',
    'A short percussion solo in the breakdown, without pads or big riser fx, keeps the focus on rhythm the way the genre demands \u2014 resist the temptation to fill that section with atmosphere.'
  ],
  keySounds: ['kick-peak-time','perc-tribal-conga','perc-metallic-stab','bass-acid-303','hat-shaker']
},

{
  id: 'schranz-hard', name: 'Schranz Napalm Techno', bpm: '150\u2013158', key: 'F# minor',
  tagline: 'Berlin-hard, over-driven, syncopated kick distortion \u2014 the sound of a warehouse at breaking point.',
  stylePrompt: 'schranz hard techno, heavily distorted and syncopated, schranz napalm kick, industrial metal snare, industrial metal hi-hat, FM growl bass, rising tension buildup fx, harsh unpolished raw mix, aggressive relentless mood, 152 BPM, F# minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'schranz hard techno, heavily distorted kick, industrial percussion, raw, 152 BPM, instrumental',
  structure: [
    { tag: '[Intro | distorted kick alone, filter opening]', note: '' },
    { tag: '[Build-Up | snare rush and hats layer in]', note: '' },
    { tag: '[Drop | full distorted kick, bass, and metal percussion]', note: '' },
    { tag: '[Instrumental Break | kick removed, industrial noise and clangs]', note: '' },
    { tag: '[Drop | harder distortion, syncopated kick pattern]', note: '' },
    { tag: '[Outro | abrupt hard cut]', note: '' }
  ],
  commentary: [
    'Name the distortion on the kick and the bass separately \u2014 schranz lives or dies on the kick itself becoming a saturated, syncopated instrument, not just a clean pulse.',
    'Asking for a syncopated kick pattern is one of the few ways to push Suno away from a rigid four-on-the-floor grid while still staying inside hard techno.',
    'An abrupt, hard-cut outro is a genre convention here \u2014 do not soften it with a long fade.'
  ],
  keySounds: ['kick-schranz','snare-industrial','hat-industrial-metal','bass-fm-growl','fx-tension-riser','perc-industrial-hit']
},

{
  id: 'psy-techno', name: 'Psy-Techno', bpm: '138\u2013145', key: 'A minor',
  tagline: 'Techno drive meets psytrance energy \u2014 rolling bass, trippy leads, and relentless forward motion.',
  stylePrompt: 'psy-techno, trippy and driving, psy-techno kick, fast 16th-note acid 303 bassline, psy rolling hi-hat, psy-techno pluck, sci-fi sweep fx, dark hallucinogenic mood, tight punchy club mix, 142 BPM, A minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'psy-techno, rolling acid bass, trippy plucks, driving hats, 142 BPM, instrumental',
  structure: [
    { tag: '[Intro | kick and rolling bassline only]', note: '' },
    { tag: '[Build-Up | sci-fi sweep and hats intensify]', note: '' },
    { tag: '[Drop | full groove, psy pluck sequence enters]', note: '' },
    { tag: '[Breakdown | drums strip, acid line mutates]', note: '' },
    { tag: '[Build-Up | riser climbs, filter opens]', note: '' },
    { tag: '[Drop | peak energy, all layers]', note: '' },
    { tag: '[Outro | kick fades, bassline rolls out]', note: '' }
  ],
  commentary: [
    'The rolling 16th-note acid bassline is doing most of the genre work \u2014 keep the kick tight and the mix clean so the fast bass pattern stays articulate instead of muddy.',
    'Words like "trippy", "hallucinogenic", and "psychedelic" steer the leads and FX toward the genre\u2019s character better than more technical mix adjectives.',
    'Avoid big chord pads \u2014 psy-techno stays hypnotic through fast, detailed motion rather than harmonic washes.'
  ],
  keySounds: ['kick-psy','bass-acid-line-16','hat-psy-roll','lead-psy-pluck','fx-scifi-sweep']
},

{
  id: 'rominimal', name: 'Rominimal / Micro-Minimal', bpm: '122\u2013127', key: 'G minor',
  tagline: 'Tiny, funky micro-sounds, loose swung percussion, and a bassline that does the talking.',
  stylePrompt: 'Rominimal micro-minimal techno, stripped-back and funky, rolling minimal techno kick, minimal rolling bassline groove, wooden klak percussion, loose swung hi-hat, subtle filtered stab chord, dry detailed minimal mix, understated hypnotic mood, 125 BPM, G minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'Rominimal minimal, funky micro-percussion, rolling bass, dry and swung, 125 BPM, instrumental',
  structure: [
    { tag: '[Intro | kick and one micro-percussion element]', note: '' },
    { tag: '[Instrumental | bassline enters, groove locks]', note: '' },
    { tag: '[Instrumental | tiny percussive details added]', note: '' },
    { tag: '[Breakdown | brief drop to bass and click]', note: '' },
    { tag: '[Instrumental | groove returns, subtle new stab]', note: '' },
    { tag: '[Outro | elements fade one at a time]', note: '' }
  ],
  commentary: [
    'Rominimal rewards extreme restraint \u2014 name one or two tiny percussive sounds (wooden click, micro-blip) rather than a wall of elements.',
    'Asking for "loose", "swung", or "off-grid" percussion gives the genre its signature human, wobbly pocket; a perfectly quantized grid kills it.',
    'The bassline is the real lead instrument here, so spend characters describing its movement ("rolling", "subtle", "funky") instead of melodic hooks.'
  ],
  keySounds: ['kick-rolling-minimal','bass-minimal-rolling','perc-wooden-klak','hat-loose-swung','lead-filtered-stab']
},

{
  id: 'ebm-techno', name: 'EBM-Techno', bpm: '128\u2013136', key: 'A minor',
  tagline: 'Sequenced bass, marching snares, cold synths \u2014 industrial body music engineered for the dancefloor.',
  stylePrompt: 'EBM-techno, cold and militant, Birmingham industrial kick, EBM marching snare, dark hypnotic acid bassline, dark analog pad, metallic percussion stab, raw monochrome mix, aggressive disciplined mood, 132 BPM, A minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'EBM-techno, marching snare, sequenced bass, cold industrial, 132 BPM, instrumental',
  structure: [
    { tag: '[Intro | sequenced bassline and snare march]', note: '' },
    { tag: '[Instrumental | kick enters, groove locks]', note: '' },
    { tag: '[Build-Up | snare roll builds tension]', note: '' },
    { tag: '[Drop | full EBM groove, metallic percussion]', note: '' },
    { tag: '[Breakdown | drums thin, dark pad remains]', note: '' },
    { tag: '[Drop | groove returns, harder]', note: '' },
    { tag: '[Outro | snare march fades]', note: '' }
  ],
  commentary: [
    'The marching snare is the EBM signature \u2014 without it you are likely to get generic industrial techno, so keep it named and prominent.',
    '"Militant", "disciplined", and "monochrome" steer the arrangement toward EBM\u2019s rigid, sequenced repetition rather than chaotic noise.',
    'Keep pads sparse and dark; EBM is bass- and rhythm-led, and too much harmony softens its cold, mechanical identity.'
  ],
  keySounds: ['kick-birmingham','snare-march','bass-acid-hypnotic-dark','perc-metallic-stab','pad-dark-analog']
},

{
  id: 'afro-tech', name: 'Afro Techno', bpm: '122\u2013128', key: 'D minor',
  tagline: 'Polyrhythmic hand percussion and marimba-style bass over a techno pulse \u2014 organic and driving at once.',
  stylePrompt: 'afro techno, polyrhythmic and organic, low tribal tom kick, djembe slap percussion, high bongo percussion, analog shaker loop, marimba-style tribal bass, warm analog pad, live percussive mix, earthy hypnotic mood, 124 BPM, D minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'afro techno, organic polyrhythmic percussion, marimba bass, 124 BPM, instrumental',
  structure: [
    { tag: '[Intro | percussion ensemble, polyrhythmic]', note: '' },
    { tag: '[Instrumental | kick enters under the percussion]', note: '' },
    { tag: '[Instrumental | marimba bassline locks in]', note: '' },
    { tag: '[Breakdown | percussion call-and-response]', note: '' },
    { tag: '[Instrumental | full groove returns]', note: '' },
    { tag: '[Outro | percussion fades gradually]', note: '' }
  ],
  commentary: [
    'Name at least three distinct hand-percussion sounds (djembe, bongo, shaker) \u2014 polyrhythm only reads if Suno has individual pieces to interlock.',
    'Keep the kick relatively soft and low; it anchors the groove without overpowering the percussion that defines the style.',
    '"Live-feeling" and "polyrhythmic" are worth the characters \u2014 they push the rhythm away from a straight 4/4 grid toward the genre\u2019s core feel.'
  ],
  keySounds: ['kick-tribal-low','perc-djembe','perc-bongo-high','hat-shaker','bass-tribal-marimba','pad-tribal-ambient']
},

{
  id: 'afterlife-melodic-deep', name: 'Afterlife-Style Melodic Deep Techno', bpm: '120\u2013124', key: 'F minor',
  tagline: 'Festival-scale, cinematic, emotionally huge \u2014 slow, orchestral melodic techno built for big stages.',
  stylePrompt: 'Afterlife-style melodic deep techno, cinematic and emotional, Afterlife-style deep melodic kick, melodic techno string pad, supersaw lead hook, ethereal ahh vocal pad, deep sub bass, reverb-heavy spacious mix, bittersweet euphoric mood, 122 BPM, F minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'Afterlife-style melodic techno, cinematic pad, supersaw lead, deep kick, 122 BPM, instrumental',
  structure: [
    { tag: '[Intro | solo pad, atmospheric, no drums]', note: '' },
    { tag: '[Build-Up | kick enters, arp begins under the pad]', note: '' },
    { tag: '[Drop | full groove, supersaw lead hook]', note: '' },
    { tag: '[Breakdown | drums drop, vocal pad swells emotionally]', note: '' },
    { tag: '[Build-Up | riser climbs steadily]', note: '' },
    { tag: '[Final Drop | all elements at full scale]', note: '' },
    { tag: '[Outro | pad and lead trail into reverb]', note: '' }
  ],
  commentary: [
    'The breakdown is the emotional center of the track \u2014 describe the pad and vocal texture there in emotional terms ("bittersweet", "euphoric", "soaring") rather than technical ones.',
    'A single, memorable supersaw hook does more work than many layered leads \u2014 keep the melodic focus clear.',
    'Keep the BPM in the low 120s; the festival-scale feeling comes from space and reverb as much as from tempo.'
  ],
  keySounds: ['kick-afterlife','pad-melodic-string','lead-supersaw','vocal-ahh-pad','bass-straight-sub','fx-white-noise-riser']
},

{
  id: 'hard-trance-techno', name: 'Hard Trance-Techno', bpm: '140\u2013148', key: 'B minor',
  tagline: 'Faster, sharper, and less patient than uplifting crossover \u2014 big hoover bass and huge leads.',
  stylePrompt: 'hard trance-techno, fast and euphoric, trance-techno kick, rave hoover bass, supersaw lead hook, resonant filter sweep riser, snare rush build, bright energetic mix, triumphant aggressive mood, 144 BPM, B minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'hard trance-techno, hoover bass, supersaw lead, fast and euphoric, 144 BPM, instrumental',
  structure: [
    { tag: '[Intro | kick and hoover bass, high energy]', note: '' },
    { tag: '[Build-Up | snare rush and filter sweep]', note: '' },
    { tag: '[Drop | full lead and bass at full intensity]', note: '' },
    { tag: '[Breakdown | lead motif alone, emotional]', note: '' },
    { tag: '[Build-Up | longer riser, second build]', note: '' },
    { tag: '[Final Drop | peak energy]', note: '' },
    { tag: '[Outro | kick cuts, lead rings out]', note: '' }
  ],
  commentary: [
    'Pair the hoover bass explicitly with a supersaw lead \u2014 their contrast (a gritty low-end and a clean high-end) is what makes the hard-trance hybrid hit.',
    'Keep builds shorter and more impatient than uplifting trance; hard trance-techno rewards getting to the payoff quickly.',
    '"Triumphant" and "aggressive" together steer the result away from soft euphoria into the harder edge of the crossover.'
  ],
  keySounds: ['kick-trance','bass-hoover','lead-supersaw','fx-filter-sweep-riser','fx-snare-rush']
},

{
  id: 'berlin-dub', name: 'Berlin Dub Techno', bpm: '128\u2013132', key: 'A minor',
  tagline: 'Deep, dubbed-out, long blends \u2014 chord haze over a patient, hypnotic groove.',
  stylePrompt: 'Berlin dub techno, deep and hazy, Berlin Berghain-style techno kick, Berlin dub chord pad, dub techno bass chord stab, vinyl crackle tape hiss texture, hypnotic ride cymbal, modular machine drone texture, spacious dubbed-out mix, meditative hypnotic mood, 130 BPM, A minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'Berlin dub techno, washed chords, deep kick, haze and crackle, 130 BPM, instrumental',
  structure: [
    { tag: '[Intro | drone and crackle, no kick]', note: '' },
    { tag: '[Instrumental | kick enters, chord haze established]', note: '' },
    { tag: '[Instrumental | groove locked, minimal change]', note: '' },
    { tag: '[Breakdown | kick drops, chord tail and drone]', note: '' },
    { tag: '[Instrumental | groove returns slowly]', note: '' },
    { tag: '[Outro | chords decay, drone and crackle remain]', note: '' }
  ],
  commentary: [
    'Attach "reverb", "delay", and "washed-out" directly to the chords, not just to the overall mix \u2014 dub techno\u2019s atmosphere lives in the chord tails.',
    'Ask for minimal variation explicitly; this style is built for long DJ blends, and constant new ideas work against it.',
    'Crackle, hum, and drone are not decoration \u2014 they are part of the genre\u2019s texture, so keep them named.'
  ],
  keySounds: ['kick-berghain','pad-berlin-dub','bass-dub-chord','texture-vinyl-crackle','hat-ride-hypnotic','texture-modular-drone']
},

{
  id: 'darkwave-techno', name: 'Darkwave / Coldwave Techno', bpm: '124\u2013130', key: 'E minor',
  tagline: 'Gothic minor-key synths and cold mood over a techno rhythm \u2014 brooding and cinematic.',
  stylePrompt: 'darkwave coldwave techno, brooding and cinematic, deep dub techno kick, cinematic dark pad, dark analog pad, Detroit string-machine synth lead, deep straight sub bass, tape-saturated hi-hat, cold reverb-heavy mix, melancholic dark mood, 126 BPM, E minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'darkwave techno, cold gothic synths, brooding mood, 126 BPM, instrumental',
  structure: [
    { tag: '[Intro | cold pad and arpeggio, no drums]', note: '' },
    { tag: '[Instrumental | kick and bass enter, mood sets]', note: '' },
    { tag: '[Instrumental | string-machine lead develops]', note: '' },
    { tag: '[Breakdown | drums thin, pad and lead remain]', note: '' },
    { tag: '[Build-Up | tension and filter sweep]', note: '' },
    { tag: '[Drop | full cold groove returns]', note: '' },
    { tag: '[Outro | lead fades into reverb]', note: '' }
  ],
  commentary: [
    'Mood words carry this style \u2014 "brooding", "cold", "melancholic", and "gothic" steer the harmony and timbre more than drum detail.',
    'Keep the drums simple and damped; the interest lives in the synth melodies and pad, not in busy percussion.',
    'A string-machine or cold synth lead is the genre\u2019s signature voice \u2014 name it specifically rather than asking for a generic lead.'
  ],
  keySounds: ['kick-deep-dub','pad-dark-cinematic','lead-detroit-string-machine','bass-straight-sub','hat-tape-saturated']
},

{
  id: 'bass-techno', name: 'Bass Techno', bpm: '130\u2013140', key: 'F minor',
  tagline: 'Sound-design-led low end \u2014 dubstep-weight bass inside a techno framework.',
  stylePrompt: 'bass techno, heavy and precise, punchy peak-time kick, distorted FM growl bass, dark neuro reese bass, off-beat techno bass stab, tight closed hi-hat, industrial metal hit percussion, sub-heavy detailed mix, dark aggressive mood, 136 BPM, F minor, instrumental, no vocals, no lyrics',
  shortPromptV4: 'bass techno, heavy growl and reese bass, tight drums, 136 BPM, instrumental',
  structure: [
    { tag: '[Intro | sub and sparse percussion, half-time feel]', note: '' },
    { tag: '[Build-Up | riser and hat pattern intensify]', note: '' },
    { tag: '[Drop | full kick and bass, sub-heavy]', note: '' },
    { tag: '[Instrumental Break | bass design variation]', note: '' },
    { tag: '[Drop | heavier second drop]', note: '' },
    { tag: '[Outro | sub rings out, drums cut]', note: '' }
  ],
  commentary: [
    'This is one techno style where naming two bass sounds (a growl and a reese, for example) makes sense \u2014 the genre is defined by bass-sound design rather than one repeating line.',
    'Ask for "sub-heavy" but also "detailed" \u2014 the bass should feel huge without turning the whole mix muddy.',
    'Keep melodic elements minimal; the bass is the hook and the sound design is the attraction.'
  ],
  keySounds: ['kick-peak-time','bass-fm-growl','bass-reese-dark','bass-stab-offbeat','hat-closed-tight','perc-industrial-hit']
},

];
