import io, sys
p = 'src/pages.mjs'
s = io.open(p, encoding='utf-8').read()
subs = [
# --- home: core products lead
("""        <p class="lead">Solidago and eucalyptus are what we lead with and what we plan the season
          around. Limonium runs alongside them as an additional core programme product.</p>""",
 """        <p class="lead">Solidago and eucalyptus lead the programme and the season is planned
          around them. Limonium runs alongside as an additional core programme product.</p>"""),
# --- home: additional flowers lead
("""        <p class="lead">Available through our grower network and packed on the same airway bill,
          so you stop paying three freight minimums to build one bouquet.</p>""",
 """        <p class="lead">Available through our grower network and packed on the same airway bill,
          so one bouquet costs one freight minimum.</p>"""),
# --- trip captions
("""    <figcaption><b>Two degrees</b><span>Pre-cooled within the hour and never warmed again</span></figcaption></figure>""",
 """    <figcaption><b>Two degrees</b><span>Pre-cooled within the hour and held there to your door</span></figcaption></figure>"""),
("""    <figcaption><b>Measured, not estimated</b><span>Full stem length checked against your spec before bunching</span></figcaption></figure>""",
 """    <figcaption><b>Every stem measured</b><span>Full length checked against your spec before bunching</span></figcaption></figure>"""),
# --- how we work lead
("""    <p class="lead" style="margin-top:18px">Five steps, from the plan we agree with you to the box
      that lands at your cold store.</p>""",
 """    <p class="lead" style="margin-top:18px">Five steps, from the plan we agree to the box at your
      cold store.</p>"""),
# --- altitude section
("""    <h2 class="d2">Altitude does the work<br>we cannot fake</h2>
    <p class="lead" style="margin-top:20px">Between Naivasha and the slopes of Mount Kenya the days
      are bright and the nights drop close to ten degrees. That swing slows the plant down, and a
      slower plant gives a tighter head, a thicker neck and a deeper colour.</p>
    <p class="muted">It is the reason a Kenyan stem still looks fresh on day six in a Dutch shop,
      and the reason we will not buy the same variety from a farm at 900 metres just because it is cheaper.</p>""",
 """    <h2 class="d2">Altitude does<br>the work</h2>
    <p class="lead" style="margin-top:20px">Between Naivasha and the slopes of Mount Kenya the days
      are bright and the nights drop close to ten degrees. That swing slows the plant, which gives a
      tighter head, a thicker neck and a deeper colour.</p>
    <p class="muted">It is why a Kenyan stem still looks fresh on day six in a Dutch shop, and why we
      buy above 1,800 metres even when a lower farm quotes less.</p>"""),
# --- cold chain section
("""    <p class="lead" style="margin-top:20px">Out of Nairobi to Amsterdam or Liege, then onward across
      Europe to your cold store. Nothing goes through the Dutch clock, so you skip a day of handling
      and a margin you were paying for nothing.</p>
    <p class="muted">Pre-cooled within the hour of cutting, sealed into pre-chilled boxes and held at
      2 to 4 degrees through the export process, with the temperature logged. We confirm the delivery
      day for your destination on the order rather than promising the same transit time to everyone.</p>""",
 """    <p class="lead" style="margin-top:20px">Out of Nairobi to Amsterdam or Liege, then onward across
      Europe to your cold store. Nothing goes through the Dutch clock, which saves a day of handling
      and a margin.</p>
    <p class="muted">Pre-cooled within the hour of cutting, sealed into pre-chilled boxes and held at
      2 to 4 degrees through the export process, with the temperature logged. Your delivery day is
      confirmed on the order.</p>"""),
# --- quote band
("""    <p class="lead" style="margin-top:20px">Tell us the lines, the lengths and roughly what volume
      per week. You get a written quote with grade, pack and freight inside one working day, and
      a trial box before you commit to a programme.</p>""",
 """    <p class="lead" style="margin-top:20px">Tell us the lines, the lengths and the weekly volume.
      You get a written quote with grade, pack and freight inside one working day.</p>"""),
# --- catalogue lead
("""    <p class="lead">Fifteen lines, all on one airway bill. Every spec below is the standard pack.
      Stem length, bunch weight and cut stage can all be set to your own programme.</p>""",
 """    <p class="lead">Fifteen lines on one airway bill. The specs below are the standard pack; stem
      length, bunch weight and cut stage can be set to your own programme.</p>"""),
# --- availability lead
("""      <p class="lead">Kenya grows through the European winter, which is exactly when your local supply
        stops. Peak marks the months where we can take large standing volume at the best grade.</p></div>""",
 """      <p class="lead">Kenya grows through the European winter, when local supply stops. Peak marks
        the months we can take large standing volume at the best grade.</p></div>"""),
# --- shipping lead
("""    <p class="lead">Most vase life is lost before a flower ever leaves the country of origin. Here is
      exactly what happens to your stems between the field and your cold store.</p>""",
 """    <p class="lead">Most vase life is lost before a flower leaves the country of origin. Here is what
      happens to your stems between the field and your cold store.</p>"""),
# --- shipping chain
("""'Length and bunch weight checked against your written spec. Anything off spec goes out, not in.'""",
 """'Length and bunch weight checked against your written spec. Anything off spec is left behind.'"""),
("""'Into the cold room at 2 to 4 C within an hour of cutting. This is where vase life is won.'""",
 """'Into the cold room at 2 to 4 C within an hour of cutting. Vase life is won here.'"""),
# --- spec table lead
("""      <p class="lead">This is the house standard. Every figure here can be changed to your own
        programme and written into the order, and that is what the packhouse checks against.</p></div>""",
 """      <p class="lead">The house standard. Every figure can be changed to your own programme and
        written into the order, and that is what the packhouse checks against.</p></div>"""),
# --- shipping grid
("""        <p>Confirmed by Monday flies the same week. For a weekly standing order we work two weeks ahead
        so the crop is planned, not scavenged.</p></div>""",
 """        <p>Confirmed by Monday flies the same week. For a weekly standing order we work two weeks
        ahead so the crop is planned in advance.</p></div>"""),
("""        <p>Photos within 24 hours of arrival and we credit or replace on the next flight. No argument
        about who was holding it when.</p></div>""",
 """        <p>Photos within 24 hours of arrival and we credit or replace on the next flight.</p></div>"""),
# --- freight note
("""    <div class="note" style="margin-top:32px;max-width:74ch">Freight rates move with fuel and season,
      so we quote them per shipment rather than publishing a number that is wrong by next month.
      Ask and you get the current rate the same day.</div>""",
 """    <div class="note" style="margin-top:32px;max-width:74ch">Freight rates move with fuel and season,
      so we quote them per shipment. Ask and you get the current rate the same day.</div>"""),
]
miss = [a for a, b in subs if a not in s]
if miss:
    for m in miss:
        print('NOT FOUND:\n' + m[:170] + '\n---')
    sys.exit(1)
for a, b in subs:
    s = s.replace(a, b, 1)
io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('pages.mjs part 1 ok: %d edits' % len(subs))
