# ヨルシカ media library

Keep original uploads here, outside public web assets. `catalog.json` records stable IDs, filenames, dimensions, checksums, and source metadata. Unknown source details stay null; the upload date is not the performance date.

Organization: `albums/<album-id>/songs/<song-id>/<kind>/<collection-id>/originals/`.

- Kinds include `live`, `fan-art`, `official-art`, and `photography`.
- Album-wide artwork belongs under `albums/<album-id>/<kind>/`.
- Artist-wide material belongs under `shared/<kind>/`.
- Add folders when actual material arrives. Use stable ASCII IDs for paths, Japanese display titles in metadata.
- Preserve originals byte-for-byte. Future web exports go in `public/media/yorushika/` and retain an association with the original asset ID.
- Themes reference asset IDs; do not duplicate source images per theme. This allows one song to have several visual themes or live collections.
- Record creator, source URL, and any supplied usage terms for future fan art. Do not infer authorship or a performance title from screenshots.

The initial collection contains six owner-supplied screenshots associated by the owner with 「だから僕は音楽を辞めた」. The exact performance and video source have not been identified. No crops, retouching, or web exports have been made.
