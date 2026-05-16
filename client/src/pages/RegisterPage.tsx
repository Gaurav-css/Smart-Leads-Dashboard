import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/auth";

const inputClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, token } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("sales");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        ...(role === "admin" ? { adminKey } : {}),
      });
      navigate("/", { replace: true });
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 transition-colors duration-300 dark:bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm transition-colors duration-300 dark:bg-slate-800"
      >
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create Account</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Start managing your leads in one place.</p>

        <div className="mt-5 grid gap-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            className={inputClass}
            required
          />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className={inputClass}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password (min 8)"
            minLength={8}
            className={inputClass}
            required
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            className={inputClass}
          >
            <option value="sales">Sales User</option>
            <option value="admin">Admin</option>
          </select>
          {role === "admin" ? (
            <input
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Admin registration key"
              className={inputClass}
              required
            />
          ) : null}
        </div>

        {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Register"}
        </button>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-700 dark:text-brand-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
