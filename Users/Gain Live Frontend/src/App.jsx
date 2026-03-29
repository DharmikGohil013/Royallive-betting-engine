import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import FloatingChat from "./components/ui/FloatingChat";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-surface-dim text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <FloatingChat />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
