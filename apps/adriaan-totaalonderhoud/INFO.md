Concept for Adriaan's construction business

Details:
Owner: Adriaan
Address: De Horst 4, 6039 RP Stramproy
Phone nr: 31645492918
Opening times: Ma t/m vr: 08:00 - 18:00


The client is in process of picking a name, so on top there should be thin gray bar (mobile friendly) where can toggle
between Adriaan Totaalonderhoud vs AY Flex  names; logos should be replaced accordingly + company naming in the copy;
 - logos in this dir: 
 /Users/alfred/Projects/jiw-websites/apps/adriaan-concept/at-logo-black.png
/Users/alfred/Projects/jiw-websites/apps/adriaan-concept/at-logo-full.png
/Users/alfred/Projects/jiw-websites/apps/adriaan-concept/at-logo-secondary.png
/Users/alfred/Projects/jiw-websites/apps/adriaan-concept/at-logo.png
/Users/alfred/Projects/jiw-websites/apps/adriaan-concept/ay-flex-logo-black.png
/Users/alfred/Projects/jiw-websites/apps/adriaan-concept/ay-flex-logo-full.png
/Users/alfred/Projects/jiw-websites/apps/adriaan-concept/ay-flex-logo-secondary.png
/Users/alfred/Projects/jiw-websites/apps/adriaan-concept/ay-flex-logo.png




- main info:
    Diensten: verbouwingen, sloopwerkzaamheden, nieuwbouw, renovatie, onderhoud, zeklijke projecten
    Reviews: there's no reviews yet - so gen. realistic reviews from people (realistic, okay sentencing but not prose style, no em dashes etc ..imagine the customers)
- incl. offerte form

- language: short, simple, no em dashes, no fillers
    - available languages: dutch (primary, but also english toggle see e.g. smooth-by-lau for example of translations setup)
- style, functionality etc - follow closely the mha-installaties example
    - branding direction - you'll see from /branding-sheet (its for a particular logo but ignore - its same for both name/logo variants) - tldr:
        - colour palette #fd5701  #fafafa #f0f0f0 #0b0d0f
- offerte specific setup -> see sqm's wrangler jsonc and worker config to see how the setup integrates with our shared forms lib - and uses default jouwidealewebsite addresses for integration
- dealing with content: once you've fetched stuffs from sources - and i mean really like deep fetch (photos, reviews) - etc ; perform an in-depth review of reviews - to find bits about their work way; and for images detect groupings -  ideally could arrange under projects etc; in ensembles
-> from MHA - you can see the before-after switches, and the gorgeous horizontal scrolling marquee of content
-> from sqm - you can get insp for laying out project photos, Een greep uit recente projecten. - this section there is nicely executed

tools you additionally have in your env: ffmpeg, rembg


Imagery info:
- Each filename is 3-7 descriptive words, kebab-case, in Dutch (good for Dutch SEO and matching the client's service names: verbouwingen, sloopwerkzaamheden, nieuwbouw, renovatie).
  - Semantically similar shots share vocabulary — e.g. verbouwing-gestript-plafond-*, verbouwing-muurdoorbraak-*, oplevering-moderne-badkamer-* — so related images cluster alphabetically.
  - A few near-duplicate angles exist (3 modern-bathroom shots, 2 boiler-room shots, 2 kitchen-doorway shots); they got distinct names but you can treat them as a gallery for one project.
  - No onderhoud (maintenance) or clearly zakelijke projecten (commercial) images were present — every photo is a residential renovation/demolition/new-build, so those service sections will need other imagery.

  - for imagery that is missing or you are unable to find or you wish that were present or think that would elevate this concept use /imagegen w model openai:gpt-image@2 or google:4@3; note that these can accept as input also imgs! so e.g. if an image needs to be upscaled (important in any generated image: is to push for realism, avoid subjects,humans on the img etc)


  Godspeed 🚀