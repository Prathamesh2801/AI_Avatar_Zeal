import { lazy, Suspense } from "react";

// lottie-web is ~1MB of the bundle and is only needed for the two animated
// icons on the idle screen. Loading it lazily keeps it out of the initial
// chunk; until it arrives the circular placeholder holds the layout, so
// nothing shifts when it swaps in.
const Player = lazy(() =>
  import("@lottiefiles/react-lottie-player").then((m) => ({
    default: m.Player,
  }))
);

// Fills its container (a circle that scales with the card) rather than being a
// fixed size, so the icon grows with the layout instead of floating in it.
// 68% keeps the square artwork inside the circle's inscribed area (~70.7%), so
// the avatar's shoulders aren't clipped by the rounded edge.
const SIZE = "w-[68%] h-[68%]";

export default function GenderIcon({ src }) {
  return (
    <Suspense fallback={<div className={SIZE} />}>
      <Player autoplay loop src={src} className={SIZE} />
    </Suspense>
  );
}
