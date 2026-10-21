import axios from "axios";

const uploadToCloudinary = async (file, folder = "StayEase/properties") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await axios.post("/api/upload/upload-image", formData);

  return res.data.url;
};

const uploadProfileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("/api/upload/upload-profile-image", formData);

  return res.data.url;
};

export { uploadToCloudinary, uploadProfileToCloudinary };
