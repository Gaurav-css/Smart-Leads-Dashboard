import { useEffect, useState } from "react";
import { Lead, LeadCreatePayload, LeadSource, LeadStatus } from "../../types/leads";

interface LeadFormModalProps {
  title: string;
  open: boolean;
  initialLead?: Lead;
  submitLabel: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: LeadCreatePayload) => Promise<void>;
}

const defaultValues: LeadCreatePayload = {
  name: "",
  email: "",
  status: "new",
  source: "website",
};

const inputClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-brand-600";

export const LeadFormModal = ({
  title,
  open,
  initialLead,
  submitLabel,
  loading,
  onClose,
  onSubmit,
}: LeadFormModalProps) => {
  const [form, setForm] = useState<LeadCreatePayload>(defaultValues);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!initialLead) {
      setForm(defaultValues);
      setError("");
      return;
    }

    setForm({
      name: initialLead.name,
      email: initialLead.email,
      status: initialLead.status,
      source: initialLead.source,
    });
    setError("");
  }, [initialLead, open]);

  if (!open) {
    return null;
  }

  const validate = (): string => {
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (!email) return "Email is required";
    // Basic email format check — mirrors backend z.email()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";

    return "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        status: form.status as LeadStatus,
        source: form.source as LeadSource,
      });
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Something went wrong. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl transition-colors duration-300 dark:bg-slate-800"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Close
          </button>
        </div>

        <div className="grid gap-3">
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Lead name"
            className={inputClass}
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Lead email"
            className={inputClass}
            required
          />
          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as LeadStatus }))}
              className={inputClass}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
            <select
              value={form.source}
              onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value as LeadSource }))}
              className={inputClass}
            >
              <option value="website">Website</option>
              <option value="instagram">Instagram</option>
              <option value="referral">Referral</option>
            </select>
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};
