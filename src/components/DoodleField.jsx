import Brain from "../assets/img/brand/icon-brain.png";
import Trophy from "../assets/img/brand/icon-trophy.png";
import Globe from "../assets/img/brand/icon-globe.png";
import Cap from "../assets/img/brand/icon-cap.png";
import Book from "../assets/img/brand/icon-book.png";

/**
 * The outline doodles from the artwork, scattered in the page margins.
 *
 * Purely decorative, so it is aria-hidden and never intercepts taps. Positions
 * mirror the mockup (brain top-left, trophy upper-right, globe mid-left, cap
 * lower-middle, book bottom-right). The smallest two hide below `sm` so they
 * don't crowd a phone screen.
 */
const DOODLES = [
  { src: Brain, alt: "", className: "top-[11%] left-[4%] w-9 sm:w-14 lg:w-16" },
  {
    src: Trophy,
    alt: "",
    className: "top-[20%] right-[4%] w-9 sm:w-14 lg:w-16",
  },
  {
    src: Globe,
    alt: "",
    className: "top-[60%] left-[4%] w-8 sm:w-12 lg:w-14 hidden min-[380px]:block",
  },
  {
    src: Cap,
    alt: "",
    className: "bottom-[26%] right-[10%] w-10 sm:w-16 lg:w-20 hidden sm:block",
  },
  {
    src: Book,
    alt: "",
    className: "bottom-[15%] left-[6%] w-8 sm:w-12 lg:w-14 hidden min-[380px]:block",
  },
];

export default function DoodleField() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {DOODLES.map((d, i) => (
        <img
          key={i}
          src={d.src}
          alt=""
          loading="lazy"
          decoding="async"
          className={`absolute opacity-70 select-none ${d.className}`}
        />
      ))}
    </div>
  );
}
