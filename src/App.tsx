import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/ui/cart/CartProvider";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import OrderDetail from "./pages/OrderDetail";
import Contact from "./pages/Contact";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import {RequireAuth} from "@/components/auth/RequireAuth.tsx";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>
              <Route
                  path="/"
                  element={<Index />}
              />

              <Route
                  path="/produit/:id"
                  element={<ProductDetail />}
              />

              <Route
                  path="/contact"
                  element={<Contact />}
              />

              <Route
                  path="/rendez-vous"
                  element={<Appointments />}
              />

              <Route
                  path="/commande"
                  element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  }
              />

              <Route
                  path="/suivi"
                  element={
                    <RequireAuth>
                      <OrderTracking />
                    </RequireAuth>
                  }
              />

              <Route
                  path="/suivi/:id"
                  element={
                    <RequireAuth>
                      <OrderDetail />
                    </RequireAuth>
                  }
              />

              <Route
                  path="*"
                  element={<NotFound />}
              />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;