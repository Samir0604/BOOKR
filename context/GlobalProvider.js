import { createContext, useContext } from "react";
import { getCurrentUser } from "@/lib/appwrite";
import { useState, useEffect } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      if (res) {
        setIsLoggedIn(true);
        setUser(res);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);



  return <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}>{children}
  </GlobalContext.Provider>;
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}

