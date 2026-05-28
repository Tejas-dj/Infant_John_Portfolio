"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROJECT_TYPES = [
  "Select Project Type",
  "Brand Reel / Commercial",
  "Automotive Photography / Video",
  "Event Coverage",
  "Portrait Session",
  "Product Photography",
  "Podcast / Interview",
  "Other",
];

interface Fields {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

type Errors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim())    e.name    = "Name is required";
  if (!f.email.trim())   e.email   = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email";
  if (!f.message.trim()) e.message = "Message is required";
  return e;
}

function Field({
  id, label, error, children,
}: {
  id: string; label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/45 mb-2 block">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="font-body text-xs text-[#C0392B] mt-1.5"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputBase =
  "w-full bg-transparent border px-4 py-3 font-body text-sm text-charcoal placeholder:text-charcoal/25 focus:outline-none transition-colors duration-200";
const inputIdle  = "border-warm-gray/50 focus:border-gold";
const inputError = "border-[#C0392B]/60 focus:border-[#C0392B]";

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>({
    name: "", email: "", projectType: "", message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof Fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFields(prev => ({ ...prev, [k]: e.target.value }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll first error into view
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }
    setLoading(true);
    // Phase 3: wire to a real endpoint / email service
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-16 text-center"
      >
        <span className="block text-gold text-3xl mb-6">✦</span>
        <h3 className="font-heading text-2xl text-charcoal font-bold mb-4">Message Sent</h3>
        <p className="font-body text-charcoal/55 max-w-sm mx-auto leading-[1.85] text-sm">
          Thank you, {fields.name.split(" ")[0]}. I'll be in touch within 24 hours — looking
          forward to hearing more about your project.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Field id="name" label="Your Name" error={errors.name}>
          <input
            id="name" type="text" name="name" autoComplete="name"
            value={fields.name} onChange={set("name")} placeholder="John Smith"
            className={`${inputBase} ${errors.name ? inputError : inputIdle}`}
          />
        </Field>
        <Field id="email" label="Email Address" error={errors.email}>
          <input
            id="email" type="email" name="email" autoComplete="email"
            value={fields.email} onChange={set("email")} placeholder="hello@company.com"
            className={`${inputBase} ${errors.email ? inputError : inputIdle}`}
          />
        </Field>
      </div>

      <Field id="projectType" label="Project Type">
        <select
          id="projectType" name="projectType"
          value={fields.projectType} onChange={set("projectType")}
          className={`${inputBase} ${inputIdle} bg-canvas appearance-none`}
        >
          {PROJECT_TYPES.map(t => (
            <option key={t} value={t === "Select Project Type" ? "" : t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Tell Me About Your Project" error={errors.message}>
        <textarea
          id="message" name="message" rows={6}
          value={fields.message} onChange={set("message")}
          placeholder="Share your vision, timeline, and any details that feel relevant..."
          className={`${inputBase} ${errors.message ? inputError : inputIdle} resize-none`}
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="relative px-10 py-4 bg-gold text-canvas font-body text-xs tracking-[0.2em] uppercase hover:bg-gold/85 transition-colors disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Sending…
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Send Message
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </form>
  );
}
