import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading account...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

