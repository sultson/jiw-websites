type Props = { t: (k: string) => string };

const ITEMS = [
  { title: 'home.value1.title', body: 'home.value1.body', n: '01' },
  { title: 'home.value2.title', body: 'home.value2.body', n: '02' },
  { title: 'home.value3.title', body: 'home.value3.body', n: '03' },
  { title: 'home.value4.title', body: 'home.value4.body', n: '04' },
];

export default function Values({ t }: Props) {
  return (
    <section className="py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="kicker">{t('home.values.kicker')}</p>
            <h2 className="display-lg mt-6">
              {t('home.values.title').split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-x-10 gap-y-12">
            {ITEMS.map(item => (
              <div key={item.n}>
                <span className="font-display text-2xl text-sand">{item.n}</span>
                <div className="rule-thin my-4" />
                <h3 className="font-serif text-2xl mb-3">{t(item.title)}</h3>
                <p className="text-coffee/80 text-sm">{t(item.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
