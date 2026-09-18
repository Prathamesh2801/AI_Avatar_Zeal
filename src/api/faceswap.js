import axios from "axios";
import { FACE_SWAP_BASE_URL } from "../../config";

const API_URL = `${FACE_SWAP_BASE_URL}/api.php`;

/**
 * POST { id, source } as multipart form-data.
 *
 * On success the backend replies:
 *   {
 *     success: true,
 *     id: "101",
 *     swap_image:      "Swap/101_….png",   // bare face swap
 *     swap_image_url:  "http://…/Swap/…",
 *     final_image:     "Final/101_….png",  // framed, print-ready
 *     final_image_url: "http://…/Final/…"
 *   }
 *
 * `final_image_url` is what the app shows and downloads. The relative
 * `final_image` is the fallback if the absolute URL is ever missing.
 */
export const faceSwap = async ({ source, id }) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("source", source);

    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      validateStatus: () => true,
      // A swap took ~6s in testing; allow generous headroom on event wifi.
      timeout: 120000,
    });

    const data = response.data;

    // HTTP 200 with `success: false` is still a failure.
    const ok = response.status === 200 && data?.success === true;

    return {
      ok,
      status: response.status,
      data,
      resultImage: ok ? resolveUrl(data.final_image_url || data.final_image) : null,
      error: ok ? null : data?.message || data?.error || null,
    };
  } catch (error) {
    // A CORS block and a genuine network failure are indistinguishable to JS —
    // both surface as a bare "Network Error" with no status. Reaching the host
    // at all tells them apart, and saying which it is saves hunting the wrong
    // problem: a blocked response means the server ran the job fine and the
    // browser refused the reply (see SERVER_CORS.md).
    const timedOut = error.code === "ECONNABORTED";
    const reachable = await hostReachable();

    return {
      ok: false,
      status: 0,
      data: null,
      resultImage: null,
      blocked: !timedOut && reachable,
      error: timedOut
        ? "The server took too long to respond."
        : reachable
          ? "The server replied but the browser blocked it (CORS). " +
            "Check the response headers."
          : "Could not reach the server. Check the connection.",
    };
  }
};

/**
 * Is the host up at all?
 *
 * `no-cors` returns an opaque response we can't read, but it only *resolves*
 * if something answered — which is exactly the signal needed to tell a CORS
 * block (host up, reply refused) from the host being unreachable.
 */
async function hostReachable() {
  try {
    await fetch(`${FACE_SWAP_BASE_URL}/api.php`, {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    return true;
  } catch {
    return false;
  }
}

// Relative paths from the API need the host prefixed to load in an <img>.
function resolveUrl(value) {
  if (typeof value !== "string" || !value) return null;
  return /^(https?:|data:|blob:)/.test(value)
    ? value
    : `${FACE_SWAP_BASE_URL}/${value.replace(/^\/+/, "")}`;
}
