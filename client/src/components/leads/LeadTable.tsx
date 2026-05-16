import { Lead } from "../../types/leads";
import { UserRole } from "../../types/auth";

interface LeadTableProps {
  leads: Lead[];
  role: UserRole;
  onView: (leadId: string) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const statusClassMap: Record<Lead["status"], string> = {
  new: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  contacted: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  qualified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  lost: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export const LeadTable = ({ leads, role, onView, onEdit, onDelete }: LeadTableProps) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-700">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
              <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{lead.name}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{lead.email}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClassMap[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-3 capitalize text-slate-700 dark:text-slate-300">{lead.source}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onView(lead._id)}
                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(lead)}
                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Edit
                  </button>
                  {role === "admin" ? (
                    <button
                      type="button"
                      onClick={() => onDelete(lead)}
                      className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
