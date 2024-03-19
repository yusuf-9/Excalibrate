import { Routes, Route } from 'react-router-dom';

// pages
import Home from '@/pages/Home';
import DrawingRoom from '@/pages/DrawingRoom';

// protected route wrapper
import ProtectedRoute from "./protected"

function AppRouter() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={
          <ProtectedRoute>
            <DrawingRoom />
          </ProtectedRoute>
        } 
        />
      </Routes>
  );
}

export default AppRouter;