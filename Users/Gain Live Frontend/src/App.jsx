import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import FloatingChat from "./components/ui/FloatingChat";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface-dim">
        <div className="pointer-events-none fixed inset-0 hidden md:block bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="relative mx-auto min-h-screen bg-surface-dim text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container md:max-w-[460px] md:shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:border-x md:border-primary-container/20">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
          <FloatingChat />
          <BottomNav />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
