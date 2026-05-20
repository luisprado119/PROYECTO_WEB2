"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { verifyToken, type TokenPayload } from "@/lib/serverUtils";
import { useRouter } from "next/navigation";
import {
  associateCestaIdWithUsername,
  deleteCestaByCestaId,
} from "@/lib/db/actions/cesta-actions";

const SELECTED_CART_ID_KEY = "web2_idCesta";

/**
 * Represents the shape of the authentication context.
 */
export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  id: number;
  setId: React.Dispatch<React.SetStateAction<number>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  logout: () => void;
  idCesta: number;
  setIdCesta: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
}

/**
 * Creates the authentication context with undefined as the default value.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to use the authentication context.
 * @throws {Error} If used outside of an AuthProvider.
 * @returns {AuthContextType} The authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AuthProvider component that manages the authentication state.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [id, setId] = useState(0);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  /** 0 = aún no hidratado desde sessionStorage (evita Math.random() distinto SSR/cliente). */
  const [idCesta, setIdCesta] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const idCestaRef = useRef(idCesta);
  idCestaRef.current = idCesta;

  useLayoutEffect(() => {
    let s = sessionStorage.getItem(SELECTED_CART_ID_KEY);
    if (!s) {
      s = String(Math.floor(Math.random() * 1_000_000));
      sessionStorage.setItem(SELECTED_CART_ID_KEY, s);
    }
    setIdCesta(Number(s));
  }, []);

  /**
   * Logs out the user and resets the authentication state.
   */
  const logout = useCallback(() => {
    void deleteCestaByCestaId(String(idCestaRef.current));
    setIsLoggedIn(false);
    setUsername("");
    setId(0);
    setToken("");
    setRole("");
    const nextId = Math.floor(Math.random() * 1_000_000);
    sessionStorage.setItem(SELECTED_CART_ID_KEY, String(nextId));
    setIdCesta(nextId);
    localStorage.removeItem("user");
    router.push("/");
  }, [router]);

  useEffect(() => {
    setLoading(true);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      verifyToken(user.token).then(async (result: { valid: boolean; payload?: TokenPayload }) => {
        if (result.valid && result.payload) {
          setIsLoggedIn(true);
          setUsername(result.payload.username);
          setId(result.payload.id);
          setToken(user.token);
          setRole(result.payload.role);
          await associateCestaIdWithUsername(String(idCestaRef.current), result.payload.username);
          setLoading(false);
        } else {
          logout();
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        loading,
        idCesta,
        setIdCesta,
        isLoggedIn,
        username,
        id,
        token,
        setToken,
        role,
        setRole,
        setIsLoggedIn,
        setUsername,
        setId,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
