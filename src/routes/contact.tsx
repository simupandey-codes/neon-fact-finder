import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TruthLens AI" },
      { name: "description", content: "Get in touch with the TruthLens AI team. Questions, feedback, or collaboration ideas welcome." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent — we'll get back to you soon.");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Toaster richColors position="top-center" />
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Get in <span className="text-gradient">touch</span>
        </h1>
        <p className="text-muted-foreground mt-3">Questions, feedback, or want to collaborate? Drop us a line.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="space-y-4 lg:col-span-1">
          {[
            { icon: Mail, label: "Email", val: "team@truthlens.ai" },
            { icon: Phone, label: "Phone", val: "+91 98765 43210" },
            { icon: MapPin, label: "Campus", val: "Engineering Block, Lab 204" },
          ].map((c) => (
            <div key={c.label} className="glass p-5 flex gap-4 items-center">
              <div className="size-11 rounded-xl flex items-center justify-center bg-[image:var(--gradient-hero)]">
                <c.icon className="size-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <p className="font-medium">{c.val}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="glass p-6 sm:p-8 lg:col-span-2 space-y-4">
          {sent ? (
            <div className="text-center py-12 animate-fade-in">
              <CheckCircle2 className="size-14 mx-auto text-[color:var(--success)]" />
              <h3 className="text-2xl font-bold mt-4">Thanks for reaching out!</h3>
              <p className="text-muted-foreground mt-2">We'll respond within 24 hours.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input required placeholder="Your name" className="mt-1.5" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input required type="email" placeholder="you@example.com" className="mt-1.5" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input required placeholder="What's this about?" className="mt-1.5" />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea required placeholder="Tell us more..." className="mt-1.5 min-h-[140px]" />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                <Send /> Send message
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
