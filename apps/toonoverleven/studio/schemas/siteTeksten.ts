import { defineType, defineField } from "sanity";
export const siteTeksten = defineType({
  name: "siteTeksten",
  title: "Praktische gegevens en bestuur",
  type: "document",
  fields: [
    defineField({
      name: "praktisch",
      title: "Praktische gegevens",
      type: "object",
      description:
        "Deze gegevens staan zowel op Praktisch als in het terugkerende welkomstblok.",
      fields: [
        { name: "contact", title: "Contactgegevens (overal op de site)", type: "object", fields: [{name: "email", title:"E-mailadres", type:"string"}, {name:"telefoon", title:"Telefoonnummer", type:"string"}] },
        {
          name: "openingstijden",
          title: "Inlooptijden",
          type: "object",
          fields: [
            { name: "ochtend", title: "Inloopochtend", type: "string" },
            { name: "avond", title: "Inloopavond", type: "string" },
            {
              name: "afwijkingen",
              title: "Vakanties en wijzigingen",
              type: "text",
              rows: 3,
            },
          ],
        },
        {
          name: "locatie",
          title: "Locatie",
          type: "object",
          fields: [{ name: "adres", title: "Adres", type: "text", rows: 2 }],
        },
      ],
    }),
    defineField({
      name: "verantwoording",
      title: "Bestuur en raad van advies",
      type: "object",
      fields: ["bestuur", "advies"].map((name) => ({
        name,
        title: name === "bestuur" ? "Bestuur" : "Raad van Advies",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              { name: "naam", title: "Naam", type: "string" },
              { name: "rol", title: "Functie", type: "string" },
            ],
            preview: { select: { title: "naam", subtitle: "rol" } },
          },
        ],
      })),
    }),
  ],
  preview: { prepare: () => ({ title: "Praktische gegevens en bestuur" }) },
});
