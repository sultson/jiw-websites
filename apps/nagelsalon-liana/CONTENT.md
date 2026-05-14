# Nagelsalon Liana — Content notes

## Instagram scrape (2026-05-13)

### Handles checked

- `lianastudio1` — **primary, active**. 60 posts scraped (all videos/reels; the studio rebranded from `nagelsalonliana1` to `lianastudio1` / Studio Liana around early 2026 with a Grand Opening at Emmen on 17 May).
- `nagelsalonliana1` — **does not exist** (returned `not_found` from Instagram). The handle is referenced only in older caption text (likely renamed to `lianastudio1`).

### Notes on media

The account posts **only Reels** (no still photo posts). The URLs below are the `displayUrl` cover images of each reel — they are static .jpg thumbnails of the work and can be used directly in a gallery `<img>`. Instagram CDN URLs are time-limited (signed `oe=` query param) — for production use, download and rehost in the app's `public/` folder. Run a one-shot script that pipes these URLs through `curl` into `apps/nagelsalon-liana/public/gallery/` and optimize with the existing `optimize-images` pattern.

### Top 20 gallery photo URLs (ranked by likes)

1. [DT8YcC-DYCb](https://www.instagram.com/p/DT8YcC-DYCb/) — 1006 likes
   https://scontent-iad3-2.cdninstagram.com/v/t51.71878-15/622258032_827554640246165_4460391972941668986_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-iad3-2.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2gEP2M0vB1BUq6GCX-nUHx-8Vf_G4p8tZ_cH0IIjvzNKqbqvTo7i_R9wOWFgccMqTLA&_nc_ohc=3hqCe9waflgQ7kNvwFrmxIK&_nc_gid=vrGMyPPHW7aMu7G8_oj-qw&edm=APU89FABAAAA&ccb=7-5&oh=00_Af4DnZUaZvwC46BU6Cjz28DeVysB5sraXzaJxLm70XefeQ&oe=6A0AB4A5&_nc_sid=bc0c2c

2. [DVyLPyiDRfk](https://www.instagram.com/p/DVyLPyiDRfk/) — 233 likes
   https://scontent-iad3-1.cdninstagram.com/v/t51.71878-15/651049475_908250265388908_7994634240477096219_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=104&_nc_oc=Q6cZ2gHx17DFejKeAqbuB8-mt8ieiNt6ZRm5Tl-BF-CgmCAW1Y5dLWp_a4_s9dJTDZT4x-c&_nc_ohc=uzUVRatV4YAQ7kNvwHJNVBq&_nc_gid=iDV8NmvPw-8ncrDBoOkLkw&edm=APU89FABAAAA&ccb=7-5&oh=00_Af5akAfsNPAS3-hl8llG5kVeGjd3zRUpm60BQj8H6gaNgw&oe=6A0ABDE2&_nc_sid=bc0c2c

3. [Ckbl9RqAemx](https://www.instagram.com/p/Ckbl9RqAemx/) — 163 likes
   https://scontent-iad6-1.cdninstagram.com/v/t51.71878-15/498544666_1368383990955018_5743265438487989956_n.jpg?stp=dst-jpg_e15_fr_p1080x1080_tt6&_nc_ht=scontent-iad6-1.cdninstagram.com&_nc_cat=106&_nc_oc=Q6cZ2gEP2M0vB1BUq6GCX-nUHx-8Vf_G4p8tZ_cH0IIjvzNKqbqvTo7i_R9wOWFgccMqTLA&_nc_ohc=bgEA6xFqVpAQ7kNvwH4KTMK&_nc_gid=vrGMyPPHW7aMu7G8_oj-qw&edm=APU89FABAAAA&ccb=7-5&oh=00_Af4_OD_i1j-W6_rHEgmffa45hFTKzfyapLJKMPn9jkk-Mw&oe=6A0AB00C&_nc_sid=bc0c2c

4. [DTa8gEsDI_U](https://www.instagram.com/p/DTa8gEsDI_U/) — 145 likes
   https://scontent-sjc6-1.cdninstagram.com/v/t51.71878-15/613753930_1615356826550930_5596299220361381357_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-sjc6-1.cdninstagram.com&_nc_cat=102&_nc_oc=Q6cZ2gGnmsOuoy4X6wbZfIfACm_7Lxzz_iB43vMxIYuwvgzlW-KWa96s1aaiG381zw59zCw&_nc_ohc=PDGTyn0FWxkQ7kNvwGhQox0&_nc_gid=FCWeqPjV9R5SgooxdAbl9Q&edm=APU89FABAAAA&ccb=7-5&oh=00_Af6XR8eR7o6Tq9hF5mqlt4G6zrYbg_CN2iNYgz1uiP1dRg&oe=6A0AAC1C&_nc_sid=bc0c2c

5. [DUaTjoVjD7q](https://www.instagram.com/p/DUaTjoVjD7q/) — 129 likes
   https://instagram.fosu3-1.fna.fbcdn.net/v/t51.71878-15/626191039_33719553087660522_871989394636419742_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fosu3-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2gFjCJ25WOiEuAUFk7WnWUyHJa6FJyAdiuAb_392DNHcGRowfbg3RLrkZwHE6LSc9tU&_nc_ohc=zLMnOzOC2BAQ7kNvwGI8gWV&_nc_gid=pqrKrsB7Jz3yyNDnE4h_ng&edm=APU89FABAAAA&ccb=7-5&oh=00_Af6DqF5v0xXRL8h5OOzGBLQg4A6g27J2653Q2Q3SYcJMZw&oe=6A0A9546&_nc_sid=bc0c2c

6. [DTIXH2ojNbb](https://www.instagram.com/p/DTIXH2ojNbb/) — 82 likes
   https://scontent-sjc3-1.cdninstagram.com/v/t51.71878-15/610120570_1942061939712870_4335773440296272249_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=106&_nc_oc=Q6cZ2gGnmsOuoy4X6wbZfIfACm_7Lxzz_iB43vMxIYuwvgzlW-KWa96s1aaiG381zw59zCw&_nc_ohc=fevciszFTbEQ7kNvwFLfCSC&_nc_gid=FCWeqPjV9R5SgooxdAbl9Q&edm=APU89FABAAAA&ccb=7-5&oh=00_Af62tak5IBWF7qM6g0nY8r4DARelhnVFXpM5-CvT3kGkSQ&oe=6A0A9C58&_nc_sid=bc0c2c

7. [DUWZU6GjX6Q](https://www.instagram.com/p/DUWZU6GjX6Q/) — 65 likes
   https://instagram.fosu3-1.fna.fbcdn.net/v/t51.71878-15/629318839_895957783065010_7706846990820323454_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fosu3-1.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2gFjCJ25WOiEuAUFk7WnWUyHJa6FJyAdiuAb_392DNHcGRowfbg3RLrkZwHE6LSc9tU&_nc_ohc=OVtw_MuSaS8Q7kNvwFH1ug7&_nc_gid=pqrKrsB7Jz3yyNDnE4h_ng&edm=APU89FABAAAA&ccb=7-5&oh=00_Af7gYcogjlEXKrPc-xdc2LZjYIGUOtNi6USpylyjBk3RLw&oe=6A0AAF8F&_nc_sid=bc0c2c

8. [DWrr8o3DevT](https://www.instagram.com/p/DWrr8o3DevT/) — 60 likes
   https://scontent-iad3-1.cdninstagram.com/v/t51.71878-15/658922678_1684761366210046_5047639588661949581_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gEP2M0vB1BUq6GCX-nUHx-8Vf_G4p8tZ_cH0IIjvzNKqbqvTo7i_R9wOWFgccMqTLA&_nc_ohc=0HaNQnamUxQQ7kNvwHVQMAK&_nc_gid=vrGMyPPHW7aMu7G8_oj-qw&edm=APU89FABAAAA&ccb=7-5&oh=00_Af4Loa0zBTbFmQS9b2ZF-MospR9uX5mERxyI7N29fOc-mQ&oe=6A0A96CD&_nc_sid=bc0c2c

9. [DX8sLRjtGIM](https://www.instagram.com/p/DX8sLRjtGIM/) — 40 likes — Grand Opening reel
   https://scontent-iad3-2.cdninstagram.com/v/t51.71878-15/684927257_832661776550417_8802654251564841292_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-iad3-2.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2gEP2M0vB1BUq6GCX-nUHx-8Vf_G4p8tZ_cH0IIjvzNKqbqvTo7i_R9wOWFgccMqTLA&_nc_ohc=jXRe2ybnkUUQ7kNvwHPaLaR&_nc_gid=vrGMyPPHW7aMu7G8_oj-qw&edm=APU89FABAAAA&ccb=7-5&oh=00_Af5wJtEZeBu4xxZX9qhH0EPIu4oy5uPLtlucT6iDPCAXzg&oe=6A0A9FBF&_nc_sid=bc0c2c

10. [DTnXWy8De0f](https://www.instagram.com/p/DTnXWy8De0f/) — 38 likes
    https://scontent-ord5-2.cdninstagram.com/v/t51.71878-15/618437854_1592011205274251_6798399745337925824_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-ord5-2.cdninstagram.com&_nc_cat=111&_nc_oc=Q6cZ2gF3Uq3WS3MdDKl4ddW-LxfHBHL7hYaWkXCpROdVYqiS3bmzeq7xX89ZpGOY3zyGMn0&_nc_ohc=pw7hPLD3JF0Q7kNvwHXkslc&_nc_gid=2gb4VQeAhDYxpudsBIy2pA&edm=APU89FABAAAA&ccb=7-5&oh=00_Af6JuzFy95148Y_HgRLVGVRPWwynutWRQOYYGwrLbinhyA&oe=6A0ACB9C&_nc_sid=bc0c2c

11. [DUPGTXkiuEF](https://www.instagram.com/p/DUPGTXkiuEF/) — 37 likes
    https://instagram.fosu3-1.fna.fbcdn.net/v/t51.71878-15/626687479_1419762673093233_663212284499732481_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fosu3-1.fna.fbcdn.net&_nc_cat=109&_nc_oc=Q6cZ2gFjCJ25WOiEuAUFk7WnWUyHJa6FJyAdiuAb_392DNHcGRowfbg3RLrkZwHE6LSc9tU&_nc_ohc=rHBkQxD3oHsQ7kNvwFcgozQ&_nc_gid=pqrKrsB7Jz3yyNDnE4h_ng&edm=APU89FABAAAA&ccb=7-5&oh=00_Af6NR0pQxBi5d5fUKIMMAXAuIGfE41LrNvqE6ALXxWZk1g&oe=6A0AA896&_nc_sid=bc0c2c

12. [DTbrmc_Cpcl](https://www.instagram.com/p/DTbrmc_Cpcl/) — 36 likes
    https://scontent-sjc6-1.cdninstagram.com/v/t51.71878-15/611757213_1072627651656464_5469200105866067184_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-sjc6-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2gGnmsOuoy4X6wbZfIfACm_7Lxzz_iB43vMxIYuwvgzlW-KWa96s1aaiG381zw59zCw&_nc_ohc=jOA7COmw6TAQ7kNvwHthE-5&_nc_gid=FCWeqPjV9R5SgooxdAbl9Q&edm=APU89FABAAAA&ccb=7-5&oh=00_Af7O_-gPQu1fyLUqx-T-tTwQVOgdNzrJbQBnkhMyKrmYpw&oe=6A0AA725&_nc_sid=bc0c2c

13. [DWWik7MDblm](https://www.instagram.com/p/DWWik7MDblm/) — 30 likes
    https://scontent-iad3-1.cdninstagram.com/v/t51.71878-15/656999661_1476551043813478_2533798052807570464_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2gHx17DFejKeAqbuB8-mt8ieiNt6ZRm5Tl-BF-CgmCAW1Y5dLWp_a4_s9dJTDZT4x-c&_nc_ohc=GbADY8PHJX4Q7kNvwF7wuqo&_nc_gid=iDV8NmvPw-8ncrDBoOkLkw&edm=APU89FABAAAA&ccb=7-5&oh=00_Af72_jLyOrDe5nfsxGL4a44mvwmcTU6O0Mbm9UCbceDjuw&oe=6A0ABDF1&_nc_sid=bc0c2c

14. [DV_b9tBDTQr](https://www.instagram.com/p/DV_b9tBDTQr/) — 29 likes
    https://scontent-iad6-1.cdninstagram.com/v/t51.71878-15/654021431_2045652803011602_5119342811482508520_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-iad6-1.cdninstagram.com&_nc_cat=106&_nc_oc=Q6cZ2gHx17DFejKeAqbuB8-mt8ieiNt6ZRm5Tl-BF-CgmCAW1Y5dLWp_a4_s9dJTDZT4x-c&_nc_ohc=KKeI14QxVFAQ7kNvwEf6wCu&_nc_gid=iDV8NmvPw-8ncrDBoOkLkw&edm=APU89FABAAAA&ccb=7-5&oh=00_Af7vtU3_7QQ5NNby5NJ9zJxVpNKPb4hvan6Xhn0LVMHE_g&oe=6A0AA7ED&_nc_sid=bc0c2c

15. [DUWKPMoDaQ7](https://www.instagram.com/p/DUWKPMoDaQ7/) — 29 likes
    https://instagram.fosu3-1.fna.fbcdn.net/v/t51.71878-15/628409619_2330126007489412_8803915670816351885_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fosu3-1.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2gFjCJ25WOiEuAUFk7WnWUyHJa6FJyAdiuAb_392DNHcGRowfbg3RLrkZwHE6LSc9tU&_nc_ohc=N3Leq5m5stwQ7kNvwHJQDTH&_nc_gid=pqrKrsB7Jz3yyNDnE4h_ng&edm=APU89FABAAAA&ccb=7-5&oh=00_Af7STkLyD2d3MI1rKRwBrkRQ_5UYqTRSFkVyL4deamfwVQ&oe=6A0A9EBE&_nc_sid=bc0c2c

16. [DTIslcIDVaL](https://www.instagram.com/p/DTIslcIDVaL/) — 29 likes
    https://scontent-sjc3-1.cdninstagram.com/v/t51.82787-15/611665002_18036634931742771_3977371537925619648_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=103&_nc_oc=Q6cZ2gGnmsOuoy4X6wbZfIfACm_7Lxzz_iB43vMxIYuwvgzlW-KWa96s1aaiG381zw59zCw&_nc_ohc=t0C8WihKRLsQ7kNvwFx3i8a&_nc_gid=FCWeqPjV9R5SgooxdAbl9Q&edm=APU89FABAAAA&ccb=7-5&oh=00_Af69PgJNyrKszMcuEKHguaE3HAqIo-mtx9VkLNt0YKMUwg&oe=6A0A9956&_nc_sid=bc0c2c

17. [DWXEzYWjSu0](https://www.instagram.com/p/DWXEzYWjSu0/) — 26 likes
    https://scontent-iad3-1.cdninstagram.com/v/t51.71878-15/659058577_1610449200219848_250847947659352684_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-iad3-1.cdninstagram.com&_nc_cat=108&_nc_oc=Q6cZ2gHx17DFejKeAqbuB8-mt8ieiNt6ZRm5Tl-BF-CgmCAW1Y5dLWp_a4_s9dJTDZT4x-c&_nc_ohc=YXguwOq0t5QQ7kNvwF_BbP_&_nc_gid=iDV8NmvPw-8ncrDBoOkLkw&edm=APU89FABAAAA&ccb=7-5&oh=00_Af6at5oegCOz2Q531rAqXjrPNm3iq08Wa0jNrHSVere-Ug&oe=6A0AA873&_nc_sid=bc0c2c

18. [DThgmfwDdU4](https://www.instagram.com/p/DThgmfwDdU4/) — 25 likes
    https://scontent-ord5-3.cdninstagram.com/v/t51.71878-15/607419865_1369495254437385_5128361528133496104_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-ord5-3.cdninstagram.com&_nc_cat=109&_nc_oc=Q6cZ2gF3Uq3WS3MdDKl4ddW-LxfHBHL7hYaWkXCpROdVYqiS3bmzeq7xX89ZpGOY3zyGMn0&_nc_ohc=aFVcAHcxyx0Q7kNvwF3TLJr&_nc_gid=2gb4VQeAhDYxpudsBIy2pA&edm=APU89FABAAAA&ccb=7-5&oh=00_Af4hQ2LncU-n8uoMBJUwDaBWjqoDFVnTbo7jzU9fQrLesg&oe=6A0ABFAF&_nc_sid=bc0c2c

19. [DVrKkyHDUAj](https://www.instagram.com/p/DVrKkyHDUAj/) — 24 likes — Russian manicure
    https://instagram.fosu3-1.fna.fbcdn.net/v/t51.71878-15/648610712_1561749411789900_3968113291612053451_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fosu3-1.fna.fbcdn.net&_nc_cat=100&_nc_oc=Q6cZ2gFjCJ25WOiEuAUFk7WnWUyHJa6FJyAdiuAb_392DNHcGRowfbg3RLrkZwHE6LSc9tU&_nc_ohc=lkFyXfmvV6AQ7kNvwGb4fco&_nc_gid=pqrKrsB7Jz3yyNDnE4h_ng&edm=APU89FABAAAA&ccb=7-5&oh=00_Af6uCCHlvRpz7L8t3ao-ExfdmHWHPn8gRqGExuoC0A4Tkg&oe=6A0AC6E7&_nc_sid=bc0c2c

20. [DTCDQwfEboJ](https://www.instagram.com/p/DTCDQwfEboJ/) — 24 likes — "1000 volgers" milestone
    https://scontent-sjc6-1.cdninstagram.com/v/t15.5256-10/609383767_904965671869847_2067413946973324887_n.jpg?stp=dst-jpg_e15_fr_p1080x1080_tt6&_nc_ht=scontent-sjc6-1.cdninstagram.com&_nc_cat=111&_nc_oc=Q6cZ2gGnmsOuoy4X6wbZfIfACm_7Lxzz_iB43vMxIYuwvgzlW-KWa96s1aaiG381zw59zCw&_nc_ohc=MhZVEywGIeUQ7kNvwGDTkZ7&_nc_gid=FCWeqPjV9R5SgooxdAbl9Q&edm=APU89FAAAAAA&ccb=7-5&oh=00_Af7Dt0tdQysxJT5XBFFMYfWp1qg9vkCwINkE_L3fB0nklQ&oe=6A0ABE6C&_nc_sid=bc0c2c

### Best Dutch caption snippets (for About / copy inspiration)

These are the authentic quotes pulled from `lianastudio1` posts that are Dutch (not Russian/Armenian). They show Liana's voice: care-focused, professional, and protective of nail health.

1. **Grand Opening (Mei 2026, post DX8sLRjtGIM)** — establishes location and brand pivot to Studio Liana:
   > "After so much hard work it is finally time. Studio Liana is opening. Emmen. 17 mei, 14:00."
   (Originally English with hashtags #StudioLiana #GrandOpening #Emmen #NailStudio #BeautyStudio.)

2. **Over nagelconstructie en correctie (post DT3bQJODclC)** — Liana's professional philosophy:
   > "Na 3 a 4 weken verandert de nagelconstructie altijd. Dat gebeurt altijd en dat is normaal. Mijn taak als styliste is niet om te laten wat er is, maar om bij elke correctie de nagelconstructie weer mooi te maken. Terug naar de juiste vorm. Terug naar de juiste constructie. Terug naar hoe de nagelvormen hoort te zijn."

3. **Over zorgvuldigheid (post DWWzM36DYh8)** — speaks to her standards:
   > "Wees zorgvuldig met je werk en de materialen waarmee je werkt. Een nagelstyliste heeft de nagels van deze lieve vrouw beschadigd. Nu wil ik proberen alle nagels op mijn eigen manier te genezen."

4. **Klant uit Amsterdam met schimmel (post DThjM3IDVxJ)** — toont expertise en zorg:
   > "Een aardige vrouw uit Amsterdam bezocht mijn studio en vroeg me om haar gellak te verwijderen, die door een andere specialist was aangebracht. Toen zag ik een schimmel onder haar nagel. Ik heb de beschadigde nagel verwijderd en een behandeling voorgeschreven."

5. **Mijlpaal 1000 volgers (post DTCDQwfEboJ)** — community-gevoel:
   > "Nagelstudio Liana: meer dan 1000 volgers op Instagram. Thanks voor iedereen."

6. **NAIL cursussen (post DSrl6iXDYTP)** — extra service / opleiding:
   > "NAIL cursussen bij mij inclusief certificaat."

### Themes to use in site copy

- **Locatie:** Emmen (recent verhuisd / nieuwe studio per 17 mei 2026 onder de naam Studio Liana)
- **Specialiteit:** Russian manicure, nagelreconstructie, correctie van beschadigde nagels door andere salons, likdoorn verwijdering
- **Extra:** NAIL cursussen met certificaat
- **Toon:** zorgvuldig, professioneel, herstelt waar anderen tekortschieten — voice is warm en eerlijk

---

## Google Maps scrape (2026-05-13)

Scraped via Apify `compass/crawler-google-places`.
Source: https://www.google.com/maps/place/Nagelsalon+Liana/@52.786655,6.9346351
Full structured data: `scrape-gmaps.json` (business info, 129 reviews, 50 photo URLs).

### Business Info

- **Name:** Nagelsalon Liana
- **Address:** Laan van de Marel 508, 7823 CM Emmen, Nederland
- **Phone:** +31 6 85100120
- **Website:** none listed on Google Maps
- **Categories:** Nagelstudio, Schoonheidsspecialist
- **Place ID:** ChIJHaNgP-vpt0cRE0AhwshnjCk
- **CID:** 2993881964242616339
- **Coordinates:** 52.786655, 6.9346351
- **Plus code:** QWPM+MV Emmen
- **Rating:** 5.0 / 5 over 129 reviews
- **Distribution:** 127x 5*, 1x 4*, 1x 3*, 0x 2*, 0x 1*

### Hours

- Maandag: 09:00 - 18:00
- Dinsdag: 09:00 - 18:00
- Woensdag: 09:00 - 18:00
- Donderdag: 09:00 - 18:00
- Vrijdag: 09:00 - 18:00
- Zaterdag: Gesloten
- Zondag: Gesloten

### Top Reviews (10 best for testimonials)

#### Melanie Ernst, 5 sterren (NL, 2024-07-14)
Ik ben onlangs naar nagelsalon Liana geweest en ik moet zeggen dat het een geweldige ervaring was. Vanaf het moment dat ik binnenkwam, voelde ik me direct welkom en ontspannen. De salon zelf is prachtig ingericht en heeft een rustige en ontspannen sfeer. Liana, de nagelstyliste, is uiterst vriendelijk en behulpzaam. Ze nam de tijd om naar mijn wensen te luisteren en gaf me deskundig advies. De kwaliteit van de behandeling was uitstekend. Mijn nagels waren na afloop perfect. Al met al kan ik nagelsalon Liana ten zeerste aanbevelen.

#### Thonia Weijens, 5 sterren (NL, 2026-04-16)
Liana is heel professioneel maar ook een heel lief persoon. Voor prachtige gelnagels moet je naar Liana. Ze heeft 17 jaar ervaring en dat merk je. Update april 2026: Liana is haar 5 sterren dubbel en dwars waard. Liana is een topper.

#### Eline Boers, 5 sterren (NL, 2025-07-28)
Ik kom inmiddels al een tijdje bij Liana en ik kan met volle overtuiging zeggen: zij is de beste nagelstyliste die ik ooit heb gehad. Liana is ontzettend vriendelijk, professioneel en neemt echt de tijd voor je. Ze werkt hygienisch, denkt mee over kleurkeuze en designs, en levert altijd superstrakke resultaten. Mijn nagels blijven wekenlang mooi en sterk.

#### Danielle Groot, 5 sterren (NL, 2025-11-03)
Ik ben iedere keer zeer tevreden over mijn ervaring bij Nagelsalon Liana. Zowel mijn manicure- als pedicure behandelingen zijn altijd tot in de puntjes verzorgd. Liana werkt heel professioneel en beschikt over veel kennis. Ze geeft deskundig advies en mijn handen en voeten zien er na afloop altijd perfect uit. De salon zelf is schoon, sfeervol en Liana is altijd gastvrij.

#### Susanna Baghramyan, 5 sterren (NL, 2025-11-15)
Ik kwam bij de salon terecht met nagels die helemaal verpest waren door een andere salon. Maar Liana heeft mijn nagels echt gered. Met zoveel geduld, zorg en professionele kennis heeft ze mijn nagels weer tot leven gebracht. Dankzij Liana zien mijn nagels er nu weer gezond, sterk en prachtig uit.

#### Sevo, 5 sterren (NL, 2025-11-29)
Ik had al een tijd last van een schimmelnagel en ben hier ontzettend goed geholpen. Vanaf het eerste moment merkte ik dat ze precies wist wat er moest gebeuren. Ze legt alles duidelijk uit en geeft goede adviezen. Dankzij haar professionele aanpak heb ik nergens meer last van gehad en is mijn nagel volledig hersteld.

#### Daphne Sarton, 5 sterren (NL, 2025-02-06)
Liana's nagelsalon heeft mijn verwachtingen echt overtroffen. Na een slechte ervaring bij mijn vorige nagelstylist was ik wanhopig. Ondanks haar drukke agenda heeft Liana dezelfde dag nog een plekje voor me gemaakt. Mijn nagels zijn nu super netjes en zien er fantastisch uit.

#### Denise Gruteke, 5 sterren (NL, 2025-11-10)
Vandaag voor het eerst geweest bij Nagelsalon Liana voor gellak in een prachtige klassieke rode kleur. Liana werkt heel professioneel en snel, maar tegelijk met veel aandacht en precisie. Het resultaat is echt supermooi. Strak, glanzend en precies zoals ik het wilde. Ik heb meteen een nieuwe afspraak ingepland.

#### Yelena Baghdasaryan, 5 sterren (NL, 2024-08-04)
Uitstekende pedicure ervaring bij Nagelsalon Liana. Vanaf het moment dat ik binnenkwam, voelde ik me welkom. De salon is schoon, modern en straalt een kalmerende sfeer uit. De scrub en massage waren geweldig. De gebruikte producten waren van hoge kwaliteit en de nagellak werd nauwkeurig en professioneel aangebracht. Ik beveel deze salon ten zeerste aan.

#### Karla Burgos, 5 stars (EN, 2024-07-18)
So so satisfied with everything. My nails and my pedicure are amazing, done with perfection and you can see Liana really loves what she is doing. The service is A+. Liana really treats people with love and respect. Her English is good, she understood my needs. I will definitely keep going to her for my nails and pedicure.

### Photo URLs (top 50, w1920-h1080)

https://lh3.googleusercontent.com/p/AF1QipMfZJ4BZgw5AGuvokSroizI9ow5VHwDJuVPyhke=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipNOfc_D7SE51BA1sxXZDBUkSbySjf1FmZ0kizfP=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipMHO9MNiiUlDhTBUIOek_caul_bHLlrrmQlPULz=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAF15MpGmMqi88l-mcTvpMmC9UlKzgPA_tgO5U4oj5A2mgnubxk1o5jznriSLEI8Kwc-7GpG2MG9GSgVUdR8Zx26JLk87V-amT5wtPjWZIH6LfBsA03hpTEkDcS5_TmkhliX84ZMuffCxC7_=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipPMC_FrGtFq43h9AJDx0FlSZawcQI0pBCV2Xy3F=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAFCzc1-NsndsuKZdchV1RXr3T3HG5gwXN0WHL1whCXCgKmIasjbpgp3dMwa5Yub02kXlObUuYDP7aCZEmurVKmEZ6hQhFl0DLIEsfUkfqO0KWNDfpu6lNxfwnxEJ7JDILH1wbk=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAHtoTzDxmFtF1lwlSi7Bz7241_yg-s2PYJ0ZIIFgQIV574B2cI_uCBRCo00PlTDu4Ygtjm1xVAo8SPxxTdDJLKFydcqgkYGkt6Ye0uh8goTWfZmbGGWYLpIgy_0ZTs9k1D9Bf2p=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipOUTr-6po62AKvlGFulNsVCKt3Yazn3ZaFPumpR=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAGiUMcd0b0oX6EJCi_GOO69qO7OaGfSgUIwutTym1tiMb1roEfkrSaZELRS1cjxMIzNAA5ihJlM9xSfVq0Qsj6IqhVoKtXu4xhLdGwBjt8ySYCHXXMMBiJkAtvsOeW4PcwIxiC0=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipOcruwxVSfYcQ_9X_ns0ctmikMdMFAQwgLsBczu=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipMboKZ3qTdofon8ICjx1vlI-_BZ07ucJVdICjYj=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipNqa5Di4iBb_IdYwrru3-h9rcGvmfvfay7R9qsg=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipNFWfVgkHaWur26IuXJsVKDB1DPENn5Geh_W6Gp=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipMOTwQ39jaN9-pa16Mom-zhxtNNZJCZzd4U2uzM=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipOxkqQKZcpoM6mUYpADz5erH1gbY-3ijDYZyHMx=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipMBx8UaImAyK3oAYvU3lCVPyu3x0qLEj1MJwrvD=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipOUAFWNkTLNNOmACtW6YShTruEMWaKzeFMb9kYa=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAFrgx7LqoYIhFEvwStqvBy3LuJTWRKTVR8ucmAUVS2MfmyatRxmNG0HmLtVswTLWrG1-fp7hZtXdImxIcQxUubd2hNglkuHD9H0iqAS175-d2gxWE45Jd_uInRufaC0lPj6_ZtDAQ=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipP6fCiqU7pV8x80py8-W1W_t5_C5RQEX7W19buH=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAFUNAglEmLWN0vxKXX6SFl5JS9RZRjT2hwmFXlTVw_yGeMIAFbr53PGfmNfhjeqF3OvOXmHkoFJrfDPvPz36L1FNUX7Fs8EF47rSkDuQlynXwwbA1dLs2hZxz6CmU7J8QvBeGRT=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipM8LjOpXDkDgQgGQLGNusFBrLBWGgETil2Qcx6_=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipNGsQqV7Z2CPwlEQxWhTF21HnaQkO5_5FX1VcZU=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipOdYX-9FKoJPg_y_1OUxyfApgA7-BnMez1DX-qm=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipPd_7CyG385IfCpkDg0D2RA0gGjOP9pgaoSav7T=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAElCUQcNl56Zpwc2PrOc1XosXiFBivXIk56y0LKouvihA5JbFPHa0Y-FcYqSRdTBMsdVj1Gv_iqc1rdo6ThJdNKsMJpflzAiNgmw4h843RLXrnqzG_9OmneMnL36nCqk1vvE-E=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAE-R-qLrksrRQoK0AOBQ2StDyvdvXb6Q8JKODzpsOZUulUrPlISnQznEV_iHVg8GxFp1fXU6R8Eu1QJazYre2hMJNFXdlUFi2l21i0tafZWTsEgIAa8AegZ_qHsQ6pVU1fA6tA=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAFwE3s0YF0FhFs8QHbi0elJqhEAhgX-GeC_9wmGRB7p3YibD_sCH1Q8Gqa5Qb6MPXiJ0Y5-rXr8HN_FXuDthXMUn6n-ILmNbmIr4tkCaIAugUbw_HcaQpL7SaMEznDMdjMFF_o=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAEDf0c0ftLWOPFXJW3u1BMj-9dtks_vTMp_oTdY5ZhKSBk1mRSOoxb92-7OVkkflRx8oz7OxSCATWq9uJp0NjYIRQ1Y230mYWlqQ2slPyy2F9PwdQX6AvotwT6zipl28qD7YVSQ=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipOmYcJCYDQ1Cadg0PxEkT6U1AebCAUKwsVHUqZ7=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipO4Si50JaX7-9-m-FWB_vQXxMB-vv6VqfDjt35D=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAFexLdONCGU7RguPcSNzZdUXeKb2tpkOirhV5OFg3p4YtxDA9gHw6jknGVQyO0BgV2spS9aHTKmW0A1xmuJOWuc5YIHmSC9UPA89tACej9nKXdjRaNvzYErjpbSp9UYbZj23Q3Y=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAFOW2RU1Gda4egHfami5o115q_hRCHZZk7qX5SlD4dHo69zREc3U6LKA32wTXPHF2QLbrthPwLZac6ll3jRJ5Hpth9yNnLNQ0Q4R80g1KFFs60_D8a2OnVgLEbVEmEQdBOHG9c=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipMknCB9vdAdIFf6diYpgFQewdLYmpiOlFJhjcGA=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAHpXg1P2a4dhclXTc_Ei5p-0Mfq7_SAUEaYBFz8RyB484v1S_SNHff87uvtReRzlNO20k6FeUkOfF0FGvLkbIt3bmjffcKjpkgvu8M6wmaO3cXfKwNZjMB8N-7oaHLnidA7q7-uVQ=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAGOhSI-7hWsyw8-qr-0o97HCh047ZzA3jzA6vnhslArZRl6eap86dgu0drJn0j821vATtLYBkwrjNo-E-QzYPIVKlZXMQ6eju8CCpS8O6yXKrKlzfQMNki0IFKBDtfMYpWShXpJ=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipOslmUuQMqXJ6UVTSl0-WsH0T_lu3gGOVGjWbow=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipN0KbaiNwRZraiwCKCKaTIVdArCV239-Zhp4aAM=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipO9ZqJDEW3gxRFEI24PGCLl0o9rrpFS6Ww8aZEf=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAEVwU6C1CZLbOo7Igz0zlsfC65lOIE4edEYfG5ud4kqD0E36Rt_XcdnY4H2hgoTeed8yYqERnblHu9HfRkyjv0ljKXAtu7KFHFkmPqxbeR9NYyYRtyMWnnPcbuYxqEHZgCl8XFJ_w=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipO5Go97A9BYsp-Yunv3qoGFzpzFD-qHLAuYJv34=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipM92uJiHZ8wSnYQaaC5gAJRNzMV98i3TswNT0vk=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAElQXqGYdvQfHk-QDi04u2T0MKHC1TBqmhCPxlJlbbdFrIS8wBtg8JriAFCeuzzDVDa3Nkg3P2rr5B1JYhFODJzZf5uX51N-IcioYIFZueaazMN1nJtiwUViJArtYP2ussWazIJwg=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipPmjd5JnxCMQmdMlqmKnK_T-JVqm4gjs5bR2Sby=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipPDHgyjjNKn7Aaj1OPCvA6qCHrLdYRsgdxtuNJQ=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAG1JhORtWv5tbaO7est4KhIOcAoZgz44K1SbAjVIBXgsr9HNv99X3fIna4JjR8qUc2rJFpLdUkxLW2NRO1RjWmFqot6mucpMI0GsMl_3R6hBfvP7aE-O-Hn82Zp3Vd8MgqZGAUocQ=w1920-h1080-k-no
https://lh3.googleusercontent.com/p/AF1QipP8KAGXp8oSMo0IkcrUhLtWQ-rsdbXJzOqQOgko=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAHiyt6Ix5NsfTw1JNcJqXFoeH3sPVSnhHFafMgkOEyTpT4ktpY1Z8YdWl1RyK0Ys41szYAjZfDcs86PjtYraepZpgt-ty8pFp_ZNiYEpzgKm572op7WX7DOm6c_0iJ976r7r2EZ=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAG5zjRvPVh4J7SCbiDAAAxfUcDcLVKV_zt5_cxl3fM1rPIK45oieZPRKMgFBYNo2pQEC80-t8Ms0kiAsZqbJDyKkxJueMxa8GhFkyHXipxOfDbTMQslD_ViL2a2YZWprXkcrLU=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAFim7mgmPrkeSd-7rXrBiSOQ0ZOYipcQvYOkTXCoRMPenG-JN1KQVZR7KsgHEwTWMuTyorgpO1dlrMAojqhHmbNmwblTm2l3P7bI6OFd_1zTj0w-aZf2Mlv7jllNoU-6qxeCA8uRw=w1920-h1080-k-no
https://lh3.googleusercontent.com/gps-cs-s/APNQkAHsOI7VCIKdJDUtPMiu648QBwB4h24Oe5D3d3cyMNoOnPbg_i6h1KDO3X7Oldo-tt4zIuWMJeWEhWZdZ2xzshncJoXPERuN-UlKkoeNCSvv2CgAyDiOg7NIqd29PvDv7Ny5erc=w1920-h1080-k-no
