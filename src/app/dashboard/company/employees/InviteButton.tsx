"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { UserPlus } from "lucide-react";
import { InviteModal } from "./InviteModal";

export function InviteButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<UserPlus className="h-3.5 w-3.5" />}
        onClick={() => setModalOpen(true)}
      >
        Invite employee
      </Button>
      <InviteModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
