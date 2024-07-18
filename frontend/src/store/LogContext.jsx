import { createContext, useState, useEffect } from "react";
import { fetchCurrentUser } from "../utils/api";

export const LogContext = createContext({
  token: "",
  setToken: () => {},
});

export default function LogContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token")??"");

  useEffect(() => {
    fetchCurrentUser(token, setToken);
  }, [token, setToken]);

  const ctxValue = {
    token: token,
    setToken: setToken,
  };

  return (
    <>
      <LogContext.Provider value={ctxValue}>{children}</LogContext.Provider>
    </>
  );
}
