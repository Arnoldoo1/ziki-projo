'use client';

import { Doodle, type DoodleName } from './WhimsyDoodles';

const DOODLES: DoodleName[] = ['danfo', 'jollof', 'mango', 'suya', 'puff', 'zobo'];
const SPARKS = ['✦', '✧', '✦', '✧', '✦', '✧'];

/** Decoration-only layer inside the home hero. Sits behind the existing
 *  content and changes no layout, copy, fonts, colours or functionality. */
export function HeroMagic() {
  return (
    <div className="wd-hero-magic" aria-hidden="true">
      <span className="wd-hero-halo" />
      <span className="wd-hero-orbit" />
      {SPARKS.map((char, index) => (
        <span key={index} className={`wd-hero-spark wd-hsp${index + 1}`}>{char}</span>
      ))}
      {DOODLES.map((name, index) => (
        <span key={name} className={`wd-hero-doodle wd-hd${index + 1}`}>
          <Doodle name={name} />
        </span>
      ))}
    </div>
  );
}
