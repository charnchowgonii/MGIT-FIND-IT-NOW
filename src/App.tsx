import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LostItem from "./pages/LostItem";
import FoundItem from "./pages/FoundItem";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import ClaimItem from "./pages/ClaimItem";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ClaimHistoryPage from "./pages/ClaimHistoryPage";
const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/lost-item" element={<LostItem />} />
            <Route path="/found-item" element={<FoundItem />} />
            <Route path="/lost-items" element={<LostItems />} />
            <Route path="/found-items" element={<FoundItems />} />
            <Route path="/claim-item/:id" element={<ClaimItem />} />
            <Route path="/claim-history" element={<ClaimHistoryPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
export default App;
