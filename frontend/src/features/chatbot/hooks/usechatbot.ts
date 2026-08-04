import { useMutation } from "@tanstack/react-query";
import { searchApartments } from "../services/chatbot.service";

export const useChatbotSearch = () => {
  return useMutation({
    mutationFn: (message: string) => searchApartments(message),
  });
};