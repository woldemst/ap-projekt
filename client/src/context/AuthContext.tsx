import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, User } from "../api/auth";
import { Alert, Platform } from "react-native";

type AuthContextValue = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!token && !!user;

    useEffect(() => {
        loadStoredAuth();
    }, []);

    async function loadStoredAuth() {
        try {
            const [storedToken, storedUser] = await Promise.all([AsyncStorage.getItem("authToken"), AsyncStorage.getItem("userData")]);

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("Failed to load auth data", err);
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string) {
        const data = await loginUser({ email, password });

        await Promise.all([AsyncStorage.setItem("authToken", data.token), AsyncStorage.setItem("userData", JSON.stringify(data.user))]);

        setToken(data.token);
        setUser(data.user);
    }

    async function logout() {
        if (Platform.OS === "web") {
            if (window.confirm("Möchten Sie wirklish ausloggen?")) {
                await Promise.all([AsyncStorage.removeItem("authToken"), AsyncStorage.removeItem("userData")]);

                setToken(null);
                setUser(null);
            }
        }
        Alert.alert("Ausloggen", "Möchten Sie wirklish ausloggen?", [
            {
                text: "Ablehnen",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
            },
            {
                text: "Ausloggen",
                onPress: async () => {
                    await Promise.all([AsyncStorage.removeItem("authToken"), AsyncStorage.removeItem("userData")]);

                    setToken(null);
                    setUser(null);
                },
            },
        ]);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}
