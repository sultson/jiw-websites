/* Lijniconen voor de dienstkaarten: de kaart draagt een icoontegel en geen
   foto (verzoek Armando 06-10-2026, naar het voorbeeld van mhainstallaties.nl).
   De foto's zijn 07-10-2026 uit het HTML gehaald toen Carbon en Midnight eruit
   gingen; dit is dus het enige wat een dienstkaart laat zien.
   Dun lijnwerk, geen vulling, zodat ze bij elkaar horen zoals bij MHA. */
export const ICONEN = {
  'Verbouwing en renovatie':
    '<path d="M3 10.6 12 3.4l9 7.2"/><path d="M5.6 9.6V20.6h12.8V9.6"/><path d="M9.6 20.6v-5.8h4.8v5.8"/>',
  'Aanbouw en buitenwerk':
    '<path d="M2 11.2 8 6.4l6 4.8"/><path d="M3.6 10.2V20.6h10.4V10.2"/><path d="M14 14.4h6.4v6.2H14"/><path d="M2.4 20.6h19.2"/>',
  'Dakramen en dakkapellen':
    '<path d="M2.4 20.4 12 3.6l9.6 16.8"/><rect x="9.2" y="12.4" width="5.6" height="5.6" rx=".6"/><path d="M12 12.4V18"/>',
  'Keukens':
    '<path d="M2.8 12.8h18.4"/><path d="M4.6 12.8v5.4a2.4 2.4 0 0 0 2.4 2.4h10a2.4 2.4 0 0 0 2.4-2.4v-5.4"/><path d="M12 12.8V7.8a3 3 0 0 1 3-3h2.6"/><path d="M17.6 3.2v3.2"/>',
  'Timmerwerk en afwerking':
    '<rect x="2.8" y="8.6" width="18.4" height="6.8" rx="1.2" transform="rotate(-45 12 12)"/><path d="M8.2 10.4l1.8 1.8"/><path d="M11 7.6l1.8 1.8"/><path d="M13.8 4.8l1.8 1.8"/>',
  'Schilderwerk':
    '<rect x="3" y="3.8" width="12.6" height="5" rx="1.2"/><path d="M15.6 6.3h3.6c.6 0 1 .4 1 1v2.4c0 .6-.4 1-1 1H12c-.6 0-1 .4-1 1v1.3"/><rect x="8.8" y="13.4" width="4.4" height="7" rx="1.4"/>',
  'Binnen- en buitendeuren':
    '<path d="M5.4 20.8V4.2a1 1 0 0 1 1-1h11.2a1 1 0 0 1 1 1v16.6"/><path d="M3 20.8h18"/><circle cx="15.4" cy="12.4" r="1"/>',
  'Sloten en hang-en-sluitwerk':
    '<rect x="4.4" y="10.4" width="15.2" height="10" rx="1.6"/><path d="M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8"/><circle cx="12" cy="14.6" r="1.2"/><path d="M12 15.8v2"/>',
  'Klein onderhoud en reparaties':
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
};

export const tegel = (kop) => ICONEN[kop]
  ? `<span class="tegel tegel--dienst"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONEN[kop]}</svg></span>`
  : '';
