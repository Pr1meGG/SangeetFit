# Indian wear photo library

Internet-sourced starter library for SangeetFit, retrieved 20 October 2026. Photos are hosted locally; browsing and mock try-on need no third-party image requests.

## Model-led concept edit (21 October)

The default collection now begins with five original AI-generated model/outfit concepts: Midnight & Gold Lehenga, Ivory Embroidered Lehenga, Coral Embroidered Anarkali, Emerald Silk Kurta, and Oxblood Bandhgala. Their local JPEGs live under `public/garment_test/editorial/`; `src/data/editorial.ts` records the generation date and hash of each final asset. The displayed image is also its exact YouCam reference. These are fictional models and outfit designs, **not seller products or verified try-on results**. All five remain candidates until live garment fidelity and identity outcomes are reviewed. The fourteen sourced photos below remain available through the collection's archive filter, with their original credits intact.

The machine-readable manifest is `src/data/indian-wear.json`, imported through `src/data/indian-wear.ts`. Each record includes source/author/license links, original/download URL, date, local-file SHA-256, dimensions, garment colors, occasion, and reference-quality notes. Photos are sourced from their Wikimedia Commons file pages; licenses were checked per file, not inferred from Wikimedia's general site license.

## Scope and try-on status

14 photos: 8 women's wear and 6 men's wear. Eight matching reference candidates are enabled in the catalog; six are browse-only because of pose, obstruction, or framing. A candidate is wired for try-on but has **not** been validated by a live YouCam task. No generated result or retailer partnership is implied. Occasion assignments and color hex values are editorial estimates from visual inspection.

The original 17 catalog entries remain. This library adds new, accurately named entries rather than relabeling different photographs as the existing illustrated products. There is no suitably sourced clean frontal sherwani in this starter library.

## Photo credits

Preserve these credits and the per-photo license when redistributing the images. CC BY-SA photos and adaptations retain their specified share-alike license; these assets are separate from the application's code license. Any shared adaptations of those photos should carry the corresponding source credit, change notice, and license. The photographs do not imply endorsement by the depicted people, photographers, designers, or Wikimedia.

| Local file | Photo / author | License | Processing | Status |
| --- | --- | --- | --- | --- |
| `/garment_test/library/ivory-embroidered-lehenga.jpg` | [Designer lehenga , Bridal wear , Wedding wear , Riantas sumanjima.jpg](https://commons.wikimedia.org/wiki/File:Designer_lehenga_,_Bridal_wear_,_Wedding_wear_,_Riantas_sumanjima.jpg) — Rianta’s | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | Resized by Wikimedia; no crop or recoloring. | candidate |
| `/garment_test/library/navy-gold-lehenga.png` | [Ethnic wear for women Blue Lehenga.png](https://commons.wikimedia.org/wiki/File:Ethnic_wear_for_women_Blue_Lehenga.png) — Kanchan Fashion | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | Resized by Wikimedia; no crop or recoloring. | candidate |
| `/garment_test/library/champagne-pink-lehenga.jpg` | [Indian woman wearing choli and lehenga, Oct. 2019.jpg](https://commons.wikimedia.org/wiki/File:Indian_woman_wearing_choli_and_lehenga,_Oct._2019.jpg) — Mohit0593 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | Resized by Wikimedia; no crop or recoloring. | candidate |
| `/garment_test/library/yellow-asymmetric-kurta.jpg` | [Shalwar kameez (1710604).jpg](https://commons.wikimedia.org/wiki/File:Shalwar_kameez_(1710604).jpg) — AddictionBazaar | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | Resized by Wikimedia; no crop or recoloring. | browse-only |
| `/garment_test/library/coral-embroidered-kurta.jpg` | [Shalwar kameez (1710606).jpg](https://commons.wikimedia.org/wiki/File:Shalwar_kameez_(1710606).jpg) — AddictionBazaar | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | Resized by Wikimedia; no crop or recoloring. | candidate |
| `/garment_test/library/ivory-floral-kurta.jpg` | [Shalwar kameez (1710609).jpg](https://commons.wikimedia.org/wiki/File:Shalwar_kameez_(1710609).jpg) — AddictionBazaar | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | Resized by Wikimedia; no crop or recoloring. | browse-only |
| `/garment_test/library/purple-embroidered-saree.jpg` | [Full-body photograph of Vaishnavi Chouhan in saree, Jaipur (2025).jpg](https://commons.wikimedia.org/wiki/File:Full-body_photograph_of_Vaishnavi_Chouhan_in_saree,_Jaipur_(2025).jpg) — Vikas Tanwar | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | Resized by Wikimedia; no crop or recoloring. | browse-only |
| `/garment_test/library/blush-bridal-saree.jpg` | [Wedding saree (4120283).jpg](https://commons.wikimedia.org/wiki/File:Wedding_saree_(4120283).jpg) — Only Paithani | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | Resized by Wikimedia; no crop or recoloring. | candidate |
| `/garment_test/library/gold-silk-kurta.jpg` | [Silk kurta churidar mojari2.jpg](https://commons.wikimedia.org/wiki/File:Silk_kurta_churidar_mojari2.jpg) — Fowler&fowler | [Public domain](https://commons.wikimedia.org/wiki/File:Silk_kurta_churidar_mojari2.jpg#Licensing) | Original image; local filename changed. | candidate |
| `/garment_test/library/ivory-nehru-ensemble.jpg` | [Kurta churidar nehru vest.jpg](https://commons.wikimedia.org/wiki/File:Kurta_churidar_nehru_vest.jpg) — Fowler&fowler | [Public domain](https://commons.wikimedia.org/wiki/File:Kurta_churidar_nehru_vest.jpg#Licensing) | Original image; local filename changed. | candidate |
| `/garment_test/library/ivory-button-kurta.jpg` | [Kurta traditional front sandalwood buttons.jpg](https://commons.wikimedia.org/wiki/File:Kurta_traditional_front_sandalwood_buttons.jpg) — Fowler&fowler | [Public domain](https://commons.wikimedia.org/wiki/File:Kurta_traditional_front_sandalwood_buttons.jpg#Licensing) | Original image; local filename changed. | candidate |
| `/garment_test/library/blue-khadi-kurta.jpg` | [Blue khadi kurta.jpg](https://commons.wikimedia.org/wiki/File:Blue_khadi_kurta.jpg) — Purva4u | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Original image; local filename changed. | browse-only |
| `/garment_test/library/blue-dhoti-kurta.jpg` | [Man in Dhoti Kurta.JPG](https://commons.wikimedia.org/wiki/File:Man_in_Dhoti_Kurta.JPG) — Dsvyas | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | Original image; local filename changed. | browse-only |
| `/garment_test/library/red-embroidered-bandhgala.jpg` | [Bandhgala by Sabyasachi Mukherjee.jpg](https://commons.wikimedia.org/wiki/File:Bandhgala_by_Sabyasachi_Mukherjee.jpg) — Stefan Ivanovich | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | Original image; local filename changed. | browse-only |

## Extending the library

1. Verify the file-level license and inspect the actual photo. Prefer a single frontal complete outfit on a simple background; reject uncertain ownership or retailer images without reuse permission.
2. Store the downloaded image under `public/garment_test/library/`, preserving its license. Do not recolor another outfit to stand in for the requested garment.
3. Add its provenance and styling fields to `src/data/indian-wear.json`. Use a unique `library-` ID. Record the SHA-256 of the actual local file and its actual dimensions.
4. For a reference candidate, set `tryOnReference` to `library/<filename>` and `vtoSupported` to true. Otherwise use null/false and explain the limitation in `referenceNotes`. The catalog and route derive their allowlists from this manifest; no second mapping is needed.
5. Run the offline catalog and route tests, TypeScript check, and build. Live API validation is a separate paid operation.
