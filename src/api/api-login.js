import api from "./api-base";

export const loginApi = {
  login: () => api.post("login"),
  signUp: () => api.post(signUp),
};
