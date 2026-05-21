import type { Route } from '../hooks/useRoute';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import PortfolioStrip from '../components/PortfolioStrip';
import Values from '../components/Values';
import CtaBanner from '../components/CtaBanner';

type Props = {
  t: (k: string) => string;
  go: (r: Route) => void;
};

export default function Home({ t, go }: Props) {
  return (
    <>
      <Hero t={t} go={go} />
      <ProblemSection t={t} go={go} />
      <PortfolioStrip t={t} />
      <Values t={t} />
      <CtaBanner t={t} />
    </>
  );
}
