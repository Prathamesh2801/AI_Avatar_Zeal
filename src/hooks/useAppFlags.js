/**
 * Runtime flags read from the URL.
 *
 * Download is ON by default; a plain link keeps full function. To hide the
 * download button (e.g. a shared display where visitors shouldn't save files):
 *
 *   ?nodownload=1#/        also accepted: ?download=0, ?kiosk=1
 *   #/?nodownload=1        (read once, then remembered — see below)
 *
 * The flag is resolved once on load and cached for the session. With a hash
 * router, navigating replaces the whole hash, so a flag written as
 * `#/?nodownload=1` would be dropped on the first route change. Caching means
 * it survives the flow either way; putting it *before* the hash
 * (`?nodownload=1#/`) additionally keeps it visible in the URL across reloads.
 */
const isOn = (v) => v !== null && v !== "" && v !== "0" && v !== "false";

function computeFlags() {
  if (typeof window === "undefined") return { canDownload: true };

  const hash = window.location.hash || "";
  const hashQuery = hash.includes("?") ? hash.slice(hash.indexOf("?")) : "";

  // Merge both query positions, hash winning where a key appears in each.
  const params = new URLSearchParams(window.location.search || "");
  for (const [k, v] of new URLSearchParams(hashQuery)) params.set(k, v);

  const downloadHidden =
    isOn(params.get("nodownload")) ||
    isOn(params.get("kiosk")) ||
    params.get("download") === "0" ||
    params.get("download") === "false";

  return { canDownload: !downloadHidden };
}

// Resolved at module load, before any in-app navigation can rewrite the hash.
const FLAGS = computeFlags();

export function useAppFlags() {
  return FLAGS;
}
