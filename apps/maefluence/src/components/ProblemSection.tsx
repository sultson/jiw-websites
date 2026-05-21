import type { Route } from '../hooks/useRoute';

type Props = {
  t: (k: string) => string;
  go: (r: Route) => void;
};

export default function ProblemSection({ t, go }: Props) {
  return (
    <section className="py-24 lg:py-36">
      <div className="mx-auto max-w-5xl px-6 lg:px-10 text-center">
        <p className="kicker">{t('problem.kicker')}</p>
        <h2 className="display-lg mt-6">{t('problem.title')}</h2>
        <div className="mt-10 space-y-6 text-coffee/80 text-base lg:text-lg max-w-3xl mx-auto">
          <p>{t('problem.body')}</p>
          <p>{t('problem.body2')}</p>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <button type="button" onClick={() => go('services')} className="btn-primary">
            {t('problem.cta.services')}
          </button>
          <button type="button" onClick={() => go('about')} className="btn-outline">
            {t('problem.cta.about')}
          </button>
        </div>
      </div>
    </section>
  );
}
