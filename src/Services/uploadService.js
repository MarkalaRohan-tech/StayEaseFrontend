import axios from "axios";

const uploadToS3 = async (file) => {
  const res = await axios.get("/api/upload/get-presigned-url", {
    params: {
      fileName: file.name,
      fileType: file.type,
    },
  });

  const { uploadUrl, fileUrl } = res.data;

    
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  // 3. Return public file URL
  return fileUrl;
};

export { uploadToS3 };