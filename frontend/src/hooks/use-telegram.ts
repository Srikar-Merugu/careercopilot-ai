import { useQuery } from "@tanstack/react-query";
import { telegramService } from "@/services/telegram-service";

export function useTelegramUsers() {
  return useQuery({
    queryKey: ["telegram-users"],
    queryFn: telegramService.getUsers,
  });
}

export function useTelegramUser(telegramId: string) {
  return useQuery({
    queryKey: ["telegram-user", telegramId],
    queryFn: () => telegramService.getUser(telegramId),
    enabled: !!telegramId,
  });
}

export function useTelegramStats() {
  return useQuery({
    queryKey: ["telegram-stats"],
    queryFn: telegramService.getStats,
  });
}

export function useTelegramActivity(limit = 20) {
  return useQuery({
    queryKey: ["telegram-activity", limit],
    queryFn: () => telegramService.getActivity(limit),
  });
}
