// import { Platform } from "react-native";

// // const HOST = Platform.OS === "web" ? "localhost" : "192.168.10.91"; // 91.99.224.106 PC
// // const HOST = Platform.OS === "web" ? "192.168.178.44" : "192.168.10.91"; // 91.99.224.106 PC
// // const HOST = "91.99.224.106" // server
// const HOST = "192.168.178.44"; // m

// export const API_BASE_URL = `http://${HOST}:3011`;

import { Platform } from "react-native";

const HOST = process.env.EXPO_PUBLIC_API_HOST ?? (Platform.OS === "web" ? "localhost" : "192.168.178.44");
const PORT = process.env.EXPO_PUBLIC_API_PORT ?? "3011";

export const API_BASE_URL = `http://${HOST}:${PORT}`;
