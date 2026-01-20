import axios from "axios";
import { BASE_URL } from "../../config";

const API_URL = `${BASE_URL}/certificate.php`;

export const generateCertificate = async ({
  name,
  email,
  template,
  unique_id,
}) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("template", template);
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
