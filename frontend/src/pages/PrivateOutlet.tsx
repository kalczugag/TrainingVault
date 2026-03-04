import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useRefreshTokenQuery } from "@/store";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/Loading";

const RequireAuth = () => {
    const { token } = useAuth();
    const location = useLocation();

    const { isLoading, isFetching } = useRefreshTokenQuery(undefined, {
        skip: !!token,
    });

    const loading = isLoading || isFetching;

    if (loading) {
        return <Loading isLoading={true} />;
    }

    return token ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};
export default RequireAuth;
