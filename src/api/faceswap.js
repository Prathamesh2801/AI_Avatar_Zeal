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
    // Network / CORS / timeout
    return {
      ok: false,
      status: 0,
      data: null,
      resultImage: null,
      error: error.message || "Network Error",
    };
  }
};

// Relative paths from the API need the host prefixed to load in an <img>.
function resolveUrl(value) {
  if (typeof value !== "string" || !value) return null;
  return /^(https?:|data:|blob:)/.test(value)
    ? value
    : `${FACE_SWAP_BASE_URL}/${value.replace(/^\/+/, "")}`;
}
