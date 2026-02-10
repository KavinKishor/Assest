import { addDays, endOfDay, isWithinInterval, startOfDay, format } from "date-fns";
import { atom } from "jotai";
import type { DateRange } from "react-day-picker";
import { averageTicketsCreated } from "@/data/average-tickets-created";
import type { TicketMetric, Ticket, AssetRequest } from "@/types/types";

const defaultStartDate = addDays(new Date(), -30);

export const dateRangeAtom = atom<DateRange | undefined>({
  from: defaultStartDate,
  to: new Date(),
});

export const ticketsAtom = atom<Ticket[]>([]);
export const assetRequestsAtom = atom<AssetRequest[]>([]);

export const ticketChartDataAtom = atom((get) => {
  const dateRange = get(dateRangeAtom);
  const tickets = get(ticketsAtom);

  if (!dateRange?.from || !dateRange?.to) return [];

  const startDate = startOfDay(dateRange.from);
  const endDate = endOfDay(dateRange.to);

  if (tickets.length > 0) {
    // Group tickets by date
    const grouped = tickets.reduce((acc: Record<string, { created: number; resolved: number }>, ticket) => {
      const date = format(new Date(ticket.createdAt), "yyyy-MM-dd");
      if (!acc[date]) acc[date] = { created: 0, resolved: 0 };
      acc[date].created++;
      if (ticket.currentStatus === "Resolved" || ticket.currentStatus === "Closed") {
        acc[date].resolved++;
      }
      return acc;
    }, {});

    const result: TicketMetric[] = [];
    Object.entries(grouped).forEach(([dateStr, counts]) => {
      const date = new Date(dateStr);
      if (isWithinInterval(date, { start: startDate, end: endDate })) {
        result.push({ date: dateStr, type: "created", count: counts.created });
        result.push({ date: dateStr, type: "resolved", count: counts.resolved });
      }
    });
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }

  // Fallback to mock data if no real data
  return averageTicketsCreated
    .filter((item) => {
      const [year, month, day] = item.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return isWithinInterval(date, { start: startDate, end: endDate });
    })
    .flatMap((item) => {
      const res: TicketMetric[] = [
        {
          date: item.date,
          type: "resolved",
          count: item.resolved,
        },
        {
          date: item.date,
          type: "created",
          count: item.created,
        },
      ];
      return res;
    });
});
