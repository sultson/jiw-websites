import { defineField, defineType } from "sanity";
/** The approved layout stays fixed; every text, link and image is editable. */
export const sitePage = defineType({
  name: "sitePage",
  title: "Pagina of terugkerend onderdeel",
  type: "document",
  groups: [
    { name: "text", title: "Teksten", default: true },
    { name: "images", title: "Beelden" },
    { name: "links", title: "Links" },
    { name: "seo", title: "Vindbaarheid" },
  ],
  fields: [
    defineField({
      name: "path",
      title: "Adres of gedeeld onderdeel",
      type: "string",
      readOnly: true,
      group: "seo",
    }),
    defineField({
      name: "title",
      title: "Paginatitel",
      type: "string",
      group: "seo",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Omschrijving voor zoekmachines",
      type: "text",
      rows: 3,
      group: "seo",
    }),
    defineField({
      name: "texts",
      title: "Teksten in paginavolgorde",
      type: "array",
      group: "text",
      description:
        "De kop boven elk tekstvak geeft aan waar de tekst staat. De opmaak en volgorde blijven behouden. Maak een tekstvak leeg als je de tekst wilt weglaten. Gedeelde onderdelen (welkom, eerste stap, sonnet en voettekst) staan als aparte documenten in de lijst.",
      options: { sortable: false, disableActions: ["add", "addBefore", "addAfter", "remove", "duplicate"] },
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Onderdeel",
              type: "string",
              readOnly: true,
            },
            { name: "text", title: "Tekst", type: "text", rows: 4 },
          ],
          preview: { select: { title: "label", subtitle: "text" } },
        },
      ],
    }),
    defineField({
      name: "images",
      title: "Beelden op deze pagina",
      type: "array",
      group: "images",
      options: { sortable: false, disableActions: ["add", "addBefore", "addAfter", "remove", "duplicate"] },
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Onderdeel",
              type: "string",
              readOnly: true,
            },
            {
              name: "image",
              title: "Afbeelding",
              description: "Wis de afbeelding om haar op de site weg te laten. Uitsnede en aandachtspunt worden overgenomen.",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "alt",
              title: "Beschrijving voor schermlezers",
              type: "string",
            },
          ],
          preview: { select: { title: "label", media: "image" } },
        },
      ],
    }),
    defineField({
      name: 'videos', title: 'Video’s', type: 'array', group: 'images',
      description: 'Een YouTube-video laadt alleen na toestemming van de bezoeker. De poster blijft een lokale afbeelding.',
      options: {sortable:false, disableActions:['add','addBefore','addAfter','remove','duplicate']},
      of: [{type:'object', fields:[
        {name:'video', title:'YouTube-video-ID', type:'string', description:'De 11 tekens na v= in de YouTube-link.', validation:r=>r.required().regex(/^[A-Za-z0-9_-]{11}$/)},
        {name:'title',title:'Titel',type:'string'}, {name:'text',title:'Toelichting',type:'text'}
      ], preview:{select:{title:'title',subtitle:'video'}}}],
    }),
    defineField({
      name: "links",
      title: "Links en knoppen",
      type: "array",
      group: "links",
      options: { sortable: false, disableActions: ["add", "addBefore", "addAfter", "remove", "duplicate"] },
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Herkenning",
              type: "string",
              readOnly: true,
            },
            {
              name: "href",
              title: "Bestemming",
              type: "string",
              description:
                "Een intern adres begint met / of #. Extern: https://, mailto: of tel:. Telefoon, e-mail en route naar het adres volgen de gedeelde praktische gegevens.",
              validation: (r) =>
                r
                  .required()
                  .custom(
                    (v) =>
                      (typeof v === "string" &&
                        /^(\/[^/]|\/$|#|https:\/\/|mailto:|tel:)/.test(v)) ||
                      "Gebruik een veilig webadres, mailadres of intern pad.",
                  ),
            },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "path" } },
});
