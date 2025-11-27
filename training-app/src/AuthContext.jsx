// AuthContext.js
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_role");
    const fn = localStorage.getItem("user_fn");
    const ln = localStorage.getItem("user_ln");
    const id = localStorage.getItem("user_id");

    return token && role
      ? { token, user_role: role, user_fn: fn, user_ln: ln, user_id: id }
      : null;
  });

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user_role", userData.user_role);
    localStorage.setItem("user_fn", userData.user_fn);
    localStorage.setItem("user_ln", userData.user_ln);
    localStorage.setItem("user_id", userData.user_id);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
