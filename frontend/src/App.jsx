import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import UserProfile from "./components/profile/UserProfile";
import EditUserProfile from "./components/profile/EditUserProfile";
import AdminPage from "./pages/AdminPage";
import UserList from "./components/admin/UserList";
import Statistics from "./components/admin/Statistics";

const AppContent = () => {
  // Hook para obtener la ruta actual
  const location = useLocation();

  // Definir las rutas donde no quieres mostrar el Header y Footer
  const hideHeaderFooter = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );

  return (
    <div>
      {/* Condicional para mostrar u ocultar Header */}
      {!hideHeaderFooter && <Header />}

      <Routes>
        {/* Ruta pública para el login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta pública para el registro */}
        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditUserProfile />} />

        {/* Ruta protegida para el Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para la página de administrador */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        >
          {/* Rutas hijas para el panel de administración */}
          <Route path="usuarios" element={<UserList />} />
          <Route path="estadisticas" element={<Statistics />} />
        </Route>

        {/* Redirigir por defecto al login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>

      {/* Condicional para mostrar u ocultar Footer */}
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
