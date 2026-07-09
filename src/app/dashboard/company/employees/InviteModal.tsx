"use client";

import { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { Link2, Copy, Check, Mail, Clock, X } from "lucide-react";
import {
  createInvitationAction,
  getCompanyInvitationsAction,
  revokeInvitationAction,
} from "@/app/actions/invitations.actions";
import type { Invitation } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function InviteModal({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingInvites, setPendingInvites] = useState<Invitation[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  const prevOpen = useRef(open);
  useEffect(() => {
    // Only trigger when the modal transitions from closed → open
    if (open && !prevOpen.current) {
      setEmail("");
      setInviteUrl(null);
      setError(null);
      loadInvites();
    }
    prevOpen.current = open;
  }, [open]);

  async function loadInvites() {
    setLoadingInvites(true);
    const result = await getCompanyInvitationsAction();
    if (result.success && result.data) {
      setPendingInvites(
        result.data.filter((i) => i.status === "pending")
      );
    }
    setLoadingInvites(false);
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setInviteUrl(null);

    const formData = new FormData();
    if (email.trim()) formData.append("email", email.trim());

    const result = await createInvitationAction(formData);
    if (result.success && result.data) {
      setInviteUrl(result.data.inviteUrl);
      await loadInvites();
    } else {
      setError(result.error ?? "Failed to create invitation.");
    }
    setLoading(false);
  }

  async function handleCopy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRevoke(inviteId: string) {
    await revokeInvitationAction(inviteId);
    await loadInvites();
  }

  function formatExpiry(expiresAt: string): string {
    const days = Math.max(
      0,
      Math.ceil(
        (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    );
    return days === 0 ? "Expires today" : `${days} day${days === 1 ? "" : "s"} left`;
  }

  return (
    <Modal open={open} onClose={onClose} title="Invite employee" size="md">
      <div className="space-y-5">
        <p className="text-sm text-ink-light">
          Generate a one-time invite link. Share it with your team member — they
          will create an account and be automatically linked to your company.
        </p>

        {/* Email input */}
        <div>
          <Input
            label="Email (optional)"
            type="email"
            placeholder="colleague@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hint="Pre-fills the registration form for your colleague."
          />
        </div>

        {/* Generate button */}
        <Button
          variant="primary"
          size="md"
          className="w-full"
          loading={loading}
          onClick={handleGenerate}
          leftIcon={<Link2 className="h-4 w-4" />}
        >
          Generate invite link
        </Button>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Generated link */}
        {inviteUrl && (
          <div
            className="rounded-2xl border p-4 space-y-3"
            style={{
              backgroundColor: "#ECFDF5",
              borderColor: "rgba(5,150,105,0.2)",
            }}
          >
            <p className="text-xs font-mono tracking-wide text-emerald-bright uppercase">
              Invite link ready
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm text-emerald-deep break-all bg-white rounded-lg px-3 py-2 border border-emerald-light/40">
                {inviteUrl}
              </code>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                leftIcon={
                  copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )
                }
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-emerald-mid">
              This link expires in 7 days and can only be used once.
            </p>
          </div>
        )}

        {/* Pending invitations */}
        <div>
          <h4 className="text-sm font-medium text-ink mb-2">
            Pending invitations
          </h4>
          {loadingInvites ? (
            <div className="py-4 flex justify-center">
              <Spinner size="sm" />
            </div>
          ) : pendingInvites.length === 0 ? (
            <p className="text-sm text-ink-light italic">No pending invitations.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pendingInvites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border"
                  style={{
                    backgroundColor: "#FEF9EF",
                    borderColor: "rgba(6,78,59,0.08)",
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-ink-light flex-shrink-0" />
                      <span className="text-sm text-ink truncate">
                        {inv.email || "No email specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="h-3 w-3 text-ink-light/60" />
                      <span className="text-xs text-ink-light/60">
                        {formatExpiry(inv.expires_at)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevoke(inv.id)}
                    className="p-1.5 rounded-lg text-ink-light hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0"
                    title="Revoke invitation"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
