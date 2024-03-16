// components
import ConferenceModal from "@/components/conference-modal";
import Board from "@/components/board";

// providers
import ProtectedRoute from "@/providers/protected-route";

export default function DrawingPage() {
  return (
    <ProtectedRoute>
      <Board />
      <ConferenceModal />
    </ProtectedRoute>
  );
}
