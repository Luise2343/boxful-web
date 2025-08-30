export const auth = {
  save(token: string, user: unknown) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },
  token() {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  },
  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};
