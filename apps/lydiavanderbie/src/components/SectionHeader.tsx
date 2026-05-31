import Reveal from './Reveal';

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
};

/**
 * Shared section header: eyebrow kicker + serif display headline + optional intro.
 */
export default function SectionHeader({
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'dark',
}: Props) {
  const centered = align === 'center';
  const light = tone === 'light';

  return (
    <div className={centered ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}>
      <Reveal>
        <span className={`kicker ${light ? 'kicker-light' : ''}`}>{eyebrow}</span>
      </Reveal>
      <Reveal delay={1}>
        <h2 className={`mt-4 display-lg ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={2}>
          <p className={`mt-5 text-[17px] leading-relaxed ${light ? 'text-white/75' : 'text-ink-soft'}`}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
