/**
 * /dev/components — visual sandbox for all UI primitives
 * DELETE before Phase 15 (production launch)
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner, Avatar, Skeleton } from "@/components/ui/Spinner";
import { Plus, ArrowRight, Mail, Lock } from "lucide-react";

export default function ComponentsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory p-8">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div>
          <p className="text-xs font-mono tracking-widest text-ink-light uppercase mb-2">Design system</p>
          <h1 className="font-serif text-display-md text-emerald-deep">Component sandbox</h1>
          <p className="text-ink-light mt-1 text-sm">All UI primitives — delete this page before production.</p>
        </div>

        {/* Typography */}
        <section>
          <SectionLabel>Typography</SectionLabel>
          <div className="space-y-3">
            <p className="font-serif text-display-xl text-emerald-deep">Display XL — Cormorant</p>
            <p className="font-serif text-display-md text-emerald-deep italic">Display MD italic</p>
            <p className="font-serif text-display-sm text-emerald-mid">Display SM</p>
            <p className="font-sans text-base text-ink">Body text — DM Sans regular. EcoTap connects people.</p>
            <p className="font-sans text-sm text-ink-light font-light">Small light text for subtitles and hints.</p>
            <p className="font-mono text-sm text-ink-mid tracking-wide">Mono text — ORDER-2024-001</p>
          </div>
        </section>

        {/* Colors */}
        <section>
          <SectionLabel>Color tokens</SectionLabel>
          <div className="flex flex-wrap gap-3">
            {[
              ["bg-emerald-deep",   "Emerald deep"],
              ["bg-emerald-mid",    "Emerald mid"],
              ["bg-emerald-bright", "Emerald bright"],
              ["bg-emerald-light",  "Emerald light"],
              ["bg-emerald-pale",   "Emerald pale"],
              ["bg-ivory",          "Ivory"],
              ["bg-cream",          "Cream"],
              ["bg-cream-dark",     "Cream dark"],
              ["bg-gold",           "Gold"],
              ["bg-gold-light",     "Gold light"],
              ["bg-gold-pale",      "Gold pale"],
            ].map(([cls, label]) => (
              <div key={cls} className="flex flex-col items-center gap-1">
                <div className={`w-14 h-14 rounded-xl border border-cream-dark shadow-card ${cls}`} />
                <span className="text-[10px] font-mono text-ink-light">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section>
          <SectionLabel>Buttons</SectionLabel>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="gold">Gold</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>With icon</Button>
            <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>Continue</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">XL</Button>
          </div>
        </section>

        {/* Badges */}
        <section>
          <SectionLabel>Badges</SectionLabel>
          <div className="flex flex-wrap gap-3">
            <Badge variant="pending">Pending</Badge>
            <Badge variant="active">Active</Badge>
            <Badge variant="suspended">Suspended</Badge>
            <Badge variant="approved">Approved</Badge>
            <Badge variant="shipped">Shipped</Badge>
            <Badge variant="delivered">Delivered</Badge>
            <Badge variant="draft">Draft</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <SectionLabel>Form fields</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
            <Input label="Email address" placeholder="you@company.com" type="email" required leftElement={<Mail className="h-4 w-4" />} />
            <Input label="Password" placeholder="••••••••" type="password" required leftElement={<Lock className="h-4 w-4" />} />
            <Input label="With error" placeholder="Type here" error="This field is required." />
            <Input label="With hint" placeholder="yourname" hint="This will be your public URL slug." />
            <Select
              label="Company size"
              placeholder="Select size"
              options={[
                { value: "1-10", label: "1–10 employees" },
                { value: "11-50", label: "11–50 employees" },
                { value: "51-200", label: "51–200 employees" },
              ]}
            />
            <Textarea label="Bio" placeholder="Tell visitors about yourself..." className="max-w-xs" />
          </div>
        </section>

        {/* Cards */}
        <section>
          <SectionLabel>Cards</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Default card</CardTitle>
                <CardDescription>With header, content, and footer.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-ink-mid">Card body content goes here.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="secondary">Cancel</Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
            <Card hover shadow="md">
              <CardTitle>Hoverable card</CardTitle>
              <p className="text-sm text-ink-light mt-2">Lifts on hover with a larger shadow.</p>
            </Card>
            <Card padding="lg" shadow="lg">
              <CardTitle>Large padding</CardTitle>
              <p className="text-sm text-ink-light mt-2">More breathing room for featured content.</p>
            </Card>
          </div>
        </section>

        {/* Avatars */}
        <section>
          <SectionLabel>Avatars</SectionLabel>
          <div className="flex flex-wrap items-end gap-4">
            <Avatar name="Ntwali Frankie" size="xs" />
            <Avatar name="Ntwali Frankie" size="sm" />
            <Avatar name="Ntwali Frankie" size="md" />
            <Avatar name="Ntwali Frankie" size="lg" />
            <Avatar name="Ntwali Frankie" size="xl" />
          </div>
        </section>

        {/* Spinners */}
        <section>
          <SectionLabel>Spinners</SectionLabel>
          <div className="flex items-center gap-6">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </section>

        {/* Skeletons */}
        <section>
          <SectionLabel>Skeletons</SectionLabel>
          <div className="space-y-2 max-w-xs">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-4 rounded-xl" />
          </div>
        </section>

        {/* Modal */}
        <section>
          <SectionLabel>Modal</SectionLabel>
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Confirm action"
            description="This action cannot be undone. Are you sure you want to continue?"
          >
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setModalOpen(false)}>Delete</Button>
            </div>
          </Modal>
        </section>

      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-mono font-medium tracking-widest text-ink-light uppercase mb-4 pb-2 border-b border-cream-dark">
      {children}
    </h2>
  );
}
