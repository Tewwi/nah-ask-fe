import { constantValue } from "./constant";

export const checkErrorField = (error: any) => {
  if (error?.message) {
    return true;
  }

  return false;
};

export const renderErrorMessage = (isError: boolean, message: string) => {
  return isError ? message : "";
};

export const checkFile = (file: File) => {
  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  if (!validImageTypes.includes(file.type)) {
    return "Type file invalid";
  }

  if (file.size > constantValue.limitFileSize) {
    return "File too large";
  }

  return false;
};

export const getErrorMessage = (res: any) => {
  const error = res.data.error;

  if (error) {
    if (error.message) {
      return error.message;
    }
    if (error.email.length > 0) {
      return error.email;
    }
    if (error.password.length > 0) {
      return error.password;
    }
  }

  return null;
};
