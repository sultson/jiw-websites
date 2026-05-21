import CalButton from './CalButton';

type Props = { t: (k: string) => string };

export default function CtaBanner({ t }: Props) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="rounded-[2.5rem] bg-sand/30 border border-sand/40 px-8 py-14 lg:px-16 lg:py-20 text-center">
          <p className="kicker">{t('contact.kicker')}</p>
          <h2 className="display-md mt-4">{t('contact.title')}</h2>
          <p className="text-coffee/80 mt-6 max-w-xl mx-auto">{t('contact.lead')}</p>
          <div className="mt-10 flex justify-center">
            <CalButton className="btn-primary">{t('hero.cta')}</CalButton>
          </div>
        </div>
      </div>
    </section>
  );
}
