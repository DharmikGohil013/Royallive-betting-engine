import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import FloatingChat from "./components/ui/FloatingChat";
import Loader from "./components/ui/Loader";
import HomePage from "./pages/HomePage";
import AuthLayout from "./components/layout/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function AppContent() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Loader isVisible={isLoading} />
      <div className="min-h-screen bg-surface-dim">
        <div className="pointer-events-none fixed inset-0 hidden md:block bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="relative mx-auto min-h-screen bg-surface-dim text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container md:max-w-[460px] md:shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:border-x md:border-primary-container/20">
          {!isAuthRoute && <Header />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <AuthLayout title="Initialize Access">
                  <LoginPage />
                </AuthLayout>
              }
            />
            <Route
              path="/register"
              element={
                <AuthLayout title="Access Node Registration">
                  <RegisterPage />
                </AuthLayout>
              }
            />
          </Routes>
          {!isAuthRoute && <FloatingChat />}
          {!isAuthRoute && <BottomNav />}
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
