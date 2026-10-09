import io, sys
p = 'src/pages.mjs'
s = io.open(p, encoding='utf-8').read()
subs = [
# --- about: short chain
("""      <p class="lead" style="margin-top:20px">Most Kenyan flowers reach a European florist through
        three or four hands. Farm, exporter, auction, wholesaler. Every hand adds a day and a margin,
        and the flower pays for both.</p>
      <p class="muted">We work the other way round. You order from us, our growing partners cut to that
        order, and the box is built for you. That is one fewer week in transit and a price that reflects
        the stem rather than the number of people who touched it.</p>
      <p class="muted">We are not a farm and we do not pretend to be one. What we bring is the
        relationship with the growers, the specification the crop is held to, and the export process
        that gets it to you in the condition you were promised.</p>""",
 """      <p class="lead" style="margin-top:20px">Most Kenyan flowers reach a European florist through
        three or four hands: farm, exporter, auction, wholesaler. Every hand adds a day and a margin.</p>
      <p class="muted">You order from us, our growing partners cut to that order, and the box is built
        for you. One fewer week in transit, and a price for the stem.</p>
      <p class="muted">We are not a farm. We bring the relationship with the growers, the specification
        the crop is held to, and the export process that gets it to you in the condition you were
        promised.</p>"""),
# --- about: partners lead
("""      <p class="lead">Our model is working with selected Kenyan growers rather than owning farms. We
        collaborate closely with them on quality, specifications, harvesting, grading and export
        preparation, so what leaves the country matches what was agreed.</p></div>""",
 """      <p class="lead">We work with selected Kenyan growers rather than owning farms, and collaborate
        closely with them on quality, specifications, harvesting, grading and export preparation, so
        what leaves the country matches what was agreed.</p></div>"""),
# --- about: partner cards
("""      <div class="reason">${ico.leaf}<h3>Selected, not sourced on the day</h3>
        <p>We work with a small group of growers we know, chosen for the crop they are genuinely good
        at rather than for whatever is cheapest on the floor that week.</p></div>""",
 """      <div class="reason">${ico.leaf}<h3>A small group of growers</h3>
        <p>We work with growers we know, each chosen for the crop they are genuinely good at.</p></div>"""),
("""        <p>Stem length, bunch weight, stem count and cut stage are agreed up front and shared with the
        grower, so the spec is set before the crop is planted, not argued about after.</p></div>""",
 """        <p>Stem length, bunch weight, stem count and cut stage are agreed up front and shared with
        the grower, so the spec is set before the crop is planted.</p></div>"""),
("""      <div class="reason">${ico.box}<h3>Two regions, deliberately</h3>
        <p>Weather that ruins a crop in Naivasha rarely touches Mount Kenya in the same week, so a
        standing order does not fail because of one storm.</p></div>""",
 """      <div class="reason">${ico.box}<h3>Two regions, deliberately</h3>
        <p>Weather that ruins a crop in Naivasha rarely touches Mount Kenya in the same week, so one
        storm does not break a standing order.</p></div>"""),
# --- about: quality
("""      <h2 class="d2">Graded against your<br>spec, not ours</h2>
      <p class="lead" style="margin-top:20px">A house standard is comfortable for the exporter and
        useless to the buyer. Your stem length, bunch weight, stem count and cut stage are written into
        the order and that sheet is what the table checks against.</p>
      <p class="muted">Anything off spec does not travel. It is cheaper for us to leave a bunch in
        Nairobi than to credit a box in Rotterdam, and it is a great deal cheaper for you.</p>
      <p class="muted">Ask and you get a photo of your actual pallet before it leaves. Not a stock
        photo, and not the good bunch off the top.</p>""",
 """      <h2 class="d2">Graded against<br>your spec</h2>
      <p class="lead" style="margin-top:20px">Your stem length, bunch weight, stem count and cut stage
        are written into the order, and that sheet is what the grading table checks against.</p>
      <p class="muted">Anything off spec does not travel. It is cheaper to leave a bunch in Nairobi
        than to credit a box in Rotterdam.</p>
      <p class="muted">Ask and you get a photo of your own pallet before it leaves.</p>"""),
# --- about: certification
("""      <p class="lead">European retail will not touch flowers without a paper trail, and nor should it.
        These are the schemes our programme is built to.</p></div>""",
 """      <p class="lead">European retail requires a paper trail. These are the schemes our programme is
        built to.</p></div>"""),
# --- contact: form note
("""        <p class="form-note">The form does not store anything. It writes your enquiry into an email or
          a WhatsApp message and hands it to your own app, so you can see exactly what goes out and
          keep a copy yourself.</p>""",
 """        <p class="form-note">The form stores nothing. It writes your enquiry into an email or a
          WhatsApp message in your own app, so you can see what goes out and keep a copy.</p>"""),
# --- contact: what you get back
("""        <b>What you get back:</b> a written quote per line with stem length, bunch spec, box count,
        FOB or CIF price and the current freight rate. Plus a trial box before you commit to a
        standing programme.""",
 """        <b>What you get back:</b> a written quote per line with stem length, bunch spec, box count,
        FOB or CIF price and the current freight rate, plus a trial box before a standing programme."""),
# --- 404
("""    <p class="lead">The link is dead but the flowers are not. Try the catalogue.</p>""",
 """    <p class="lead">That link no longer works. Try the catalogue.</p>"""),
# --- contact lead
("""    <p class="lead">Tell us the lines, the lengths and roughly what you need per week. You get a
      written price with grade, pack and freight inside one working day.</p>""",
 """    <p class="lead">Tell us the lines, the lengths and the weekly volume. You get a written price
      with grade, pack and freight inside one working day.</p>"""),
]
miss = [a for a, b in subs if a not in s]
if miss:
    for m in miss:
        print('NOT FOUND:\n' + m[:180] + '\n---')
    sys.exit(1)
for a, b in subs:
    s = s.replace(a, b, 1)
io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('pages.mjs part 2 ok: %d edits' % len(subs))
