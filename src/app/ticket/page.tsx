import Tickets from "@/components/tickets";
import { Suspense } from "react";

export default function TicketPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <Tickets />
      </Suspense>
    </main>
  );
}
