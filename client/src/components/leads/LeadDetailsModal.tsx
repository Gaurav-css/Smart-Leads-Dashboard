import { Lead } from "../../types/leads";

interface LeadDetailsModalProps {
  lead: Lead | null;
  loading: boolean;
  onClose: () => void;
}

export const LeadDetailsModal = ({ lead, loading, onClose }: LeadDetailsModalProps) => {
  if (!lead && !loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl transition-colors duration-300 dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Lead Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Close
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading lead details...</p>
        ) : lead ? (
          <dl className="grid gap-3 text-sm">
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Name</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{lead.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Email</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{lead.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Status</dt>
              <dd className="font-medium capitalize text-slate-800 dark:text-slate-100">{lead.status}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Source</dt>
              <dd className="font-medium capitalize text-slate-800 dark:text-slate-100">{lead.source}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Created</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{new Date(lead.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </div>
  );
};
