import { useEffect, useRef } from 'react';

// Keep the provider's embed unchanged. A contextual fragment executes the script
// after the widget root exists; React's ordinary HTML insertion does not.
const widgetEmbed = `<script type="text/javascript" src="https://booking.onlineafspraken.nl/build/widget/widget.js" data-api-key="cmkf34ueug55-aeaf14" data-widget-id="37ea003e-4549-4a1e-a09c-3d0efd6dd1fa" data-mode="default" defer></script>
<div id="_oa_widget_root"></div>`;

export default function Booking() {
  const widgetHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = widgetHost.current;
    // StrictMode runs effects twice in development: initialize only once.
    if (!host || host.childNodes.length) return;
    const range = document.createRange();
    range.selectNodeContents(host);
    host.appendChild(range.createContextualFragment(widgetEmbed));
  }, []);

  return (
    <section id="afspraak" aria-labelledby="booking-title" className="scroll-mt-32 py-16 md:py-24 bg-blush-soft">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <h2 id="booking-title" className="text-3xl md:text-5xl">Online afspraak maken</h2>
        <div lang="nl" className="mt-7 rounded-2xl border border-gold/20 bg-cream p-5 sm:p-7 text-base leading-relaxed">
          <p>
            <strong className="font-semibold">Online afspraken maken kan vanaf januari 2027.</strong>{' '}
            Wilt u eerder langskomen (tot en met december)? Bel ons dan even op{' '}
            <a href="tel:+31639211983" className="font-semibold text-gold underline underline-offset-4">06 39211983</a>,
            {' '}dan plannen we u persoonlijk in. Vaste klanten kunnen hieronder alvast een afspraak inplannen voor januari, februari en maart.
          </p>
        </div>
        <div ref={widgetHost} className="booking-widget mt-8 min-w-0" />
      </div>
    </section>
  );
}
