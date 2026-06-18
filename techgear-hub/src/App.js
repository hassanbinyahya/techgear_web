import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import AppRoutes from "./routes/AppRoutes";
import "./assets/styles/global.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
