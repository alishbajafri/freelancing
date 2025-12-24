// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { storageGet, storageSet, storageRemove } from "@/utils/storage";
import { API_BASE_URL } from "@/config";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "freelancer" | "client";
  isVerified: boolean;
  skills?: string[];
  rating?: number;
  balance?: number;
  bio?: string;
  pricing?: string;
  phone?: string;
  location?: string;
  title?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 LOAD USER FROM STORAGE ON APP START
  useEffect(() => {
    const loadUser = async () => {
      try {
        // 1️⃣ Load stored user
        const savedUser = await storageGet("user");
        if (savedUser) setUser(JSON.parse(savedUser));

        // 2️⃣ Check token to fetch full profile
        const token = await storageGet("token");
        if (token) {
          const res = await fetch(`${API_BASE_URL}/users/me`, {
            headers: { "Authorization": `Bearer ${token}` },
          });
          const fullUser = await res.json();
          if (res.ok && fullUser) {
            setUser(fullUser);
            await storageSet("user", JSON.stringify(fullUser));
          }
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);


//yeh tak chal raha hai 
  // 🔥 REAL LOGIN
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // 1️⃣ Login to get token
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const { token } = data;

      await storageSet("token", token);

      // 2️⃣ Fetch full user profile using token
      const profileRes = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      const fullUser = await profileRes.json();

      if (!profileRes.ok) {
        throw new Error(fullUser.message || "Failed to load user profile");
      }

      await storageSet("user", JSON.stringify(fullUser));
      setUser(fullUser); // ← full user info with skills, bio, etc.

    } finally {
      setIsLoading(false);
    }
  };


  // 🔥 LOGOUT
  const logout = async () => {
    setIsLoading(true);          // show spinner while logging out
    try {
      await storageRemove("token");
      await storageRemove("user");
      setUser(null);             // reset user context
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);       // stop spinner
    }
  };


  // 🔥 UPDATE PROFILE
  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;

    const updated = { ...user, ...userData };

    await storageSet("user", JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
