import { LeadSort, LeadSource, LeadStatus } from "../../types/leads";

interface LeadFiltersProps {
  search: string;
  status: LeadStatus | "";
  source: LeadSource | "";
  sort: LeadSort;
  onChange: (next: { search?: string; status?: LeadStatus | ""; source?: LeadSource | ""; sort?: LeadSort }) => void;
  onExport: () => void;
  exportLoading: boolean;
}

const selectClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-brand-600";

export const LeadFilters = ({
  search,
  status,
  source,
  sort,
  onChange,
  onExport,
  exportLoading,
}: LeadFiltersProps) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800">
    <div className="grid gap-3 md:grid-cols-5">
      <input
        value={search}
        onChange={(event) => onChange({ search: event.target.value })}
        placeholder="Search by name or email..."
        className={`md:col-span-2 ${selectClass}`}
      />

      <select
        value={status}
        onChange={(event) => onChange({ status: (event.target.value as LeadStatus | "") || "" })}
        className={selectClass}
      >
        <option value="">All Statuses</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="lost">Lost</option>
      </select>

      <select
        value={source}
        onChange={(event) => onChange({ source: (event.target.value as LeadSource | "") || "" })}
        className={selectClass}
      >
        <option value="">All Sources</option>
        <option value="website">Website</option>
        <option value="instagram">Instagram</option>
        <option value="referral">Referral</option>
      </select>

      <div className="flex gap-2">
        <select
          value={sort}
          onChange={(event) => onChange({ sort: event.target.value as LeadSort })}
          className={`w-full ${selectClass}`}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
        <button
          type="button"
          onClick={onExport}
          disabled={exportLoading}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-600 dark:hover:bg-slate-500"
        >
          {exportLoading ? "..." : "CSV"}
        </button>
      </div>
    </div>
  </div>
);
