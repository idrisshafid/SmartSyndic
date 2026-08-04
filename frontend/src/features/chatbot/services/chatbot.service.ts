import api from "@/config/api";
import type { ChatbotSearchResponse } from "../types/chatbot.types";

export const searchApartments = async (message: string): Promise<ChatbotSearchResponse> => {
  const { data } = await api.post<ChatbotSearchResponse>("/chatbot/search", { message });
  return data;
};