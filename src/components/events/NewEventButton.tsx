"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CalendarPlus } from "lucide-react";
import { NewEventModal } from "./NewEventModal";

export function NewEventButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<CalendarPlus className="h-3.5 w-3.5" />}
        onClick={() => setModalOpen(true)}
      >
        New event
      </Button>
      <NewEventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => router.refresh()}
      />
    </>
  );
}
