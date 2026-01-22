import axios from "axios";
import { FACE_SWAP_BASE_URL } from "../../config";

const API_URL = `${FACE_SWAP_BASE_URL}/faceswap`;

export const faceSwap = async ({
  source_image, // File object
  model_id,
  unique_id,
}) => {
  try {
    const formData = new FormData();
    formData.append("source_image", source_image);
    formData.append("model_id", model_id);
    formData.append("unique_id", unique_id);

    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      validateStatus: () => true, // 🔑 important
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    // Network / CORS / unexpected failure
    return {
      status: 0,
      error: error.message || "Network Error",
    };
  }
};
