import axios from "axios";
import { IcCreateAttributes } from "@backend/types/types.ts";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Your API base URL
});
