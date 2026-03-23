import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";
import { Supplier } from "./suppliers";

export type Report = {
    _id: string;
    title: string;
    description?: string;
    supplierId: string | Supplier;
    createdByUserId?: string;
    createdByName?: string;
    createdByEmail: string;
    updatedByEmail?: string;
    updateNotes?: string;
    status: "OK" | "DEFECT";
    createdAt: string;
    images?: string[];
};

export async function fetchReports(): Promise<Report[]> {
    const res = await fetch(`${API_BASE_URL}/api/reports`);
    if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`);
    return res.json();
}

export async function fetchReportsBySupplierId(id: string): Promise<Report[]> {
    const res = await fetch(`${API_BASE_URL}/api/reports/supplier/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch reports by supplier id: ${res.status}`);
    return res.json();
}

export async function fetchReportsById(id: string): Promise<Report> {
    const res = await fetch(`${API_BASE_URL}/api/reports/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch reports by id: ${res.status}`);
    return res.json();
}

export async function getGeneratedPDF(id: string): Promise<Report> {
    const res = await fetch(`${API_BASE_URL}/api/reports/${id}/pdf`);
    if (!res.ok) throw new Error(`Failed to fetch report's PDF: ${res.status}`);
    return res.json();
}

export async function updateReport(
    id: string,
    input: {
        title?: string;
        updateNotes: string;
        description?: string;
        supplierId?: string;
        updatedByEmail?: string;
        status?: "OK" | "DEFECT";
    },
): Promise<Report> {
    const res = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) throw new Error(data?.message ?? data?.error ?? `Failed to update report: ${res.status}`);

    return data;
}

export async function createReport(input: {
    title: string;
    description?: string;
    supplierId: string;
    status: "OK" | "DEFECT";
    images?: string[];
}): Promise<Report> {
    const res = await fetch(`${API_BASE_URL}/api/reports`, {
        method: "POST",
        headers: await getAuthHeaders(),
        body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) throw new Error(data?.message ?? data?.error ?? `Failed to create report: ${res.status}`);

    return data;
}

async function getAuthHeaders() {
    const token = await AsyncStorage.getItem("authToken");

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}
