import Nav from './components/Nav';
import HeroRoom from './components/HeroRoom';
import Work from './components/Work';
import Peter from './components/Peter';
import S21 from './components/S21';
import News from './components/News';
import Visit from './components/Visit';
import Footer from './components/Footer';
import { useLang } from './hooks/useLang';

export default function App() {
  const { lang, setLang, t } = useLang();

  return (
    <>
      <Nav t={t} lang={lang} setLang={setLang} />
      <main>
        <HeroRoom t={t} lang={lang} />
        <Work t={t} lang={lang} />
        <Peter t={t} />
        <S21 t={t} lang={lang} />
        <News t={t} lang={lang} />
        <Visit t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
