# Winterswijk startpakket presentation

Static Cloudflare Worker on winterswijkvakantiehuis-startpakket-presentatie.doelio.nl.

Source artifacts: /Users/alfred/Projects/jiw-projects/winterswijk/output/startpakket. Copy only presentatie-startpakket.html (also as index.html), rapport-startpakket.html, wijzigingen-per-pagina.html and wijzigingen-per-pagina.md into public when updating. Internal notes and raw research are not part of this deployment.

From the monorepo, load its existing environment, then run `pnpm --filter @jiw/winterswijkvakantiehuis-startpakket-presentatie ship:dry-run` and `pnpm --filter @jiw/winterswijkvakantiehuis-startpakket-presentatie ship`.

The separate production holiday-home site is not deployed by these commands.
