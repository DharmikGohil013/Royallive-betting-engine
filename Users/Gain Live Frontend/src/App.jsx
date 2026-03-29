import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import FloatingChat from "./components/ui/FloatingChat";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface-dim md:bg-[url('/images/bg.jpg')] md:bg-cover md:bg-center md:bg-fixed">
        <div className="relative mx-auto min-h-screen bg-surface-dim text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container md:max-w-[430px] md:shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:border-x md:border-primary-container/20">
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
