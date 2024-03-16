import { Routes, Route } from 'react-router-dom';

// pages
import Home from '@/pages/Home';
import DrawingRoom from '@/pages/DrawingRoom';

function AppRouter() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<DrawingRoom />} />
      </Routes>
  );
}

export default AppRouter;