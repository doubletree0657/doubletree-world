# ヨルシカ song themes: research and handoff

Research date: 2026-11-01. This is a research note, not an approved page design.

## Owner's direction

- Prioritize a small, satisfying first homepage over the larger personal-site roadmap.
- Base the first theme on 「だから僕は音楽を辞めた」. 「春泥棒」 is a future candidate, not a second implementation task.
- Eventually allow switching song themes through a small corner control. A theme may change composition and imagery as well as colors.
- Keep a possible future move to `yorushika.doubletree.world` in mind without building that infrastructure now.
- Always display song titles in Japanese, in both interface languages. Use ヨルシカ in Chinese interfaces and lowercase yorushika in English interfaces unless the owner explicitly requests an exception.
- Preserve 夜鹿 in the owner's existing Chinese personal monologue; it is an explicit exception. That monologue is the owner's text, not a quotation attributed to the song.
- Names and source links live in `src/i18n/yorushika.ts`. They are not yet wired into the existing homepage.
- The owner will collect live-performance imagery. Backgrounds, cropping, composition, and other uses remain open until those images are reviewed.

## Sources and lyrics status

1. [Official album listing](https://yorushika.com/discography/detail/6/): released 2019-04-10; the title song closes the fourteen-track album.
2. [Official album announcement](https://yorushika.com/news/detail/10450): fictional concept, songs addressed to エルマ, and a physical presentation involving letters and travel photographs.
3. [Label-hosted interview](https://sp.universal-music.co.jp/yorushika/elma/): n-buna discusses the paired narratives of エイミー and エルマ, the Swedish setting, piano as a narrative anchor, and the first album's rougher rock-band character. These remarks concern the albums, not an exhaustive explanation of this individual song.
4. [Lyrics reading source](https://www.uta-net.com/song/265895/): read during research; credits n-buna for lyrics, composition, and arrangement.
5. [Official music-video page](https://yorushika.com/news/detail/11096): retained for later visual study; video playback and detailed frame analysis were not performed in this pass.
6. [Official future-candidate listing](https://yorushika.com/discography/detail/18/): 「春泥棒」 on 「創作」.

Full lyrics and a full translation are not stored here. This note keeps links and original commentary instead. If the owner supplies lyrics, they can be organized separately. Do not treat this file as a lyrics asset.

## Reading of the song

Interpretation, not a claim of a single authorized meaning: the narrator's attempted rejection of music is undermined by attachment. Habit survives the announced decision; frustration with recognition, comparison, aging, and livelihood coexists with an earlier devotion to creating. Defiance turns into uncertainty and self-recognition. The closing recollection of conviction makes the title feel less like a settled practical choice than an unresolved farewell.

The emotional center is wounded attachment: anger protects something still valued. The addressees should not all be collapsed into one literal person, and the fictional speaker should not be equated with n-buna or the site's owner.

## Superseded design hypotheses

These are original design proposals, not official song imagery or verified properties of a live performance.

- Contrast open, luminous space with a small, concentrated area of tension. Avoid assuming that emotional pain requires an entirely black page.
- Try a letter-like reading rhythm: generous quiet space, a decisive title, and a few personal details. Do not turn the homepage into an album encyclopedia.
- Keep DoubleTree visibly present. The song supplies the atmosphere; the page still introduces its owner.
- Compare two treatments after images arrive: a daylight-and-paper treatment, and a stage-light-and-shadow treatment. Let actual image colors guide the palette.
- Choose photographs by usable negative space, silhouette, light direction, and mobile cropping. One strong image may be sufficient for the first version.
- Use restraint in motion. Any future theme control should switch to genuinely available themes and remain usable on mobile.

## Owner correction and current direction

The owner rejected generic melancholy, sentimental original slogans, and a loose atmospheric connection to the song. The earlier daylight/letter concept is superseded. The owner identifies personally with the selected emotions; the object of giving up should remain unspecified.

Anchor the page explicitly in ヨルシカ, 「だから僕は音楽を辞めた」, the supplied live frames, and the owner's supplied Chinese phrasing. Lightly edit that phrasing for rhythm rather than inventing unrelated emotional statements. Do not label these edits as an authoritative translation. Preserve anger, envy, inferiority, disgust, and indifference without adding a reassuring conclusion.

Six originals are archived under `assets/yorushika/`; see its README and catalog. Proposed visual sequence: blue stage-wide opening (05), amber close-up (01), black handwriting interruption (03), window projection pause (02). Frames 04 and 06 are alternate compositions. Use the actual black, blue, amber, and off-white of these frames. Existing embedded handwriting and subtitles must be considered during layout to avoid competing text layers.

The owner approved implementation. The first local prototype now replaces the homepage with four live stills, a Japanese title, bilingual personal passages, and blue/amber/black/sage visual chapters. Source images remain unchanged; Astro generates responsive WebP assets at build time. The page uses a small progressive-enhancement reveal script and respects reduced motion. No theme switch is displayed until a second theme exists. Publication and domain migration remain future work.

## Earlier next discussion (superseded)

Agree on the first visual direction and the minimum personal content; then review the owner's live images. Build one convincing theme before expanding the switching system. No layout, theme runtime, domain configuration, or deployment changes have been made during this research.
