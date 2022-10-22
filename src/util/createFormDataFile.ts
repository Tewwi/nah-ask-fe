export const createFormData = (
  file: File,
  signature: string,
  timestamp: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  if (process.env.REACT_APP_CLOUDINARY_KEY) {
    formData.append("api_key", process.env.REACT_APP_CLOUDINARY_KEY);
  }
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);

  return formData;
};
