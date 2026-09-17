/**
 * Save a remote image to the device.
 *
 * The platforms differ enough that one path doesn't cover both:
 *
 * - Android / desktop: an <a download> pointing at a blob: URL saves silently
 *   to the Downloads folder. This is the reliable path there.
 * - iOS Safari: ignores the `download` attribute, so that same anchor just
 *   navigates to the image and the user has to long-press it. The share sheet
 *   ("Save Image") is the only way to get it into Photos, so iOS goes there
 *   first and only falls back to opening the image in a tab.
 *
 * Returns "saved" | "shared" | "opened" so the caller can tell the user what
 * actually happened, or throws if nothing worked.
 */

const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iP(hone|ad|od)/.test(navigator.platform || "") ||
    // iPadOS 13+ reports as a Mac, distinguished by touch support.
    (/Mac/.test(navigator.platform || "") && navigator.maxTouchPoints > 1));

function filenameFor(url, type) {
  const fromUrl = url.split("/").pop()?.split("?")[0];
  if (fromUrl && /\.(png|jpe?g|webp)$/i.test(fromUrl)) return fromUrl;
  const ext = (type?.split("/")[1] || "png").replace("jpeg", "jpg");
  return `avatar_${Date.now()}.${ext}`;
}

function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoking immediately can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export async function saveImage(imageUrl) {
  if (!imageUrl) throw new Error("No image to save");

  // Fetching gives us a same-origin blob, which is what makes both the
  // download attribute and file sharing work on a cross-origin image.
  let blob;
  try {
    const res = await fetch(imageUrl, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    blob = await res.blob();
  } catch {
    // CORS blocked or offline — opening the image still lets the user
    // long-press to save it.
    window.open(imageUrl, "_blank", "noopener");
    return "opened";
  }

  const name = filenameFor(imageUrl, blob.type);
  const file = new File([blob], name, { type: blob.type || "image/png" });

  if (isIOS()) {
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return "shared";
      } catch (err) {
        // User dismissed the sheet — that's a deliberate cancel, not a failure.
        if (err?.name === "AbortError") return "shared";
      }
    }
    // Older iOS: open it so the image can be long-pressed and saved.
    window.open(imageUrl, "_blank", "noopener");
    return "opened";
  }

  saveBlob(blob, name);
  return "saved";
}

export { isIOS };
