import axios from "axios";

const googleApi = axios.create({
  baseURL: "/api/user",
});

export const googleAuth = (code) => {
  return googleApi.post("/googleAuth", { code });
};
