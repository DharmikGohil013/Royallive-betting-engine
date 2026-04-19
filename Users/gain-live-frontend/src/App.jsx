import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import FloatingChat from "./components/ui/FloatingChat";
import Loader from "./components/ui/Loader";
import HomePage from "./pages/HomePage";
import GamesPage from "./pages/GamesPage";
import SportsPage from "./pages/SportsPage";
import LiveCasinoPage from "./pages/LiveCasinoPage";
import CricketPage from "./pages/CricketPage";
import WalletPage from "./pages/WalletPage";
import AccountPage from "./pages/AccountPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import ReferFriendPage from "./pages/ReferFriendPage";
import PromotionsPage from "./pages/PromotionsPage";
import AboutPage from "./pages/AboutPage";
import ResponsibleGamingPage from "./pages/ResponsibleGamingPage";
import ContactUsPage from "./pages/ContactUsPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import SupportHubPage from "./pages/SupportHubPage";
import LiveChatPage from "./pages/LiveChatPage";
import VipPage from "./pages/VipPage";
import AuthLayout from "./components/layout/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function AppContent() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
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
            {/* Auth routes — redirect to home if already logged in */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <AuthLayout title="Initialize Access">
                    <LoginPage />
                  </AuthLayout>
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <AuthLayout title="Access Node Registration">
                    <RegisterPage />
                  </AuthLayout>
                )
              }
            />

            {/* All protected routes */}
            <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/games" element={<PrivateRoute><GamesPage /></PrivateRoute>} />
            <Route path="/sports" element={<PrivateRoute><SportsPage /></PrivateRoute>} />
            <Route path="/live-casino" element={<PrivateRoute><LiveCasinoPage /></PrivateRoute>} />
            <Route path="/cricket" element={<PrivateRoute><CricketPage /></PrivateRoute>} />
            <Route path="/wallet" element={<PrivateRoute><WalletPage /></PrivateRoute>} />
            <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
            <Route path="/privacy" element={<PrivateRoute><PrivacyPolicyPage /></PrivateRoute>} />
            <Route path="/help" element={<PrivateRoute><HelpCenterPage /></PrivateRoute>} />
            <Route path="/refer" element={<PrivateRoute><ReferFriendPage /></PrivateRoute>} />
            <Route path="/promotions" element={<PrivateRoute><PromotionsPage /></PrivateRoute>} />
            <Route path="/about" element={<PrivateRoute><AboutPage /></PrivateRoute>} />
            <Route path="/responsible-gaming" element={<PrivateRoute><ResponsibleGamingPage /></PrivateRoute>} />
            <Route path="/contact" element={<PrivateRoute><ContactUsPage /></PrivateRoute>} />
            <Route path="/cookie-policy" element={<PrivateRoute><CookiePolicyPage /></PrivateRoute>} />
            <Route path="/support" element={<PrivateRoute><SupportHubPage /></PrivateRoute>} />
            <Route path="/live-chat" element={<PrivateRoute><LiveChatPage /></PrivateRoute>} />
            <Route path="/vip" element={<PrivateRoute><VipPage /></PrivateRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
