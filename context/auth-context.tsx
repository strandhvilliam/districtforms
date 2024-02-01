import { createContext, useContext, useEffect, useState } from "react";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { useRouter } from "next/navigation";
import { toast, useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
};

const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: false,
  token: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    console.log("logging in");
    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    const body = await res.json();

    console.log("body", body);

    if (body.status !== 200 || !body.token) {
      toast({
        title: "Inloggning misslyckades",
        description: "Felaktigt användarnamn eller lösenord",
      });
      setIsLoading(false);
      return;
    }

    setToken(body.token);
    setIsAuthenticated(true);
    localStorage.setItem("auth-token", body.token);
    setIsLoading(false);
    router.replace("/dashboard/upload");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth-token");
    return;
  };

  useEffect(() => {
    setIsLoading(true);
    console.log("checking auth");
    const savedToken = localStorage.getItem("auth-token");
    console.log("savedToken", savedToken);
    if (!savedToken) {
      setIsAuthenticated(false);
      router.replace("/login");
      setIsLoading(false);
      return;
    } else {
      const decoded: any = jwt.decode(savedToken);
      console.log("decoded", decoded);
      if (!decoded) {
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem("auth-token");
        router.replace("/login");
        setIsLoading(false);
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
    setIsLoading(false);
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ login, isLoading, logout, isAuthenticated, token }}
    >
      {children}
    </AuthContext.Provider>
  );
}
