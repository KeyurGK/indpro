import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useCookie = (cookieName) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = () => {
      const storedToken = Cookies.get(cookieName);
      setToken(storedToken || null);
    };

    fetchToken();
  }, [cookieName]);

  return token;
};

export default useCookie;