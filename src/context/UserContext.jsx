import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getUserByID } from "../helpers/apiHelpers";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseClient";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch and set user data
  const fetchUserData = useCallback(async (user) => {
    if (user) {
      try {
        const data = await getUserByID(user.uid);
        setUserData(data);
        localStorage.setItem("userData", JSON.stringify(data));
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        // Optionally handle error, e.g., clear user data if fetching fails
        setUserData(null);
        localStorage.removeItem("userData");
      }
    } else {
      // If user is null (logged out), clear data
      setUserData(null);
      localStorage.removeItem("userData");
    }
  }, []);

  // New: Function to trigger a refresh
  const refreshUserData = useCallback(async () => {
    setLoading(true);
    const user = auth.currentUser;
    await fetchUserData(user);
    setLoading(false);
  }, [fetchUserData]);

  // New: Function to clear user data
  const clearUserData = useCallback(() => {
    setUserData(null);
    localStorage.removeItem("userData");
    setLoading(false); // No longer loading user data as it's cleared
  }, []);

  // Recuperar desde localStorage al iniciar (initial load)
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  // Escuchar autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true); // Set loading before fetching/clearing
      await fetchUserData(user); // Handles both login and logout states by calling clearUserData internally
      setLoading(false); // Set loading after fetching/clearing
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  return (
    // Add clearUserData to the context value
    <UserContext.Provider value={{ userData, setUserData, loading, refreshUserData, clearUserData }}>
      {!loading && children}
    </UserContext.Provider>
  );
};