English is still only partially translated
The page furniture is English, but course titles, descriptions, categories, equipment categories, and request-form selections remain Dutch. For example, the English course page still begins with “Opleiding Oppervlakteredder.”

The Calendar requirement is still not implemented
The homepage still shows a generic “Train with us?” request panel. It does not contain actual upcoming events. The supplied Actueel catalogue contains historic news rather than future dates, so this needs either:
real event data from the client; or
explicit approval to replace “Calendar” with a non-calendar CTA.

Live Facebook media is not currently arriving
The Actueel UI supports image and video previews, but the live API currently returns five posts with zero populated image or video fields. Consequently, the real posts replace the fallback cards without media.
Revision 2 should correct the Apify field mapping and invalidate/version the existing cached response.

Course and equipment discovery remains shallow
Cards now have images, but:
courses expose only purpose, duration, and audience;
products expose only category and name;
the parsed original product URLs are not used;
there are no detail views, specifications, program information, prerequisites, certification, location, or availability.
A practical revision would add expandable details or detail pages without turning it into a full webshop.

Navigation is still not dropdown-heavy
The desktop navigation remains a flat five-link row. The original design direction called for category-oriented dropdown navigation, particularly for training and equipment discovery.

Important original positioning copy is still absent
The homepage still underrepresents:
professional experience in the safety domain;
Total Cost of Ownership;
the personal advisory approach;
purchase, maintenance, training and certification as one lifecycle;
the complete seven benefits—the card grid still has six, omitting low weight as its own benefit.

Target audiences are not clearly addressed
Client logos help credibility, but the homepage does not explicitly speak to municipalities, fire services, safety regions, police, Defence and Rijkswaterstaat as intended audiences.

Keyword coverage remains incomplete
“Rescue Seadoo,” “Seadoo rescue,” “Ionic,” and “Rescue Watercraft instructions” are absent. The other target terms appear only incidentally. This should be handled naturally in meaningful copy or relevant content sections, not by keyword stuffing.

shadcn is still not installed or used
The package has Astro and custom CSS/components, but no shadcn setup or component dependencies. This remains a direct miss against INFO.md.

English form handling is not fully localized
Browser labels are English, but Worker validation errors, email subjects, field labels and confirmation follow-up text are Dutch.

Actual form email delivery remains unproven
The endpoints and Turnstile integration exist, but there is still no recorded end-to-end submission proving that the configured sender successfully delivers the owner and confirmation emails.

Mobile performance still deserves a pass
The mobile homepage downloads the same 2200-pixel, roughly 604 KB hero as desktop. Fonts are loaded through an external CSS import, and several catalogue/update JPEGs are relatively heavy. Responsive image variants and locally hosted fonts would better satisfy the explicit mobile-performance requirement.

The Facebook feed remains site-specific
FACEBOOK_FEED.md proposed a reusable package comparable to @jiw/cloudflare-forms, persistent feed storage, multi-channel configuration and considered media handling. The current implementation remains inside the Resqprotec Worker using Cloudflare’s cache.


Additionally:
 - clients logos too small, barely legible - wbu marquee-like
 - actueel shouldn't contain red text "actueel" just the blog title and 5d ago/ in dutch 5d (+ago in dutch) - right after it, rn is it space-between? its v weirdly seprated

REVERT THIS CHANGE: 6) Top bar - is currently solid white - I'd have it esp. for home page  - for the hero be transparent w fade to white - so that the image breathes mroe || doesn't look that good - so back to solid white bar is ok; 


Some of the points referenced here make sense more in context of @INFO.md - that was the initial draft.
