// components
import ConferenceModal from "@/components/conference-modal";
import Board from "@/components/board";

// protected route wrapper
import ProtectedRoute from "@/router/protected";

export default function DrawingPage() {
  return (
    <ProtectedRoute>
      <Board />
      <ConferenceModal />
    </ProtectedRoute>
  );
}
