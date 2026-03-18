"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  MapPin,
  Send,
  Github,
  Linkedin,
  BookOpen,
  CheckCircle,
  Loader2,
  MessageSquare,
  Briefcase,
  Clock,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Heart,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Project type options ── */
const projectTypes = [
  {
    id: "ml-model",
    label: "ML / AI Model",
    icon: Sparkles,
    description: "Custom model training, fine-tuning, or deployment",
  },
  {
    id: "signal-processing",
    label: "Signal Processing",
    icon: Zap,
    description: "DSP pipelines, audio/image analysis, filtering",
  },
  {
    id: "web-app",
    label: "Web Application",
    icon: Briefcase,
    description: "Full-stack web app, dashboard, or API",
  },
  {
    id: "research",
    label: "Research Collab",
    icon: BookOpen,
    description: "Joint research, paper co-authorship, academic work",
  },
  {
    id: "data-analysis",
    label: "Data Analysis",
    icon: BarChart3,
    description: "Data pipelines, visualization, statistical modeling",
  },
  {
    id: "consultation",
    label: "Consultation",
    icon: MessageSquare,
    description: "Technical advice, code review, architecture",
  },
  {
    id: "other",
    label: "Other / Say Hi",
    icon: Heart,
    description: "Something else entirely — I'm all ears!",
  },
];

const budgetRanges = [
  "Not sure yet",
  "< $500",
  "$500 – $2,000",
  "$2,000 – $5,000",
  "$5,000+",
  "Let's discuss",
];

const timelineOptions = [
  "ASAP",
  "1 – 2 weeks",
  "1 month",
  "2 – 3 months",
  "Flexible",
];

interface ContactProps {
  settings?: {
    email?: string | null;
    github?: string | null;
    linkedin?: string | null;
    scholar?: string | null;
  };
}

export function ContactSection({ settings }: ContactProps) {
  const [step, setStep] = useState(0); // 0: type select, 1: details, 2: message
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">(
    "idle"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    timeline: "",
    subject: "",
    message: "",
  });

  const selectedType = projectTypes.find((t) => t.id === formData.projectType);
  const isSimpleMessage =
    formData.projectType === "other" || formData.projectType === "consultation";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");

    // Compose a rich message body that fits existing DB schema
    const fullMessage = [
      formData.message,
      "",
      "--- Project Details ---",
      `Type: ${selectedType?.label || "N/A"}`,
      ...(formData.budget && !isSimpleMessage
        ? [`Budget: ${formData.budget}`]
        : []),
      ...(formData.timeline && !isSimpleMessage
        ? [`Timeline: ${formData.timeline}`]
        : []),
    ].join("\n");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject:
            formData.subject ||
            `${selectedType?.label || "General"} inquiry`,
          message: fullMessage,
        }),
      });

      if (response.ok) {
        setFormState("sent");
        setFormData({
          name: "",
          email: "",
          projectType: "",
          budget: "",
          timeline: "",
          subject: "",
          message: "",
        });
      } else {
        setFormState("idle");
      }
    } catch {
      setFormState("idle");
    }
  };

  const canProceedStep0 = formData.projectType !== "";
  const canProceedStep1 = formData.name !== "" && formData.email !== "";
  const canSubmit = formData.message.trim().length > 0;

  const stepVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Have a project idea, research collaboration, or just want to say
            hello? Tell me about it and I&apos;ll get back to you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* ── Left: Contact info ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Info card */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Let&apos;s build something together
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Whether it&apos;s an ML pipeline, a signal processing
                  solution, or a full-stack app — I&apos;d love to hear about
                  your project.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${settings?.email || "emmanuel@example.com"}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-sm font-medium truncate">
                      {settings?.email || "emmanuel@example.com"}
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                      Location
                    </p>
                    <p className="text-sm font-medium">Ghana</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                      Response time
                    </p>
                    <p className="text-sm font-medium">Within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3">
                  Find me online
                </p>
                <div className="flex gap-2">
                  {[
                    {
                      href: settings?.github || "https://github.com",
                      icon: Github,
                      label: "GitHub",
                    },
                    {
                      href: settings?.linkedin || "https://linkedin.com",
                      icon: Linkedin,
                      label: "LinkedIn",
                    },
                    {
                      href:
                        settings?.scholar || "https://scholar.google.com",
                      icon: BookOpen,
                      label: "Scholar",
                    },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200"
                    >
                      <social.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Multi-step form ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Step indicator */}
              <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  {[0, 1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                      <div
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-500 flex-1",
                          s <= step
                            ? "bg-primary"
                            : "bg-muted"
                        )}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Step {step + 1} of 3 —{" "}
                  {step === 0
                    ? "What do you need?"
                    : step === 1
                    ? "Your details"
                    : "Tell me more"}
                </p>
              </div>

              {/* Sent state */}
              {formState === "sent" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 sm:p-12 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message sent!</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Thanks for reaching out. I&apos;ll review your message and
                    get back to you within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setFormState("idle");
                      setStep(0);
                    }}
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <AnimatePresence mode="wait">
                      {/* ── Step 0: Project type ── */}
                      {step === 0 && (
                        <motion.div
                          key="step-0"
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25 }}
                        >
                          <h3 className="text-base sm:text-lg font-semibold mb-4">
                            What can I help you with?
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {projectTypes.map((type) => {
                              const isActive =
                                formData.projectType === type.id;
                              return (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      projectType: type.id,
                                    })
                                  }
                                  className={cn(
                                    "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200",
                                    isActive
                                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                      : "border-border hover:border-primary/30 hover:bg-muted/50"
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "shrink-0 flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                                      isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    )}
                                  >
                                    <type.icon className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p
                                      className={cn(
                                        "text-sm font-medium",
                                        isActive && "text-primary"
                                      )}
                                    >
                                      {type.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                      {type.description}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* ── Step 1: Contact info + project params ── */}
                      {step === 1 && (
                        <motion.div
                          key="step-1"
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          <h3 className="text-base sm:text-lg font-semibold mb-1">
                            Your details
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label
                                htmlFor="name"
                                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                              >
                                Name *
                              </label>
                              <Input
                                id="name"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    name: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label
                                htmlFor="email"
                                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                              >
                                Email *
                              </label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    email: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label
                              htmlFor="subject"
                              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                            >
                              Subject
                            </label>
                            <Input
                              id="subject"
                              placeholder={`e.g. "${selectedType?.label || "Project"} for my startup"`}
                              value={formData.subject}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  subject: e.target.value,
                                })
                              }
                            />
                          </div>

                          {/* Budget + Timeline — only for project types */}
                          {!isSimpleMessage && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  Budget range
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                  {budgetRanges.map((b) => (
                                    <button
                                      key={b}
                                      type="button"
                                      onClick={() =>
                                        setFormData({
                                          ...formData,
                                          budget:
                                            formData.budget === b ? "" : b,
                                        })
                                      }
                                      className={cn(
                                        "px-2.5 py-1 text-[11px] rounded-md border transition-all",
                                        formData.budget === b
                                          ? "border-primary bg-primary/10 text-primary font-medium"
                                          : "border-border text-muted-foreground hover:border-primary/30"
                                      )}
                                    >
                                      {b}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Timeline
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                  {timelineOptions.map((t) => (
                                    <button
                                      key={t}
                                      type="button"
                                      onClick={() =>
                                        setFormData({
                                          ...formData,
                                          timeline:
                                            formData.timeline === t ? "" : t,
                                        })
                                      }
                                      className={cn(
                                        "px-2.5 py-1 text-[11px] rounded-md border transition-all",
                                        formData.timeline === t
                                          ? "border-primary bg-primary/10 text-primary font-medium"
                                          : "border-border text-muted-foreground hover:border-primary/30"
                                      )}
                                    >
                                      {t}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* ── Step 2: Message ── */}
                      {step === 2 && (
                        <motion.div
                          key="step-2"
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold mb-1">
                              Describe your project
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              The more detail you share, the better I can help.
                            </p>
                          </div>

                          {/* Summary chips */}
                          <div className="flex flex-wrap gap-1.5">
                            {selectedType && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                <selectedType.icon className="h-3 w-3" />
                                {selectedType.label}
                              </span>
                            )}
                            {formData.budget && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                                <DollarSign className="h-3 w-3" />
                                {formData.budget}
                              </span>
                            )}
                            {formData.timeline && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                                <Clock className="h-3 w-3" />
                                {formData.timeline}
                              </span>
                            )}
                          </div>

                          <Textarea
                            id="message"
                            placeholder={
                              isSimpleMessage
                                ? "Write your message…"
                                : "Describe what you're building, the problem you're solving, key features you need, and any technical requirements…"
                            }
                            className="min-h-45 sm:min-h-50 resize-none"
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                message: e.target.value,
                              })
                            }
                            required
                          />
                          <p className="text-[11px] text-muted-foreground">
                            {formData.message.length} characters
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Navigation buttons ── */}
                  <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-border bg-muted/30">
                    {step > 0 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep(step - 1)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                      </Button>
                    ) : (
                      <div />
                    )}

                    {step < 2 ? (
                      <Button
                        type="button"
                        size="sm"
                        disabled={
                          step === 0
                            ? !canProceedStep0
                            : !canProceedStep1
                        }
                        onClick={() => setStep(step + 1)}
                        className="gap-1"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        size="sm"
                        disabled={
                          !canSubmit || formState === "sending"
                        }
                        className="gap-1"
                      >
                        {formState === "sending" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
