# Media manifest — Pedicurepraktijk FootCare+

Source: 82 Facebook posts (page 100087431473852) via Apify danek/facebook-pages-posts-ppe, plus 6 Google Maps reviews (CID 5578551053405932658) via prodiger/google-maps-scraper.

Google Maps run returned **0 photos** (only 6 reviews; 1 review had an attached customer photo). All other media came from Facebook.

- Photos downloaded: 38 (37 Facebook unique + 1 Google review customer photo). Stored in `scraped-media/fb-img-NN.jpg` and `google-review-img.jpg`.
- Videos downloaded: 8 (4 album-preview videos + 4 standalone). Stored in `scraped-media/fb-video-NN.mp4`. None used in final selection — see notes below.
- Kept and shipped in `/public`: **13 webp** (one source per distinct scene).
- Sequential downloads are also archived under `scraped-media/named/` with semantic filenames for forensic reference.

A large portion of the source feed turned out to be stock graphics (new year/Valentine's/Mother's Day cards), unrelated personal milestones (son's birthday, anniversary, family dog, vacation announcements), and product ads (HFL Laboratories, Orly, parfum gift cards). All of those were filtered out.

## Important inspection note

The Read tool hit a cumulative many-image payload cap mid-curation. Images 1-20 were visually confirmed; images 21-37 were classified using each post's caption text plus file shape (landscape vs portrait) and color statistics. The hero pick (`hero-house.webp`, from `fb-img-31`) is based on the "Even een kleine update van de praktijk" album post returning a 2048x1536 landscape shot — the strongest fit for the front-of-practice image specified in `INFO.md`. If on visual inspection that frame is not the house+sign exterior, swap with `praktijk-exterior.webp` (`fb-img-32`, same album, also landscape). Both were drawn from the same "praktijk update" announcement.

## Final `/public` assets

| File | Source | Caption / alt text | Suggested usage |
|------|--------|--------------------|-----------------|
| `hero-house.webp` | fb-img-31 (2048x1536 landscape, "Even een kleine update van de praktijk" album) | Front of FootCare+ practice in Wijckel | Edge-to-edge hero background |
| `og-image.webp` | fb-img-31 same scene | Pedicurepraktijk FootCare+ in Wijckel | Social sharing card (1200x900) |
| `praktijk-exterior.webp` | fb-img-32 (sibling landscape from same praktijk update album) | Alternative angle of the practice exterior | Secondary location/contact section |
| `gerda-portret.webp` | fb-img-14 (visually confirmed) | Gerda Haringsma in her treatment room, seated by the pedicure chair next to her workstation | About-section portrait; team card |
| `service-pedicure.webp` | fb-img-13 (visually confirmed) | Gerda performing a pedicure on a client, focused work with gloves and instrument | Service card: Basis pedicure |
| `service-medische.webp` | fb-img-04 (visually confirmed) | Close-up of gloved hands working on a toe with a sterile instrument under direct light | Service card: Medische pedicure (the "Plus") |
| `service-nageltechniek.webp` | fb-img-07 (visually confirmed) | Clean, well-shaped natural nails after a treatment | Service card: Nageltechniek / lakken |
| `marquee-1.webp` | fb-img-08 (visually confirmed) | Older client's hands resting after a manicure, soft daylight | Horizontal marquee slot |
| `marquee-2.webp` | fb-img-19 (visually confirmed) | Orly nail-polish swatch sticks fanned on a wood surface, showing the color range | Horizontal marquee slot |
| `marquee-3.webp` | fb-img-24 (inferred from "Voor het eerst naar de pedicure" album, 1536x2048) | First-time pedicure scene | Horizontal marquee slot |
| `marquee-4.webp` | fb-img-30 (inferred, same "praktijk update" album as hero, portrait orientation) | Practice update detail shot | Horizontal marquee slot |
| `marquee-5.webp` | google-review-img (3024x4032 customer-submitted photo via Henk Vander Meer review) | Result-of-treatment photo posted by a satisfied client of Gerda's | Horizontal marquee slot |
| `gallery-1.webp` | fb-img-33 (inferred, "praktijk update" album sibling, portrait) | Practice detail / interior corner | Bento gallery slot |

## Slots intentionally skipped

The instruction said: if you can't fill a slot with a genuinely distinct image, drop it and call it out. Doing that loudly here:

- `service-diabetes.webp` — **skip this section**. No image in the feed depicts diabetic-foot examination specifically; the medische / instrument macro (`service-medische.webp`) already covers the medical angle. Either reuse `service-medische.webp` in the diabetes copy block, or replace the diabetes card with a text-only treatment description.
- `service-massage.webp` — **skip this section**. No voetmassage imagery exists in the feed. Suggest dropping this service card or representing it with an icon only.
- `usp-1.webp`, `usp-2.webp`, `usp-3.webp`, `usp-4.webp` — **skip**. No clean small-icon credentials photos exist. The components agent should render the USP strip with `lucide-react` icons (e.g. ShieldCheck for ProVoet-erkend, HeartPulse for diabetische voet, Sparkles for nageltechniek, MapPin for aan-huis-praktijk) instead of bitmap files.
- `marquee-6.webp`, `marquee-7.webp`, `marquee-8.webp` — **skip**. Only 5 truly distinct treatment/practice/result scenes are available beyond the hero/services/portrait. Run the marquee with 5 slides or duplicate at the edges if the layout strictly needs 8 frames — but do not pad with the service/hero scenes, that would read as repetitive.
- `gallery-2.webp` … `gallery-6.webp` — **skip**. Only one distinct portfolio scene (`gallery-1.webp`) remains after the hero, services, portrait, exterior and marquee absorb every unique frame in the feed. Either render the bento gallery with 1 hero tile, or omit the gallery section entirely and replace with a Reviews block (6 written reviews are available — see "Reviews" section below).

## Reviews (text only — usable for a Reviews/Testimonials block)

Pulled from Google Maps (CID 5578551053405932658). All in Dutch:

1. **Henk Vander Meer** — "Zeer aan te bevelen, gaat heel netjes en precies te werk. Mijn moeder had een slechte ervaring gehad met een andere pedicure, ze zag er tegenop maar was zo blij en geen pijn gehad. Gerda kan goed met ouderen omgaan dus wij bevelen haar aan." (came with a photo, now `marquee-5.webp`)
2. **Els Huijbers** — "Heerlijke eeltreiniging gehad, en ook een super leuke vrouw is Gerda, je voelt je gelijk bij haar thuis, dus van ons krijgt ze een dikke 10." Owner reply: "Wat een mooie woorden. Dank je wel."
3. **M.K. Deinum** — "Een fijne ervaring gehad met de pedicure behandeling van Gerda. In haar prachtige, nieuwe praktijk aan huis ontvangt ze je enthousiast. Gerda werkt netjes en nauwkeurig en legt uit wat ze gaat doen en geeft op alle mogelijke vragen antwoord …"
4. **Rianne Heikoop** — "Ik raad Footcare+ zeker aan! Gerda is een lieve en gezellige vrouw die wel van een praatje houdt. Werkt erg hygiënisch en op een fijne manier. Ze weet precies waar ze het over heeft …"
5. **Siepie De Vries** — "Wij geven Footcare+ 5 sterren. Gerda is in haar werk secuur en neemt alle tijd voor de mens. Ook is het erg fijn dat ze aan huis komt. …"
6. **Jan Nota** — "Vakkundig en Professioneel." Owner reply: "Dank jullie wel voor deze mooie review. Altijd even gezellig."

## Video notes

8 videos pulled (`scraped-media/fb-video-*.mp4`). All under 1 MB except two ~5 MB album-preview videos that are private-life / non-treatment material judging by their parent posts (anniversary, son's birthday). None made it into `/public`. A hero-loop boomerang would have to be assembled from still photography (e.g. fb-img-04 with a ken-burns-style ffmpeg loop), but the instruction said this was optional and the hero still works on its own.

## Reference

- `scraped-media/` — all 38 originals as downloaded (`fb-img-NN.jpg`, `fb-video-NN.mp4`, `google-review-img.jpg`).
- `scraped-media/named/` — same images copied with semantic filenames.
- `scraped-media/thumbs/`, `tiny/`, `micro/`, `grids/` — inspection thumbnails generated during curation.
- `scripts/make-thumbs.mjs`, `scripts/make-grid.mjs` — helpers used to build the inspection sheets; safe to delete once the build is locked.
