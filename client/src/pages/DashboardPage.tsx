import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { LeadDetailsModal } from "../components/leads/LeadDetailsModal";
import { LeadFilters } from "../components/leads/LeadFilters";
import { LeadFormModal } from "../components/leads/LeadFormModal";
import { LeadTable } from "../components/leads/LeadTable";
import { Pagination } from "../components/leads/Pagination";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { leadsService } from "../services/leads.service";
import { PaginationMeta } from "../types/api";
import { Lead, LeadCreatePayload, LeadSort, LeadSource, LeadStatus } from "../types/leads";

const defaultMeta: PaginationMeta = {
  total: 0,
  page: 1,
  pages: 1,
  limit: 10,
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? "Request failed";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unexpected error occurred";
};

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5" />
    <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
  </svg>
);

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [records, setRecords] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(defaultMeta);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [source, setSource] = useState<LeadSource | "">("");
  const [sort, setSort] = useState<LeadSort>("latest");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [detailsLead, setDetailsLead] = useState<Lead | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 400);

  const query = useMemo(
    () => ({
      page,
      ...(status ? { status } : {}),
      ...(source ? { source } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      sort,
    }),
    [debouncedSearch, page, sort, source, status],
  );

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError("");

    leadsService
      .list(query)
      .then((result) => {
        if (!active) {
          return;
        }
        setRecords(result.records);
        setMeta(result.meta);
      })
      .catch((requestError) => {
        if (active) {
          setError(getErrorMessage(requestError));
          setRecords([]);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [query]);

  const handleFilterChange = (next: {
    search?: string;
    status?: LeadStatus | "";
    source?: LeadSource | "";
    sort?: LeadSort;
  }) => {
    if (next.search !== undefined) {
      setSearch(next.search);
    }
    if (next.status !== undefined) {
      setStatus(next.status);
    }
    if (next.source !== undefined) {
      setSource(next.source);
    }
    if (next.sort !== undefined) {
      setSort(next.sort);
    }
    setPage(1);
  };

  const reloadCurrentPage = () => {
    leadsService
      .list(query)
      .then((result) => {
        setRecords(result.records);
        setMeta(result.meta);
      })
      .catch((requestError) => {
        setError(getErrorMessage(requestError));
      });
  };

  const handleCreate = async (payload: LeadCreatePayload) => {
    setIsFormSubmitting(true);
    try {
      await leadsService.create(payload);
      setShowCreateModal(false);
      reloadCurrentPage();
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleUpdate = async (payload: LeadCreatePayload) => {
    if (!editingLead) {
      return;
    }
    setIsFormSubmitting(true);
    try {
      await leadsService.update(editingLead._id, payload);
      setEditingLead(null);
      reloadCurrentPage();
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDelete = async (lead: Lead) => {
    const confirmed = window.confirm(`Delete lead "${lead.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await leadsService.remove(lead._id);
      reloadCurrentPage();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const handleView = async (leadId: string) => {
    setIsDetailsLoading(true);
    setDetailsLead(null);
    try {
      const lead = await leadsService.getById(leadId);
      setDetailsLead(lead);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError("");
    try {
      const csvBlob = await leadsService.exportCsv(query);
      const fileUrl = window.URL.createObjectURL(csvBlob);
      const anchor = document.createElement("a");
      anchor.href = fileUrl;
      anchor.download = "leads.csv";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(fileUrl);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 transition-colors duration-300 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Smart Leads Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Signed in as {user?.name} ({user?.role})
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Add Lead
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-5">
        <LeadFilters
          search={search}
          status={status}
          source={source}
          sort={sort}
          onChange={handleFilterChange}
          onExport={handleExport}
          exportLoading={isExporting}
        />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            Loading leads...
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            No leads found. Try adjusting your filters or add a new lead.
          </div>
        ) : (
          <>
            <LeadTable leads={records} role={user?.role ?? "sales"} onView={handleView} onEdit={setEditingLead} onDelete={handleDelete} />
            <Pagination meta={meta} onChange={setPage} />
          </>
        )}
      </main>

      <LeadFormModal
        title="Create Lead"
        open={showCreateModal}
        submitLabel="Create"
        loading={isFormSubmitting}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />

      <LeadFormModal
        title="Edit Lead"
        open={Boolean(editingLead)}
        initialLead={editingLead ?? undefined}
        submitLabel="Update"
        loading={isFormSubmitting}
        onClose={() => setEditingLead(null)}
        onSubmit={handleUpdate}
      />

      <LeadDetailsModal lead={detailsLead} loading={isDetailsLoading} onClose={() => setDetailsLead(null)} />
    </div>
  );
};
