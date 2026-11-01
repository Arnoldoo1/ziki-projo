import { Doodle } from '@/components/WhimsyDoodles';

export default function Loading() {
  return (
    <div className="wd-loading">
      <span className="wd-loading-coin">
        <Doodle name="coin" />
      </span>
      <p>Sharp sharp, loading…</p>
      <small>The vibes are warming up.</small>
    </div>
  );
}
