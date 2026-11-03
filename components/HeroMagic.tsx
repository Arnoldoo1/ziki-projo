'use client';

const SPARKS = ['✦', '✧', '✦', '✧', '✦', '✧'];

/** Decoration-only hero layer: a clipped sunburst halo and six bold ✦/✧
 *  sparkles. No food, fruit or vehicle doodles, and no oval/ring. */
export function HeroMagic() {
  return (
    <div className="wd-hero-magic" aria-hidden="true">
      <span className="wd-hero-halo" />
      {SPARKS.map((char, index) => (
        <span key={index} className={`wd-hero-spark wd-hsp${index + 1}`}>{char}</span>
      ))}
    </div>
  );
}
