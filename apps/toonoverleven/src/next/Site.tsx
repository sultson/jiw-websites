import {
  createElement,
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  template,
  safeLink,
  activityTypes,
  type Node,
  type PageContent,
} from "./model";
import type { Activiteit, Content } from "../content/types";
import { bron } from "../content/image";
import Formulier from "../components/Formulier";
import { eventPath, findEvent, momentLabel as moment } from "./events";
import { interfaceCopy } from "./interface";
import { THEMA_LABEL, DOELGROEP_LABEL } from "../agenda/model";
import RijkeTekst from "../components/RijkeTekst";

type Context = { content: Content; agenda: Activiteit[]; path: string };
const image = (name: string) => "/img/approved/" + name + ".webp";
const upcoming = (ctx: Context, type?: string) =>
  ctx.agenda.filter(
    (a) => a.soort === "activiteit" && (!type || a.activiteitType === type),
  );
const url = eventPath;
const categoryLabel = (c: string) => ({Inloop: "Ontmoeten", Wellness: "Ontspannen"}[c] || c);
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip" href="#inhoud">
        Naar de inhoud
      </a>
      <header className="header wrap">
        <a className="brand" href="/" aria-label="Toon over Leven, naar home">
          <img
            src={image("logo")}
            alt="Toon over Leven"
            width="132"
            height="71"
          />
        </a>
        <nav
          className={"site-nav " + (open ? "is-open" : "")}
          aria-label="Hoofdnavigatie"
          onClick={(e) => {
            if ((e.target as Element).closest("a")) setOpen(false);
          }}
        >
          {[
            [
              "Activiteiten",
              "/activiteiten",
              [
                ["Agenda", "/activiteiten#agenda"],
                ["Eerste bezoek", "/eerste-bezoek"],
                ["Praktisch", "/praktisch"],
              ],
            ],
            [
              "Kennis",
              "/kennis-en-wegwijzer",
              [
                ["Kennis en wegwijzer", "/kennis-en-wegwijzer"],
                [
                  "Centrum voor leven met en na kanker",
                  "/kennis-en-wegwijzer/wat-is-een-centrum-voor-leven-met-en-na-kanker",
                ],
                [
                  "Psychosociale ondersteuning",
                  "/kennis-en-wegwijzer/wat-is-psychosociale-ondersteuning",
                ],
                ["Voor verwijzers", "/voor-verwijzers"],
              ],
            ],
            [
              "Over Toon",
              "/over-ons",
              [
                ["Wie wij zijn", "/over-ons"],
                ["Vrijwilliger worden", "/over-ons/vrijwilliger-worden"],
                ["Steun ons", "/over-ons/steun-ons"],
                ["Onze sponsors", "/over-ons/onze-sponsors"],
                ["Verantwoording", "/over-ons/organisatie-en-verantwoording"],
                ["Nieuws", "/nieuws"],
              ],
            ],
          ].map(([label, href, children]) => (
            <div className="navgroup" key={String(label)}>
              <a href={String(href)}>{String(label)}</a>
              <details>
                <summary aria-label={"Submenu " + label}>⌄</summary>
                <div className="navsub">
                  {(children as string[][]).map(([label, href]) => (
                    <a key={href} href={href}>
                      {label}
                    </a>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </nav>
        <a className="btn" href="/contact">
          Contact <span aria-hidden="true">→</span>
        </a>
        <button
          className="mobile-toggle"
          aria-expanded={open}
          aria-label={open ? "Menu sluiten" : "Menu openen"}
          onClick={() => setOpen(!open)}
        >
          {open ? "× Sluiten" : "☰ Menu"}
        </button>
      </header>
    </>
  );
}
function Template({ path, ctx }: { path: string; ctx: Context }) {
  const p = template(path);
  if (!p) return null;
  const edit = ctx.content.pages?.find((p) => p.path === path);
  return (
    <>
      {p.tree.map((n, i) => (
        <Tree key={i} node={n} ctx={ctx} edit={edit} />
      ))}
    </>
  );
}
function Tree({
  node,
  ctx,
  edit,
  activityHref,
}: {
  node: Node;
  ctx: Context;
  edit?: PageContent;
  activityHref?: string;
}): ReactNode {
  if (typeof node === "string") return node;
  if ("text" in node)
    return edit?.texts?.find((t) => t._key === node.key)?.text ?? node.text;
  const { tag, attrs, children } = node;
  if (tag === "site-slot")
    return (
      <Slot
        name={attrs.name}
        attrs={attrs}
        ctx={ctx}
        activityHref={activityHref}
        edit={edit}
      />
    );
  const props: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith("on") || key === "data-sub") continue;
    const k =
      (
        {
          class: "className",
          tabindex: "tabIndex",
          for: "htmlFor",
          viewbox: "viewBox",
          "stroke-width": "strokeWidth",
          "stroke-linecap": "strokeLinecap",
          "stroke-linejoin": "strokeLinejoin",
          allowfullscreen: "allowFullScreen",
          referrerpolicy: "referrerPolicy",
          colspan: "colSpan",
        } as Record<string, string>
      )[key] ?? key;
    if (key === "style") {
      props.style = Object.fromEntries(
        value
          .split(";")
          .filter((s) => s.includes(":"))
          .map((s) => {
            const i = s.indexOf(":");
            return [
              s
                .slice(0, i)
                .trim()
                .replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
              s.slice(i + 1).trim(),
            ];
          }),
      ) as CSSProperties;
    } else if (["hidden", "open", "required"].includes(key)) props[k] = true;
    else props[k] = value;
  }
  if (tag === "a")
    props.href = safeLink(
      edit?.links?.find((l) => l._key === node.linkKey)?.href ??
        String(props.href ?? "#"),
    );
  if (tag === "a" && attrs["data-contact"]) {
    const contact = ctx.content.teksten.praktisch.contact;
    const kind = attrs["data-contact"];
    props.href = kind === 'email' ? 'mailto:' + contact.email : kind === 'phone' ? 'tel:' + contact.telefoon.replace(/[^+0-9]/g, '') : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ctx.content.teksten.praktisch.locatie.adres);
  }
  if (tag === "img") {
    const im = edit?.images?.find((i) => i._key === node.imageKey);
    if (im && !im.img) return null;
    if (im?.img) { props.src = im.img.breed; props.style = {...(props.style as CSSProperties || {}), ...imageStyle(im.img)}; }
    if (im?.alt !== undefined) props.alt = im.alt;
  }
  const href = tag === "a" ? String(props.href) : activityHref;
  if (["img", "br", "hr", "input", "source"].includes(tag))
    return createElement(tag, props);
  return createElement(
    tag,
    props,
    children.map((child, i) => (
      <Tree key={i} node={child} ctx={ctx} edit={edit} activityHref={href} />
    )),
  );
}
function Slot({
  name,
  attrs,
  ctx,
  activityHref,
  edit,
}: {
  name: string;
  attrs: Record<string, string>;
  ctx: Context;
  activityHref?: string;
  edit?: PageContent;
}) {
  const copy = interfaceCopy(ctx.content);
  switch (name) {
    case "fact": {
      const [group, key] = attrs.field.split(".");
      return (
        <>
          {
            (
              ctx.content.teksten.praktisch as unknown as Record<
                string,
                Record<string, string>
              >
            )[group]?.[key]
          }
        </>
      );
    }
    case "welcome":
      return <Template path="@visit" ctx={ctx} />;
    case "firstSteps":
      return <Template path="@firstSteps" ctx={ctx} />;
    case "poem":
      return <Template path="@poem" ctx={ctx} />;
    case "visitAddress":
      return (
        <aside className="visit-address">
          <span className="eyebrow">Kom je langs?</span>
          <h3>Vrije inloop</h3>
          <p className="visit-time">
            {ctx.content.teksten.praktisch.openingstijden.ochtend}
          </p>
          <div className="address-line" />
          <p className="preserve-lines">
            {ctx.content.teksten.praktisch.locatie.adres}
            <br />
            Geen verwijzing nodig
          </p>
          <a className="textlink" href="/praktisch#inlooptijden">
            Alle inlooptijden →
          </a>
        </aside>
      );
    case "targetedEvents": {
      const groups = ctx.path === '/voor-naasten' ? ['naasten'] : ['jongeren-15-35', '35-50'];
      const events = upcoming(ctx).filter(a => a.doelgroepen.some(g => groups.includes(g)));
      return events.length ? <section className="wrap section"><h2>{ctx.path === '/voor-naasten' ? 'Activiteiten voor naasten' : 'Ontmoet leeftijdsgenoten'}</h2><ActivityCards events={events} /></section> : null;
    }
    case "upcoming":
      return <ActivityCards events={upcoming(ctx).slice(0, 3)} />;
    case "agenda":
      return <Agenda ctx={ctx} />;
    case "activityPractical":
      return <ActivityPractical ctx={ctx} type={ctx.path.split('/').pop()!} />;
    case "activityMoments":
      return <ActivityMoments ctx={ctx} type={ctx.path.split('/').pop()!} />;
    case "routeDate": {
      const type = activityHref?.split("/").pop();
      const next = upcoming(ctx, type)[0];
      return (
        <p className="route-event-status">
          {next ? moment(next) : "Vraag naar een volgende datum"}
        </p>
      );
    }
    case "contact":
      return (
        <section className="form-card" id="kennismaken">
<h2>{copy.contactTitle}</h2><p>{copy.contactIntro}</p>
          <Formulier compact copy={copy} contact={ctx.content.teksten.praktisch.contact} />
          <p className="privacy">
            {copy.privacyIntro} <a href="/privacy">{copy.privacyLink}</a>.
          </p>
        </section>
      );
    case "video": {
      const video = edit?.videos?.find(v => v._key === attrs.videoKey);
      return <Video id={video?.video ?? attrs.video} title={video?.title ?? attrs.title} text={video?.text ?? attrs.text} ctx={ctx} />;
    }
    case "sponsors":
      return (
        <section className="sponsorband">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">Samen maken we het mogelijk</span>
                <h2>Onze sponsors</h2>
                <p>
                  Dankzij de steun van bedrijven, fondsen en betrokken mensen
                  kunnen we een plek voor ontmoeting en activiteiten bieden.
                </p>
              </div>
              <a className="textlink" href="/over-ons/onze-sponsors">
                Bekijk alle sponsors →
              </a>
            </div>
            <Sponsors ctx={ctx} />
            <a className="textlink" href="/over-ons/steun-ons">
              Ook bijdragen? →
            </a>
          </div>
        </section>
      );
    case "allSponsors":
      return <Sponsors ctx={ctx} />;
    case "board":
    case "advisory":
      return (
        <section className="copy-section" id={name === "advisory" ? "raad-van-advies" : undefined}>
          <h2>{name === "board" ? "Bestuur" : "Raad van Advies"}</h2>
          <ul>
            {ctx.content.teksten.verantwoording[
              name === "board" ? "bestuur" : "advies"
            ].map((p) => (
              <li key={p.naam}>
                {p.naam}
                {p.rol ? " · " + p.rol : ""}
              </li>
            ))}
          </ul>
        </section>
      );
    case "news":
      return (
        <div className="activity-grid">
          {ctx.content.nieuws.map((n) => (
            <a className="activity-card" href={"/nieuws/" + n.slug} key={n.id}>
              {n.img && (
                <img src={bron(n.img, "klein")} style={imageStyle(n.img)} alt="" loading="lazy" />
              )}
              <div className="activity-body">
                <span className="eyebrow">{n.datum}</span>
                <h2>{n.titel}</h2>
                <p>{n.samenvatting}</p>
                <span className="textlink">Lees verder →</span>
              </div>
            </a>
          ))}
        </div>
      );
    default:
      return null;
  }
}
function Sponsors({ ctx }: { ctx: Context }) {
  return (
    <div className="sponsor-grid">
      {ctx.content.sponsoren.map((s) => {
        const contents = (
          <>
            <img src={s.beeld} alt={s.naam} loading="lazy" />
            <span>{s.naam}</span>
          </>
        );
        return s.web ? (
          <a
            className="sponsor"
            key={s.naam}
            href={safeLink(s.web)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {contents}
          </a>
        ) : (
          <div className="sponsor" key={s.naam}>
            {contents}
          </div>
        );
      })}
    </div>
  );
}
function Video({
  id,
  title,
  text,
  ctx,
}: {
  id: string;
  title: string;
  text: string;
  ctx: Context;
}) {
  const copy = interfaceCopy(ctx.content);
  const [accepted, setAccepted] = useState(false);
  return (
    <section className="wrap ipso-video">
      <div className="video-copy">
        <span className="eyebrow">In beeld · IPSO</span>
        <h2>{title}</h2>
        <p>{text}</p>
        <p className="small">
          {copy.videoPrivacy}
        </p>
        <a
          className="textlink"
          href={"https://www.youtube.com/watch?v=" + id}
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.videoExternal} ↗
        </a>
        {accepted && (
          <button className="textlink" onClick={() => setAccepted(false)}>
            {copy.videoRevoke}
          </button>
        )}
      </div>
      <div className="video-stage">
        {accepted ? (
          <iframe
            className="video-iframe"
            src={
              "https://www.youtube-nocookie.com/embed/" +
              encodeURIComponent(id) +
              "?autoplay=1&rel=0"
            }
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button className="video-cover" onClick={() => setAccepted(true)}>
            <img src={image(["tp4HSjWdbG8", "ukZD8t8OkDQ", "-mYRlxVqYzc"].includes(id) ? "video-" + id : "ipso-groep")} alt="" loading="lazy" />
            <span className="video-play" aria-hidden="true">
              ▶
            </span>
            <span className="video-caption">{copy.videoAllow}</span>
          </button>
        )}
      </div>
    </section>
  );
}
function ActivityCards({ events }: { events: Activiteit[] }) {
  return events.length ? (
    <div className="activity-grid">
      {events.map((a) => (
        <a className="activity-card" href={url(a)} key={a.id}>
          <img src={bron(eventImage(a)!, "klein")} style={imageStyle(eventImage(a))} alt="" loading="lazy" />
          <div className="activity-body">
            <span className="eyebrow">
              {(a.categorieen?.length ? a.categorieen : [a.categorie]).map(categoryLabel).join(" · ")}
            </span>
            <h3>{a.titel}</h3>
            <p>{moment(a)}</p>
            <p>{a.locatie}</p>
            <p className="event-summary">{a.omschrijving.split(/\n\s*\n/)[0].replace(/[#*_|]/g, "").slice(0, 180)}{a.omschrijving.split(/\n\s*\n/)[0].length > 180 ? "…" : ""}</p>
            <div className="event-date">
              <span>
                {a.volgeboekt
                  ? "Volgeboekt"
                  : a.aanmelden
                    ? "Vooraf aanmelden"
                    : "Vrije inloop"}
              </span>
              <span aria-hidden="true">↗</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  ) : (
    <div className="empty">
      <p>Er staan nog geen nieuwe momenten in de agenda.</p>
      <a className="textlink" href="/contact">
        Vraag naar de mogelijkheden →
      </a>
    </div>
  );
}
function Agenda({ ctx }: { ctx: Context }) {
  const [category, setCategory] = useState('Alles');
  const [audience, setAudience] = useState('');
  const [theme, setTheme] = useState('');
  const copy = interfaceCopy(ctx.content);
  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const value = search.get('categorie') || '';
    setCategory(({creatief:'Creatief', bewegen:'Bewegen', ontmoeten:'Inloop', ontspannen:'Wellness', inloop:'Inloop', wellness:'Wellness', overig:'Overig'} as Record<string,string>)[value] || 'Alles');
    setAudience(search.get('doelgroep') || ''); setTheme(search.get('thema') || '');
  }, []);
  const events = upcoming(ctx).filter(a =>
    (category === 'Alles' || (a.categorieen?.length ? a.categorieen : [a.categorie]).includes(category as any)) &&
    (!audience || a.doelgroepen.includes(audience as any)) && (!theme || a.themas.includes(theme as any)));
  return <><div className="section-head"><div><span className="eyebrow">Vind iets dat bij je past</span><h2>De agenda</h2></div></div>
    <div className="filterbar" role="group" aria-label="Wat wil je doen?">{['Alles','Inloop','Wellness','Creatief','Bewegen','Overig'].map(c => <button key={c} onClick={() => setCategory(c)} aria-pressed={c === category}>{c === 'Alles' ? 'Alle activiteiten' : categoryLabel(c)}</button>)}</div>
    <div className="agenda-filters"><label>Voor wie<select value={audience} onChange={e=>setAudience(e.target.value)}><option value="">Alle doelgroepen</option>{Object.entries(DOELGROEP_LABEL).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><label>Thema<select value={theme} onChange={e=>setTheme(e.target.value)}><option value="">Alle thema’s</option>{Object.entries(THEMA_LABEL).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label></div>
    <p className="filter-count" aria-live="polite">{events.length} {events.length === 1 ? 'moment' : 'momenten'}</p>
    {events.length ? <ActivityCards events={events} /> : category !== 'Alles' || audience || theme ? <div className="empty"><p>{copy.noMatches}</p><button className="btn" onClick={()=>{setCategory('Alles');setAudience('');setTheme('');}}>{copy.resetFilters}</button></div> : <ActivityCards events={[]} />}
  </>;
}
/** The supplied agenda descriptions contain headings, emphasis, links and a programme table. */
function EventDescription({ text }: { text: string }) {
  const inline = (value: string): ReactNode[] =>
    value.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, i) => {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (link)
        return (
          <a key={i} href={safeLink(link[2])}>
            {link[1]}
          </a>
        );
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      return part;
    });
  return (
    <div className="event-copy">
      {text.split(/\n\s*\n/).map((block, i) => {
        if (block.startsWith("|")) {
          const rows = block
            .split("\n")
            .filter((row) => row.startsWith("|") && !/^\|[\s:|\-]+$/.test(row))
            .map((row) =>
              row
                .split("|")
                .slice(1, -1)
                .map((c) => c.trim()),
            )
            .filter((row) => row.some(Boolean));
          return (
            <div className="table-wrap" key={i}>
              <table>
                <tbody>
                  {rows.map((row, j) => (
                    <tr key={j}>
                      {row.map((cell, k) =>
                        k === 0 ? (
                          <th scope="row" key={k}>
                            {inline(cell)}
                          </th>
                        ) : (
                          <td key={k}>{inline(cell)}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (/^##? /.test(block))
          return <h3 key={i}>{inline(block.replace(/^#+\s*/, ""))}</h3>;
        return <p key={i}>{inline(block)}</p>;
      })}
    </div>
  );
}
function Breadcrumb({ title, parent = '/activiteiten', parentTitle = 'Activiteiten' }: { title: string; parent?: string; parentTitle?: string }) {
  return <nav className="wrap crumb" aria-label="Broodkruimel"><a href="/">Home</a><span aria-hidden="true"> / </span><a href={parent}>{parentTitle}</a><span aria-hidden="true"> / </span><span aria-current="page">{title}</span></nav>;
}
function PageHero({ title, eyebrow, img }: { title: string; eyebrow: string; img?: Activiteit['img'] }) {
  return <div className={'hero-band ' + (img ? 'page-hero' : '')}><section className={'wrap ' + (img ? 'hero' : 'plain-hero')}><div className="hero-copy"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div>{img && <div className="hero-art"><img className="hero-image" src={bron(img, 'breed')} style={imageStyle(img)} alt="" loading="eager" /></div>}</section></div>;
}
function eventImage(a: Activiteit): Activiteit['img'] {
  return a.img || image(activityTypes[a.activiteitType || '']?.image || ({Inloop:'ipso-groep', Creatief:'activiteit-creatief-v2.jpg', Bewegen:'activiteit-wandelen-v2.jpg', Wellness:'activiteit-mindfulness-v2.jpg', Overig:'hero'}[a.categorie]));
}
function imageStyle(img: Activiteit['img']): CSSProperties | undefined {
  return img && typeof img !== 'string' && img.position ? { objectPosition: img.position } : undefined;
}
function SignupAction({ ctx, event }: { ctx: Context; event: Activiteit }) {
  const copy = interfaceCopy(ctx.content);
  if (event.volgeboekt) return <p className="notice">{copy.full}</p>;
  if (!event.aanmelden) return <p className="notice">{copy.noSignup}</p>;
  const external = event.aanmeldUrl || (event.aanmeldEmail ? `mailto:${event.aanmeldEmail}?subject=${encodeURIComponent('Aanmelden: ' + event.titel + ' — ' + moment(event))}` : undefined);
  return <a className="btn" href={safeLink(external || eventPath(event, 'aanmelden'))}>{external ? copy.externalSignup : copy.signupLink} →</a>;
}
function ActivityPractical({ ctx, event, type }: { ctx: Context; event?: Activiteit; type?: string }) {
  const a = event || upcoming(ctx, type)[0];
  const [date, time] = a ? moment(a).split(' · ') : [];
  const copy = interfaceCopy(ctx.content);
  return <aside className="side-note event-practical" aria-label="Praktische informatie">
    <h2>{date || copy.noDateTitle}</h2>
    {time && <p>{time}</p>}
    {!a && <p>{copy.noDate}</p>}
    <p className="preserve-lines"><strong>{copy.locationLabel}</strong><br />{a?.locatie || ctx.content.teksten.praktisch.locatie.adres}</p>
    {a?.bijdrage && <p><strong>{copy.contributionLabel}</strong><br />{a.bijdrage}</p>}
    {a ? <SignupAction ctx={ctx} event={a} /> : <a className="btn" href="/contact">{copy.contactLink} →</a>}
    <p><a className="textlink" href="/praktisch#bereikbaarheid">{copy.directions} →</a></p>
    <a className="textlink" href="/activiteiten#agenda">{copy.allActivities} →</a>
  </aside>;
}
function ActivityMoments({ ctx, type }: { ctx: Context; type: string }) {
  const copy = interfaceCopy(ctx.content);
  const events = upcoming(ctx, type);
  return <section className="activity-moments" id="volgende-momenten"><h2>{copy.upcomingTitle}</h2>{events.length ? <ActivityCards events={events} /> : <div className="notice"><h3>{copy.noDateTitle}</h3><p>{copy.noDate}</p><a href="/contact" className="textlink">{copy.contactLink} →</a></div>}</section>;
}
function ActivityPage({ ctx, event }: { ctx: Context; event: Activiteit }) {
  return <><Breadcrumb title={event.titel} /><PageHero title={event.titel} eyebrow={(event.categorieen?.length ? event.categorieen : [event.categorie]).map(categoryLabel).join(' · ')} img={eventImage(event)} /><div className="wrap body-layout"><article className="content"><section className="copy-section"><EventDescription text={event.omschrijving} /></section>{event.activiteitType && <a className="textlink" href={'/activiteiten/' + event.activiteitType}>Meer over {activityTypes[event.activiteitType]?.title || event.titel} →</a>}</article><ActivityPractical ctx={ctx} event={event} /></div><Template path="@visit" ctx={ctx} /></>;
}
function RegistrationPage({ ctx }: { ctx: Context }) {
  const copy = interfaceCopy(ctx.content);
  const exact = findEvent(upcoming(ctx), ctx.path);
  const type = decodeURIComponent(ctx.path.split('/')[2] || '');
  const events = exact ? [exact] : upcoming(ctx, type);
  const [selected, setSelected] = useState(events[0]?.id || '');
  const event = events.find(a => a.id === selected);
  const title = event?.titel || activityTypes[type]?.title || 'Activiteit';
  return <><Breadcrumb title={'Aanmelden: ' + title} /><PageHero title={'Meedoen aan ' + title} eyebrow="Samen iets doen" img={event ? eventImage(event) : activityTypes[type] ? image(activityTypes[type].image) : undefined} /><div className="wrap contact-layout"><div>{event ? <><h2>{title}</h2><p>{moment(event)}</p><p>{event.locatie || ctx.content.teksten.praktisch.locatie.adres}</p><a className="textlink" href={eventPath(event)}>Terug naar de activiteit →</a></> : <p>{copy.noDate}</p>}</div><section className="form-card"><h2>{copy.signupTitle}</h2>{events.length > 1 && <label>{copy.dateLabel}<select value={selected} onChange={e => setSelected(e.target.value)}>{events.map(a => <option key={a.id} value={a.id}>{moment(a)}</option>)}</select></label>}{event && event.aanmelden && !event.volgeboekt && !event.aanmeldEmail && !event.aanmeldUrl ? <><p>{copy.signupIntro}</p><Formulier key={event.id} compact registration={{ title: event.titel, date: moment(event), id: event.id }} copy={copy} contact={ctx.content.teksten.praktisch.contact} /><p className="privacy">{copy.privacyIntro} <a href="/privacy">{copy.privacyLink}</a>.</p></> : event ? <SignupAction ctx={ctx} event={event} /> : <a className="btn" href="/contact">{copy.contactLink} →</a>}</section></div><Template path="@visit" ctx={ctx} /></>;
}

export default function Site({ ctx }: { ctx: Context }) {
  let body: ReactNode;
  const news = ctx.path.startsWith("/nieuws/")
    ? ctx.content.nieuws.find(
        (n) => n.slug === decodeURIComponent(ctx.path.slice(8)),
      )
    : undefined;
  const event = ctx.path.startsWith('/activiteit/') ? findEvent(upcoming(ctx), ctx.path) : undefined;
  if (news)
    body = <><Breadcrumb title={news.titel} parent="/nieuws" parentTitle="Nieuws" /><PageHero title={news.titel} eyebrow={news.datum} img={news.img} /><div className="wrap body-layout"><article className="content news-body"><RijkeTekst blokken={news.body} /></article><aside className="side-note"><h2>Liever even contact?</h2><a className="textlink" href="/contact">Neem contact op →</a><p><a href="/nieuws">Alle nieuwsberichten →</a></p></aside></div><Template path="@visit" ctx={ctx} /></>;
  else if (event) body = <ActivityPage ctx={ctx} event={event} />;
  else if (ctx.path.startsWith('/aanmelden/')) body = <RegistrationPage ctx={ctx} />;
  else if (template(ctx.path)) body = <Template path={ctx.path} ctx={ctx} />;
 else
    body = (
      <section className="wrap section">
        <h1>Deze pagina bestaat niet.</h1>
        <a className="btn" href="/">
          Terug naar home
        </a>
      </section>
    );
  return (
    <div className="approved-site">
      <Header />
      <main id="inhoud" tabIndex={-1} key={ctx.path}>
        {body}
      </main>
      {ctx.path === "/" && <Template path="@newsletter" ctx={ctx} />}
      <Template path="@footer" ctx={ctx} />
    </div>
  );
}
