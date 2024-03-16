// router
import AppRouter from "@/router";
import { BrowserRouter as Router } from "react-router-dom";

// providers
import StoreProvider from "@/providers/store";
import SocketProvider from "@/providers/socket";
import UserProvider from "@/providers/user";

function App() {
  return (
    <Router>
      <StoreProvider>
        <SocketProvider>
          <UserProvider>
            <AppRouter />
          </UserProvider>
        </SocketProvider>
      </StoreProvider>
    </Router>
  );
}

export default App;
