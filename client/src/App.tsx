// router
import AppRouter from "@/router";
import { BrowserRouter as Router } from "react-router-dom";

import { RecoilRoot } from "recoil";

// contexts
import SocketProvider from "@/contexts/socket";
import UserProvider from "@/contexts/user";

function App() {
  return (
    <Router>
      <RecoilRoot>
        <SocketProvider>
          <UserProvider>
            <AppRouter />
          </UserProvider>
        </SocketProvider>
      </RecoilRoot>
    </Router>
  );
}

export default App;
