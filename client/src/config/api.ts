import { Platform } from "react-native";
// const HOST = Platform.OS === "web" ? "localhost" : "192.168.10.91"; // web || PC
// DEV
const HOST = Platform.OS === "web" ? "localhost" : Platform.OS === "android" ? "192.168.10.91" : "192.168.178.44"; // android || PC :
// const HOST = "91.99.224.106" // server

const PORT = "3011";

export const API_BASE_URL = `http://${HOST}:${PORT}`;
