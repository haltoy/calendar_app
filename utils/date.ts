import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ja } from "date-fns/locale/ja";

export const getMonthLabel = (date: Date) =>
  format(date, "yyyy年M月", { locale: ja });

export const getDateKey = (date: Date) => format(date, "yyyy-MM-dd");

export const buildMonthDays = (baseDate: Date) => {
  const monthStart = startOfMonth(baseDate);
  const monthEnd = endOfMonth(baseDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let current = calendarStart;

  while (current <= calendarEnd) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
};
