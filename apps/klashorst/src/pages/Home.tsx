import HeroRoom from '../components/HeroRoom';
import Work from '../components/Work';
import Peter from '../components/Peter';
import S21 from '../components/S21';
import Gallery from '../components/Gallery';
import Blog from '../components/Blog';
import Visit from '../components/Visit';

/** The museum itself, on one page, in the order a visitor walks through it. */
export default function Home() {
  return (
    <main>
      <HeroRoom />
      <Work />
      <Peter />
      <S21 />
      <Gallery />
      <Blog />
      <Visit />
    </main>
  );
}
