"use client";

import { useEffect, useState } from "react";
import {
  AverageTicketsCreated,
  Conversions,
  CustomerSatisfication,
  Metrics,
  TicketByChannels,
} from "@/components/chart-blocks";
import Container from "@/components/container";
import EmployeeDashboard from "@/components/dashboard/employee-dashboard";
import { useSetAtom } from "jotai";
import { ticketsAtom, assetRequestsAtom } from "@/lib/atoms";

export default function Home() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [fetchingUser, setFetchingUser] = useState(true);
  const setTickets = useSetAtom(ticketsAtom);
  const setAssetRequests = useSetAtom(assetRequestsAtom);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        // Silently handle error
      } finally {
        setFetchingUser(false);
      }
    };

    const fetchData = async () => {
      try {
        const [ticketsRes, assetRequestsRes] = await Promise.all([
          fetch("/api/tickets"),
          fetch("/api/asset-requests")
        ]);

        if (ticketsRes.ok) {
          const tickets = await ticketsRes.json();
          setTickets(tickets);
        }

        if (assetRequestsRes.ok) {
          const assetRequests = await assetRequestsRes.json();
          setAssetRequests(assetRequests);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchUser();
    fetchData();
  }, [setTickets, setAssetRequests]);

  if (fetchingUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user?.role === "employee") {
    return <EmployeeDashboard user={user} />;
  }

  return (
    <div>
      <Metrics />
      <div className="grid grid-cols-1 divide-y border-b border-border laptop:grid-cols-3 laptop:divide-x laptop:divide-y-0 laptop:divide-border">
        <Container className="py-4 laptop:col-span-2">
          <AverageTicketsCreated />
        </Container>
        <Container className="py-4 laptop:col-span-1">
          <Conversions />
        </Container>
      </div>
      <div className="grid grid-cols-1 divide-y border-b border-border laptop:grid-cols-2 laptop:divide-x laptop:divide-y-0 laptop:divide-border">
        <Container className="py-4 laptop:col-span-1">
          <TicketByChannels />
        </Container>
        <Container className="py-4 laptop:col-span-1">
          <CustomerSatisfication />
        </Container>
      </div>
    </div>
  );
}
