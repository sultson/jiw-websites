/* Haar eigen logobestand, met de witte achtergrond eruit gehaald
   (scripts/bloem-asset.mjs). Hij wordt als masker gebruikt en met currentColor
   ingekleurd, zodat dezelfde tekening op de room-, olijf- en inkt-vlakken de
   juiste kleur en dekking meekrijgt. */
import type {CSSProperties} from 'react';

export const BLOEM_SRC = '/img/bloem.png';

export function Bloem({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className}`}
      style={{
        WebkitMaskImage: `url(${BLOEM_SRC})`,
        maskImage: `url(${BLOEM_SRC})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        ...style,
      }}
    />
  );
}
