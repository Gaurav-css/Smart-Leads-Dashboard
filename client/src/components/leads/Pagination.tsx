import { PaginationMeta } from "../../types/api";

interface PaginationProps {
  meta: PaginationMeta;
  onChange: (nextPage: number) => void;
}

export const Pagination = ({ meta, onChange }: PaginationProps) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800">
    <p className="text-slate-600 dark:text-slate-400">
      Page <span className="font-medium text-slate-800 dark:text-slate-100">{meta.page}</span> of{" "}
      <span className="font-medium text-slate-800 dark:text-slate-100">{meta.pages}</span> • {meta.total} total
    </p>
    <div className="flex gap-2">
      <button
        type="button"
        disabled={meta.page <= 1}
        onClick={() => onChange(meta.page - 1)}
        className="rounded border border-slate-300 px-3 py-1.5 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        Previous
      </button>
      <button
        type="button"
        disabled={meta.page >= meta.pages}
        onClick={() => onChange(meta.page + 1)}
        className="rounded border border-slate-300 px-3 py-1.5 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        Next
      </button>
    </div>
  </div>
);
