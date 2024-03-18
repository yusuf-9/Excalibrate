import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// hooks
import { useUser } from "@/hooks/useUser";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate(`/?roomId=${roomId}`, { replace: true });
    }
  }, [user, navigate, roomId]);

  return user && children;
};

export default ProtectedRoute;
