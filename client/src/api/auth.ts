import { API_BASE_URL } from "../config/api";

export type User = {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "employee";
};

export type LoginResponse = {
    token: string;
    user: User;
};

export async function loginUser(input: { email: string; password: string }): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message ?? `Login fehlgeschlagen: ${res.status}`);
    return data;
}
