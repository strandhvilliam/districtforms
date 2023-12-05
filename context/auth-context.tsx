import { createContext, useContext, useEffect, useState } from "react";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { useRouter } from "next/navigation";

type AuthContextType = {
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
};

const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  token: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    console.log("logging in");
    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const body = await res.json();
      console.log("body", body);
      if (!body.token) {
        return;
      }

      if (body.status !== "200") {
        return;
      }
      setToken(body.token);
      setIsAuthenticated(true);
      localStorage.setItem("auth-token", body.token);
      router.replace("/dashboard/upload");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth-token");
    return;
  };

  useEffect(() => {
    console.log("checking auth");
    const savedToken = localStorage.getItem("auth-token");
    if (!savedToken) {
      setIsAuthenticated(false);
      router.replace("/login");
      return;
    } else {
      const decoded: any = jwt.decode(savedToken);
      console.log("decoded", decoded);
      if (!decoded) {
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem("auth-token");
        router.replace("/login");
        return;
      }
      if (Date.now() >= decoded.exp * 1000) {
        console.log("token expired");
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem("auth-token");
        router.replace("/login");
      } else {
        setToken(savedToken);
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
}
