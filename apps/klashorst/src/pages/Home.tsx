import HeroRoom from '../components/HeroRoom';
import Work from '../components/Work';
import Peter from '../components/Peter';
import Gallery from '../components/Gallery';
import Blog from '../components/Blog';
import Visit from '../components/Visit';
import Ask from '../components/Ask';

/** The museum itself, on one page, in the order a visitor walks through it. */
export default function Home() {
  return (
    <main>
      <HeroRoom />
      <Work />
      <Peter />
      <Blog />
      <Gallery />
      <Visit />
      <Ask />
    </main>
  );
}
